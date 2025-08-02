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

    describe("Valid input 1: Univariate ", () => {

        const reference =   [[9],[0],[1.1],[0.23],[6],[-10.9],[-3.2]];

        const target = [[5.1], [-7.23], [2.5], [0.3], [0]];

        let expectedResult : ComparisonResult = [
            {
                "index": 0,
                "warping": 0,
                "distance": expect.closeTo(3.9),
                "misalignment": 0,
                "degree_of_misalignment": 0
            },
            {
                "index": 1,
                "warping": 1,
                "distance": expect.closeTo(7.23),
                "misalignment": 0,
                "degree_of_misalignment": 0
            },
            {
                "index": 2,
                "warping": 2,
                "distance": expect.closeTo(1.4),
                "misalignment": 0,
                "degree_of_misalignment": 0
            },
            {
                "index": 3,
                "warping": 3,
                "distance": expect.closeTo(0.07),
                "misalignment": 0,
                "degree_of_misalignment": -1
            },
            {
                "index": 4,
                "warping": 3,
                "distance": expect.closeTo(5.7),
                "misalignment": -1,
                "degree_of_misalignment": 0
            },
            {
                "index": 5,
                "warping": 4,
                "distance": expect.closeTo(10.9),
                "misalignment": -1,
                "degree_of_misalignment": -1
            },
            {
                "index": 6,
                "warping": 4,
                "distance": expect.closeTo(3.2),
                "misalignment": -2,
                "degree_of_misalignment": -1
            }
            ];

        let result : ComparisonResult;
        
        beforeAll(() => {
            result = comparator.runComparison(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });

    describe("Valid input 2: Multivariate ", () => {

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

        const expectedResult = [
            {
                "index": 0,
                "warping": 0,
                "distance": expect.closeTo(30.27),
                "misalignment": 0,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 1,
                "warping": 2,
                "distance": expect.closeTo(6.58),
                "misalignment": 1,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 2,
                "warping": 3,
                "distance": expect.closeTo(13.93),
                "misalignment": 1,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 3,
                "warping": 5,
                "distance": expect.closeTo(13.95),
                "misalignment": 2,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 4,
                "warping": 6,
                "distance": expect.closeTo(7.35),
                "misalignment": 2,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 5,
                "warping": 7,
                "distance": expect.closeTo(9.22),
                "misalignment": 2,
                "degree_of_misalignment": expect.closeTo(-1)
            },
            {
                "index": 6,
                "warping": 7,
                "distance": expect.closeTo(7.44),
                "misalignment": 1,
                "degree_of_misalignment": expect.closeTo(0.4)
            },
            {
                "index": 7,
                "warping": 10,
                "distance": expect.closeTo(18.86),
                "misalignment": 3,
                "degree_of_misalignment": expect.closeTo(0.6)
            },
            {
                "index": 8,
                "warping": 14,
                "distance": expect.closeTo(12.91),
                "misalignment": 6,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 9,
                "warping": 16,
                "distance": expect.closeTo(9.78),
                "misalignment": 7,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 10,
                "warping": 17,
                "distance": expect.closeTo(23.86),
                "misalignment": 7,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 11,
                "warping": 19,
                "distance": expect.closeTo(7.85),
                "misalignment": 8,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 12,
                "warping": 21,
                "distance": expect.closeTo(5.19),
                "misalignment": 9,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 13,
                "warping": 22,
                "distance": expect.closeTo(3.94),
                "misalignment": 9,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 14,
                "warping": 24,
                "distance": expect.closeTo(5.92),
                "misalignment": 10,
                "degree_of_misalignment": expect.closeTo(0.2)
            },
            {
                "index": 15,
                "warping": 26,
                "distance": expect.closeTo(14.66),
                "misalignment": 11,
                "degree_of_misalignment": expect.closeTo(0.8)
            },
            {
                "index": 16,
                "warping": 31,
                "distance": expect.closeTo(13.89),
                "misalignment": 15,
                "degree_of_misalignment": expect.closeTo(1)
            },
            {
                "index": 17,
                "warping": 37,
                "distance": expect.closeTo(13.76),
                "misalignment": 20,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 18,
                "warping": 38,
                "distance": expect.closeTo(10.8),
                "misalignment": 20,
                "degree_of_misalignment": expect.closeTo(0)
            },
            {
                "index": 19,
                "warping": 39,
                "distance": expect.closeTo(20.76),
                "misalignment": 20,
                "degree_of_misalignment": expect.closeTo(0)
            }
        ];
        
        let result : ComparisonResult;
        beforeAll(() => {
            result = comparator.runComparison(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });
});

/*
let expectedResult = [];
        for(let i=0; i<reference.length; i++){
            expectedResult.push({
                index: i,
                warping: expectedWarping[i],
                distance: expectedDistance[i],
                misalignment: expectedMisalignment[i],
                degree_of_misalignment: expectedDegreeOfMisalignment[i]
            });
        };
        console.log(expectedResult);*/