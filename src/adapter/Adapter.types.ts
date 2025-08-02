import { ComparisonResult } from "../types/TSComparator.types";

export type Cell = string;
export type Header = string;

export type Row = Array<Cell>;

export type TableData = {
    headers : Array<Header>;
    data : Array<Row>;
};

export type AdaptedResult = {
    status : "Success" | "Error";
    errorMessage? : any;
    result ?: ComparisonResult;
}