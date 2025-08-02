import { hasNumericValue} from "mathjs";
import { ComparisonResult, DistanceStrategy, NDimensionalPoint, Row, TableData, TimeSeries, TSComparator } from "..";

export interface ITableDataComparator {
    setStrategy(distanceStrategy : DistanceStrategy) : void;
    runComparison(reference : TableData, target : TableData) : ComparisonResult;
}

export class TableDataComparator implements ITableDataComparator {

    private adaptee : TSComparator;
    private refTimestampCol!: number;
    private targetTimestampCol!: number;

    constructor(adaptee : TSComparator, referenceTimestampCol? : number, targetTimestampCol? : number){
        if(referenceTimestampCol){
            this.refTimestampCol = referenceTimestampCol;
        } else {
            this.refTimestampCol = -1;
        }
        if(targetTimestampCol){
            this.targetTimestampCol = targetTimestampCol;
        } else {
            this.refTimestampCol = -1;
        }
        this.adaptee = adaptee;
    }

    public setReferenceTimestampColumn(columnIndex : number) : void{
        this.refTimestampCol = columnIndex;
    }

    public setTargetTimestampColumn(columnIndex : number) : void{
        this.targetTimestampCol = columnIndex;
    }

    setStrategy(distanceStrategy: DistanceStrategy): void {
        this.adaptee.setStrategy(distanceStrategy);
    }

    runComparison(reference: TableData, target: TableData): ComparisonResult {
        const referenceTS : TimeSeries = this.convertToTimeSeries(reference, this.refTimestampCol);
        const targetTS : TimeSeries = this.convertToTimeSeries(target, this.targetTimestampCol);

        return this.adaptee.runComparison(referenceTS, targetTS);
    }

    private convertToTimeSeries (tableData : TableData, timestampColumn : number) : TimeSeries {
        let tableToConvert : TableData;
        const hasTimestampColumn = (timestampColumn != -1);
        if(hasTimestampColumn){
            tableToConvert = this.orderTimestampedData(tableData, timestampColumn);
        } else {
            tableToConvert = tableData;
        }
        return this.getTimeSeries(tableToConvert, timestampColumn);
    }

    private orderTimestampedData(table : TableData, timestampColumn : number) : TableData {
        const tableWithParsedTimestamps = this.parseTimestamps(table, timestampColumn);
        return this.sortTable(tableWithParsedTimestamps, timestampColumn);
    }

    private parseTimestamps(table : TableData, timestampColumn : number) : TableData {
        const newRows : Row[] = table.data.map((row) =>{
                        const newRow = [...row]
                        newRow[timestampColumn] = Date.parse(row[timestampColumn]).toString();
                        return newRow;
                    });
        return { headers: table.headers, data: newRows } as TableData;    
    }

    private sortTable(table : TableData, timestampColumn : number) : TableData {
        const newRows = [...table.data].sort((a : Row, b : Row) => {
            return (Number(a[timestampColumn]) - Number(b[timestampColumn]));
            });
        return { headers: table.headers, data: newRows } as TableData;
    }

    private getTimeSeries(table : TableData, timestampColumn : number) : TimeSeries {
        const ts : TimeSeries = [];
        table.data.forEach((row, rowIndex) => {
            const point : NDimensionalPoint = [];
            row.forEach((cellContent, cellIndex) => {
                if(cellIndex != timestampColumn){
                    if(cellContent == ""){
                        throw new Error("There must be no empty cells.");                    
                    }
                    if(!hasNumericValue(cellContent)){
                        throw new Error("Cell "+cellIndex+" at row "+rowIndex+" must contain numeric values.");
                    }
                    const parsedCell = Number(cellContent)
                    point.push(parsedCell);
                }
            });
            ts.push(point);
        });
        return ts;        
    }

}