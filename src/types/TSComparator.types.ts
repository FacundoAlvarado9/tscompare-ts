export type NDimensionalPoint = Array<number>;
export type TimeSeries = Array<NDimensionalPoint>;
export type Pair<T> = {
    first: T;
    second: T;
}
export type Path = Array<Pair<number>>;
export type ResultEntry = {
    index : number;
    warping : number;
    distance : number;
    misalignment : number;
    degree_of_misalignment : number;
}
export type ComparisonResult = Array<ResultEntry>;