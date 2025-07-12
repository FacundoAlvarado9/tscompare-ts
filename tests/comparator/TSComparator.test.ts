import { TSComparator, UnweightedEuclidean, TimeSeries, ComparisonResult } from "../../src";

describe("Time-Series Comparator tests", () => {

    const comparator = new TSComparator();
    comparator.setStrategy(new UnweightedEuclidean());

    describe("Invalid inputs ", () => {

        const emptyTS : TimeSeries = [];
        const validTS : TimeSeries = [[1,-2], [25,54], [12.3,-8.2], [122,1]];
        const dimensionallyInconsistentTS : TimeSeries = [[1,-2,0], [25,54,4.5], [-8.2], [122,1]];

        test("Comparison is not possible for empty time-series", () =>{
            expect(() => comparator.runComparison(emptyTS, emptyTS)).toThrow();
            expect(() => comparator.runComparison(emptyTS, validTS)).toThrow();
        });

        test("Comparison is not possible for dimensionally inconsistent time-series", () => {
            expect(() => comparator.runComparison(dimensionallyInconsistentTS, validTS)).toThrow();
        });
    });

    describe("Valid input 1 ", () => {

        const reference =   [[9],[0],[1.1],[0.23],[6],[-10.9],[-3.2]];

        const target = [[5.1], [-7.23], [2.5], [0.3], [0]];

        
        const expectedWarping = [0,1,2,3,3,4,4];
        const expectedMisalignment = [0,0,0,0,-1,-1,-2];
        const expectedDistance = [3.9,7.23,1.4,0.07,5.7,10.9,3.2];
        const expectedDegreeOfMisalignment = [ 0,0,0,-1,0,-1,-1 ];
        let result : ComparisonResult;
        
        beforeAll(() => {
            result = comparator.runComparison(reference, target)
        });

        test("Check distance correctness", () => {
            expect(result.distance.length).toEqual(expectedDistance.length);
            result.distance.forEach((actualDistance, index) => {
                expect(actualDistance).toBeCloseTo(expectedDistance[index]);
            });
        });

        test("Check warping correctness", () => {
            expect(result.warping).toEqual(expectedWarping);
            expect(result.warping.length).toEqual(expectedWarping.length);
        });

        test("Check misalignment correctness", () => {
            expect(result.misalignment).toEqual(expectedMisalignment);
            expect(result.misalignment.length).toEqual(expectedMisalignment.length);
        });

        test("Check misalignment degree correctness", () => {
            expect(result.degree_of_misalignment.length).toEqual(expectedDegreeOfMisalignment.length);
            result.degree_of_misalignment.forEach((actualDegree, index) => {
                expect(actualDegree).toBeLessThanOrEqual(1);
                expect(actualDegree).toBeGreaterThanOrEqual(-1);
                expect(actualDegree).toBeCloseTo(expectedDegreeOfMisalignment[index]);
            });
        });
        
    });

    describe("Valid input 2 ", () => {

        const reference =   [[13.27, -6.14, 5.33], [-4.78, 10.19, -11.82], [1.76, 6.44, 8.28], 
                            [3.91, -13.93, -0.64], [-12.07, 5.7, -3.28], [7.66, -10.4, 2.01],
                            [0.49, -8.31, 12.96], [-6.55, 3.27, -9.91], [14.81, 1.33, -2.54],
                            [-1.89, 11.07, 6.12], [-14.08, -5.98, 7.71], [5.86, -7.01, -12.43],
                            [2.77, 0.59, 13.26], [-9.03, 8.41, 1.17], [6.91, -1.23, -4.67], 
                            [3.17, 12.87, 9.41], [-2.01, -6.16, 0.33], [11.64, 4.25, -5.78],
                            [0.0, -14.35, 7.65], [-5.41, 9.88, -13.34]];

        const target = [[-8.92, 12.34, -3.76], [5.21, -14.88, 9.63], [0.14, 6.25, -13.72],
                        [-11.56, 2.49, 7.3], [3.62, -1.21, 10.58], [14.93, -6.77, 4.05],
                        [-12.14, 13.02, -2.64], [7.55, -9.88, 11.21], [-5.93, 4.76, -10.01],
                        [2.88, 0.42, -7.9], [-0.55, -3.18, 6.77], [10.34, 14.29, -12.36],
                        [-6.12, -4.04, 3.15], [8.91, -1.7, 1.08], [9.99, -7.75, 5.27],
                        [1.2, 3.47, -5.85], [-9.22, 8.67, 12.14], [4.5, -11.03, -6.38],
                        [-13.74, 7.91, 2.69], [6.23, 0.0, -8.91], [-3.52, 12.18, -6.44],
                        [7.11, -2.05, 14.33], [-10.86, 4.92, 1.01], [0.39, -13.27, 11.76],
                        [6.55, 3.84, -1.63], [-7.72, -4.28, 2.93], [13.04, 9.66, -0.95],
                        [-11.43, 7.01, -5.72], [8.88, -6.14, 12.77], [-0.97, 10.26, -14.3],
                        [1.65, -9.89, 3.27], [-12.6, 0.83, 5.98], [4.72, 2.03, -11.53], 
                        [-14.28, -3.36, 9.04], [3.79, -1.12, 6.69],[-5.94, 6.87, 0.24],
                        [10.45, -12.79, 7.58], [2.33, 13.91, -8.82], [-6.18, -7.61, 1.9],
                        [9.27, 0.0, -2.49]];

        
        const expectedWarping = [0,2,3,5,6,7,7,10,14,16,17,19,21,22,24,26,31,37,38,39];
        const expectedMisalignment = [0,1,1,2,2,2,1,3,6,7,7,8,9,9,10,11,15,20,20,20];
        const expectedDistance = [30.27,  6.58, 13.93, 13.95,  7.35,  9.22,  7.44, 18.86, 12.91,
                                    9.78, 23.86,  7.85,  5.19,  3.94,  5.92, 14.66, 13.89, 13.76,
                                    10.8 , 20.76];
        const expectedDegreeOfMisalignment = [ 0.2,  0. ,  0.2,  0. ,  0. , -1. ,  0.4,  0.6,  0.2,  0. ,  0.2,
                                    0.2,  0. ,  0.2,  0.2,  0.8,  1. ,  0. ,  0. ,  0. ];
        let result : ComparisonResult;
        
        beforeAll(() => {
            result = comparator.runComparison(reference, target)
        });

        test("Check distance correctness", () => {
            expect(result.distance.length).toEqual(expectedDistance.length);
            result.distance.forEach((actualDistance, index) => {
                expect(actualDistance).toBeCloseTo(expectedDistance[index]);
            });
        });

        test("Check warping correctness", () => {
            expect(result.warping).toEqual(expectedWarping);
            expect(result.warping.length).toEqual(expectedWarping.length);
        });

        test("Check misalignment correctness", () => {
            expect(result.misalignment).toEqual(expectedMisalignment);
            expect(result.misalignment.length).toEqual(expectedMisalignment.length);
        });

        test("Check misalignment degree correctness", () => {
            expect(result.degree_of_misalignment.length).toEqual(expectedDegreeOfMisalignment.length);
            result.degree_of_misalignment.forEach((actualDegree, index) => {
                expect(actualDegree).toBeLessThanOrEqual(1);
                expect(actualDegree).toBeGreaterThanOrEqual(-1);
                expect(actualDegree).toBeCloseTo(expectedDegreeOfMisalignment[index]);
            });
        });
        
    });
});