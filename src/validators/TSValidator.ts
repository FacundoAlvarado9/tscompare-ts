import { TimeSeries } from "../types/TSComparator.types";

export class TSValidator {
    public static validate(reference : TimeSeries, target : TimeSeries) : void {
        if(getConsistentDimensions(reference) != getConsistentDimensions(target)){
            throw new Error("Both time-series must have the same dimensionality in order to be compared.");            
        }
        if(!allPointsAreNumeric(reference) || !allPointsAreNumeric(target)){
            throw new Error("Time-series must contain only numeric values");
        }
    }
}

function getConsistentDimensions(ts: TimeSeries) : number {
    let hasConsistentDimensions = true;

    const row_count = ts.length;
    const expected_variable_count = ts[0].length;

    for(let i=0; i<row_count && hasConsistentDimensions; i++){
        const current_var_count = ts[i].length;
        if(current_var_count != expected_variable_count){
            hasConsistentDimensions = false;
        }            
    }

    if(!hasConsistentDimensions){
        throw new Error("Dimensions must be consistent across all the points of a time-series.");
    }

    return expected_variable_count;
}

function allPointsAreNumeric(ts : TimeSeries){
    let allNumeric = true;
    const row_count = ts.length;

    for(let i=0; i<row_count && allNumeric; i++){
        let current_point = ts[i];
        if(!isNumeric(current_point)){
            allNumeric = false;
        }
    }
    return allNumeric;
}

function isNumeric(point : Array<any>) : boolean {
    let isNumeric = true;
    for(let i=0; i<point.length && isNumeric; i++){
        if(!(typeof point[i] == 'number') || isNaN(point[i])){
            isNumeric = false;
        }
    }
    return isNumeric;
}