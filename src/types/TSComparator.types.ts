export type NDimensionalPoint = Array<number>;
export type TimeSeries = Array<NDimensionalPoint>;
export type Pair<T> = {
    first: T;
    second: T;
}
export type Path = Array<Pair<number>>
export type ComparisonResult = {
    warping : Array<number>;
    distance : Array<number>;
    misalignment : Array<number>;
    degree_of_misalignment : Array<number>;    
}