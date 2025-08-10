import { hasNumericValue} from "mathjs";
import { AdaptedResult, Row, TableData } from "./Adapter.types";
import { TSComparator } from "../TSComparator";
import { NDimensionalPoint, TimeSeries } from "../types/TSComparator.types";

export interface ITableDataComparator {
    compare(reference : TableData, target : TableData) : AdaptedResult;
}

export class TableDataComparator implements ITableDataComparator {

    private adaptee : TSComparator;
    private refTimestampColumnIndex!: number;
    private targetTimestampColumnIndex!: number;

    constructor(adaptee : TSComparator, referenceTimestampCol? : number, targetTimestampColumnIndex? : number){
        if(referenceTimestampCol){
            this.refTimestampColumnIndex = referenceTimestampCol;
        } else {
            this.refTimestampColumnIndex = -1;
        }
        if(targetTimestampColumnIndex){
            this.targetTimestampColumnIndex = targetTimestampColumnIndex;
        } else {
            this.refTimestampColumnIndex = -1;
        }
        this.adaptee = adaptee;
    }

    public setReferenceTimestampColumnIndex(columnIndex : number) : void{
        this.refTimestampColumnIndex = columnIndex;
    }

    public setTargetTimestampColumnIndex(columnIndex : number) : void{
        this.targetTimestampColumnIndex = columnIndex;
    }

    compare(reference: TableData, target: TableData): AdaptedResult {
        let adaptedResult : AdaptedResult;
        try {
            const referenceTS : TimeSeries = this.convertToTimeSeries(reference, this.refTimestampColumnIndex);
            const targetTS : TimeSeries = this.convertToTimeSeries(target, this.targetTimestampColumnIndex);            
            adaptedResult = {status: "Success", result: this.adaptee.compare(referenceTS, targetTS)}
        } catch (error) {
            let message;
            if(error instanceof Error){
                message = error.message;
            } else {
                message = error;
            }
            adaptedResult = {status: "Error", errorMessage: message}
        }
        return adaptedResult;
    }

    private convertToTimeSeries (tableData : TableData, timestampColumn : number) : TimeSeries {
        let tableToConvert : TableData;
        const hasTimestampColumn = (timestampColumn != -1);
        if(hasTimestampColumn){
            tableToConvert = this.orderTimestampedData(tableData, timestampColumn);
        } else {
            tableToConvert = tableData;
        }
        return this.parseIntoTimeSeries(tableToConvert, timestampColumn);
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

    private parseIntoTimeSeries(table : TableData, timestampColumn : number) : TimeSeries {
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