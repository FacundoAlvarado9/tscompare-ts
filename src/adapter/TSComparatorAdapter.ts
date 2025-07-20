import { hasNumericValue} from "mathjs";
import { ComparisonResult, DistanceStrategy, NDimensionalPoint, Row, TableData, TimeSeries, TSComparator } from "..";

export interface ITableDataComparator {
    setStrategy(distanceStrategy : DistanceStrategy) : void;
    runComparison(reference : TableData, target : TableData) : ComparisonResult;
}

export class TableDataComparator implements ITableDataComparator {

    private adaptee : TSComparator;
    private refTimestampCol!: string;
    private targetTimestampCol!: string;

    constructor(adaptee : TSComparator, referenceTimestampCol? : string, targetTimestampCol? : string){
        if(referenceTimestampCol){
            this.refTimestampCol = referenceTimestampCol;
        }
        if(targetTimestampCol){
            this.targetTimestampCol = targetTimestampCol;
        }
        this.adaptee = adaptee;
    }

    public setReferenceTimestampColumn(columnName : string) : void{
        this.refTimestampCol = columnName;
    }

    public setTargetTimestampColumn(columnName : string) : void{
        this.targetTimestampCol = columnName;
    }

    setStrategy(distanceStrategy: DistanceStrategy): void {
        this.adaptee.setStrategy(distanceStrategy);
    }

    runComparison(reference: TableData, target: TableData): ComparisonResult {        
        const referenceTS : TimeSeries = this.convertToTimeSeries(reference, this.refTimestampCol);
        const targetTS : TimeSeries = this.convertToTimeSeries(target, this.targetTimestampCol);

        return this.adaptee.runComparison(referenceTS, targetTS);
    }

    private convertToTimeSeries (tableData : TableData, timestampColumn : string) : TimeSeries {
        let tableToConvert : TableData;
        const timestampColIndex = tableData.headers.indexOf(timestampColumn);
        const hasTimestampColumn = (timestampColIndex != -1);
        if(hasTimestampColumn){
            tableToConvert = this.orderTimestampedData(tableData, timestampColumn);            
        } else {
            tableToConvert = tableData;
        }
        return this.getTimeSeries(tableToConvert, timestampColumn);
    }

    private orderTimestampedData(table : TableData, timestampColumn : string) : TableData {
        const tableWithParsedTimestamps = this.parseTimestamps(table, timestampColumn);
        return this.sortTable(tableWithParsedTimestamps, timestampColumn);
    }

    private parseTimestamps(table : TableData, timestampColumn : string) : TableData {
        const timestampColIndex = table.headers.indexOf(timestampColumn);
        const newRows : Row[] = table.data.map((row) =>{
                        const newRow = [...row]
                        newRow[timestampColIndex] = Date.parse(row[timestampColIndex]).toString();
                        return newRow;
                    });
        return { headers: table.headers, data: newRows } as TableData;    
    }

    private sortTable(table : TableData, timestampColumn : string) : TableData {
        const timestampColIndex = table.headers.indexOf(timestampColumn);
        const newRows = [...table.data].sort((a : Row, b : Row) => {
            return (Number(a[timestampColIndex]) - Number(b[timestampColIndex]));
            });
        return { headers: table.headers, data: newRows } as TableData;
    }

    private getTimeSeries(table : TableData, timestampColumn : string) : TimeSeries {
        const timestampColIndex = table.headers.indexOf(timestampColumn);
        const ts : TimeSeries = [];
        table.data.forEach((row) => {
            const point : NDimensionalPoint = [];
            row.forEach((cellContent, index) => {
                if(index != timestampColIndex){
                    if(cellContent == ""){
                        throw new Error("There must be no empty cells.");                    
                    }
                    if(!hasNumericValue(cellContent)){
                        throw new Error("All cells must contain numeric values.");
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