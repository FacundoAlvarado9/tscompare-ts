export type NDimensionalPoint = Array<number>;
export type TimeSeries = Array<NDimensionalPoint>;
export type ComparisonResult = {
    distance : Array<number>;
    misalignment : Array<number>;
    degree_of_misalignment : Array<number>;    
}