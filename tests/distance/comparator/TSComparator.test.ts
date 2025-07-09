import { TimeSeries, TSComparator, UnweightedEuclidean } from "../../../src";

describe("Time-Series Comparator tests", () => {

    const comparator = new TSComparator();
    comparator.setStrategy(new UnweightedEuclidean());

    describe("Invalid inputs ", () => {

        const emptyTS : TimeSeries = [];
        const validTS : TimeSeries = [[1,-2], [25,54], [12.3,-8.2], [122,1]];
        const dimensionallyInconsistentTS : TimeSeries = [[1,-2,0], [25,54,4.5], [-8.2], [122,1]];

        test("Comparison is not possible for empty time-series", () =>{
            expect(comparator.)
        });
    });
});