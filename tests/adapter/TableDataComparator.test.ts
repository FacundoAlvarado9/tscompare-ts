import { TimeSeries, AdaptedResult, TableData, Row, Header, EuclideanComparator, TableDataComparator } from "../../src";

describe("Time-Series Comparator tests", () => {

    const comparator = new EuclideanComparator();
    const adapter = new TableDataComparator(comparator);

    describe("Invalid inputs: Empty tables ", () => {

        const emptyTable : TableData = {headers: [], data: []} as TableData;

        const ValidData : Row[] = [
            ["1","-2"],
            ["25","54"],
            ["12.3","-8.2"],
            ["122", "1"]
        ];
        const validHeaders : Header[] = ["Column 1", "Column 2"];
        const validTable : TableData = {headers: validHeaders, data: ValidData};   

        const expectedResult : AdaptedResult = {
            status: "Error",
            errorMessage: "Time-series must not be empty"
        }

        test("Comparison is not possible for empty tables", () =>{
            expect(adapter.compare(emptyTable, validTable)).toEqual(expectedResult);
            expect(adapter.compare(validTable, emptyTable)).toEqual(expectedResult);
        });            
    });

    describe("Invalid inputs: Dimensionally inconsistent tables", () => {
        const testHeaders : Header[] = ["Column 1", "Column 2", "Column 3"];
        const dimensionallyInconsistentData : Row[] = [
            ["1","-2","0"],
            ["25","54","4.5"],
            ["-8.2"],
            ["122","1"]
        ];
        const dimensionallyInconsistentTable : TableData = {headers: testHeaders, data: dimensionallyInconsistentData};

        const validHeaders : Header[] = ["Column 1", "Column 2"];
        const ValidData : Row[] = [
            ["1","-2"],
            ["25","54"],
            ["12.3","-8.2"],
            ["122", "1"]
        ];
        const validTable : TableData = {headers: validHeaders, data: ValidData};

        const expectedResult : AdaptedResult = {
            status: "Error",
            errorMessage: "Dimensions must be consistent across all the points of a time-series."
        }        

        test("Comparison is not possible for dimensionally inconsistent time-series", () => {
            expect(adapter.compare(dimensionallyInconsistentTable, validTable)).toEqual(expectedResult);
        });

    });

    describe("Invalid inputs: Table with non-numeric values", () => {

        const referenceData = [["9"],["0p"],["1.1"],["0.a23"],["6b"],["-10.9"],["-3.2"]];
        const targetData = [["5.1"], ["o-7.23"], ["$2.5"], ["0.3%"], ["0"]];
        const headers : Header[] = ["Test column"]
        const reference : TableData = {headers: headers, data: referenceData} as TableData;
        const target : TableData = {headers: headers, data: targetData} as TableData;
        
        const expectedResult : AdaptedResult = {
            status: "Error",
            errorMessage: "Cell 0 at row 1 must contain numeric values."
        };

        let result : AdaptedResult;
        
        beforeAll(() => {
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });

    describe("Valid input: Univariate with no timestamp", () => {

        const referenceData = [["9"],["0"],["1.1"],["0.23"],["6"],["-10.9"],["-3.2"]];
        const targetData = [["5.1"], ["-7.23"], ["2.5"], ["0.3"], ["0"]];
        const headers : Header[] = ["Test column"]
        const reference : TableData = {headers: headers, data: referenceData} as TableData;
        const target : TableData = {headers: headers, data: targetData} as TableData;
        
        let expectedResult : AdaptedResult = 
        {
            status: "Success",
            result: [
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
            ]
        };
        let result : AdaptedResult;
        
        beforeAll(() => {
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });

    describe("Valid input: Univariate with timestamp column", () => {

        const referenceData = [["-3.2", "2025-07-07"],
                                ["1.1", "2025-07-03"],
                                ["9", "2025-07-01"],
                                ["6", "2025-07-05"],
                                ["0.23", "2025-07-04"],
                                ["0", "2025-07-02"],
                                ["-10.9", "2025-07-06"]];
                                
        const targetData = [["2025-07-04", "0.3"],
                            ["2025-07-02", "-7.23"],
                            ["2025-07-05", "0"],
                            ["2025-07-03", "2.5"],
                            ["2025-07-01", "5.1"]];
        const refHeaders : Header[] = ["Number", "Date"];
        const targetHeaders : Header[] = ["Timestamp", "Número"]
        const reference : TableData = {headers: refHeaders, data: referenceData} as TableData;
        const target : TableData = {headers: targetHeaders, data: targetData} as TableData;
        
        let expectedResult : AdaptedResult = {
            status: "Success",
            result: [
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
            ]
        };
        let result : AdaptedResult;
        
        beforeAll(() => {
            adapter.setReferenceTimestampColumnIndex(1);
            adapter.setTargetTimestampColumnIndex(0);
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });

    describe("Valid input: Multivariate w/ no timestamp", () => {

        const referenceHeaders : Header[] = ["Var. 1", "Var. 2", "Var. 3"];
        const referenceData : Row[] =   [["13.27", "-6.14", "5.33"], ["-4.78", "10.19", "-11.82"], ["1.76", "6.44", "8.28"],
                            ["3.91", "-13.93", "-0.64"], ["-12.07", "5.7", "-3.28"], ["7.66", "-10.4", "2.01"],
                            ["0.49", "-8.31", "12.96"], ["-6.55", "3.27", "-9.91"], ["14.81", "1.33", "-2.54"],
                            ["-1.89", "11.07", "6.12"], ["-14.08", "-5.98", "7.71"], ["5.86", "-7.01", "-12.43"],
                            ["2.77", "0.59", "13.26"], ["-9.03", "8.41", "1.17"], ["6.91", "-1.23", "-4.67"],
                            ["3.17", "12.87", "9.41"], ["-2.01", "-6.16", "0.33"], ["11.64", "4.25", "-5.78"],
                            ["0.0", "-14.35", "7.65"], ["-5.41", "9.88", "-13.34"]];
        const reference : TableData = {headers: referenceHeaders, data: referenceData} as TableData;

        const targetHeaders : Header[]= ["Column 1", "Column 2", "Column 3"]
        const targetData : Row[]= [["-8.92", "12.34", "-3.76"], ["5.21", "-14.88", "9.63"], ["0.14", "6.25", "-13.72"],
                        ["-11.56", "2.49", "7.3"], ["3.62", "-1.21", "10.58"], ["14.93", "-6.77", "4.05"],
                        ["-12.14", "13.02", "-2.64"], ["7.55", "-9.88", "11.21"], ["-5.93", "4.76", "-10.01"],
                        ["2.88", "0.42", "-7.9"], ["-0.55", "-3.18", "6.77"], ["10.34", "14.29", "-12.36"],
                        ["-6.12", "-4.04", "3.15"], ["8.91", "-1.7", "1.08"], ["9.99", "-7.75", "5.27"],
                        ["1.2", "3.47", "-5.85"], ["-9.22", "8.67", "12.14"], ["4.5", "-11.03", "-6.38"],
                        ["-13.74", "7.91", "2.69"], ["6.23", "0.0", "-8.91"], ["-3.52", "12.18", "-6.44"],
                        ["7.11", "-2.05", "14.33"], ["-10.86", "4.92", "1.01"], ["0.39", "-13.27", "11.76"],
                        ["6.55", "3.84", "-1.63"], ["-7.72", "-4.28", "2.93"], ["13.04", "9.66", "-0.95"],
                        ["-11.43", "7.01", "-5.72"], ["8.88", "-6.14", "12.77"], ["-0.97", "10.26", "-14.3"],
                        ["1.65", "-9.89", "3.27"], ["-12.6", "0.83", "5.98"], ["4.72", "2.03", "-11.53"],
                        ["-14.28", "-3.36", "9.04"], ["3.79", "-1.12", "6.69"], ["-5.94", "6.87", "0.24"],
                        ["10.45", "-12.79", "7.58"], ["2.33", "13.91", "-8.82"], ["-6.18", "-7.61", "1.9"],
                        ["9.27", "0.0", "-2.49"]];                
        const target : TableData = {headers: targetHeaders,data: targetData} as TableData;

        
        const expectedResult : AdaptedResult = {
            status: "Success",
            result: [
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
            ]
        };
        let result : AdaptedResult;
        
        beforeAll(() => {
            adapter.setReferenceTimestampColumnIndex(-1);
            adapter.setTargetTimestampColumnIndex(-1);
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });
    describe("Valid input: Multivariate w/ timestamp", () => {

        const referenceHeaders : Header[] = ["Var. 1", "Date", "Var. 2", "Var. 3"];
        const referenceData : Row[] =   [['3.17', '2025-07-16T00:00:00', '12.87', '9.41'],
                                        ['14.81', '2025-07-09T00:00:00', '1.33', '-2.54'],
                                        ['11.64', '2025-07-18T00:00:00', '4.25', '-5.78'],
                                        ['-1.89', '2025-07-10T00:00:00', '11.07', '6.12'],
                                        ['5.86', '2025-07-12T00:00:00', '-7.01', '-12.43'],
                                        ['6.91', '2025-07-15T00:00:00', '-1.23', '-4.67'],
                                        ['2.77', '2025-07-13T00:00:00', '0.59', '13.26'],
                                        ['13.27', '2025-07-01T00:00:00', '-6.14', '5.33'],
                                        ['0.0', '2025-07-19T00:00:00', '-14.35', '7.65'],
                                        ['-5.41', '2025-07-20T00:00:00', '9.88', '-13.34'],
                                        ['-12.07', '2025-07-05T00:00:00', '5.7', '-3.28'],
                                        ['-6.55', '2025-07-08T00:00:00', '3.27', '-9.91'],
                                        ['0.49', '2025-07-07T00:00:00', '-8.31', '12.96'],
                                        ['-9.03', '2025-07-14T00:00:00', '8.41', '1.17'],
                                        ['-4.78', '2025-07-02T00:00:00', '10.19', '-11.82'],
                                        ['-2.01', '2025-07-17T00:00:00', '-6.16', '0.33'],
                                        ['-14.08', '2025-07-11T00:00:00', '-5.98', '7.71'],
                                        ['1.76', '2025-07-03T00:00:00', '6.44', '8.28'],
                                        ['7.66', '2025-07-06T00:00:00', '-10.4', '2.01'],
                                        ['3.91', '2025-07-04T00:00:00', '-13.93', '-0.64']];
        const reference : TableData = {headers: referenceHeaders, data: referenceData} as TableData;

        const targetHeaders : Header[]= ["Column 1", "Column 2", "Column 3", "Timestamp"];
        const targetData : Row[]= [['3.62', '-1.21', '10.58', '2025-07-05T00:00:00'],
                                    ['-11.43', '7.01', '-5.72', '2025-07-28T00:00:00'],
                                    ['10.45', '-12.79', '7.58', '2025-08-06T00:00:00'],
                                    ['13.04', '9.66', '-0.95', '2025-07-27T00:00:00'],
                                    ['-12.6', '0.83', '5.98', '2025-08-01T00:00:00'],
                                    ['9.99', '-7.75', '5.27', '2025-07-15T00:00:00'],
                                    ['4.5', '-11.03', '-6.38', '2025-07-18T00:00:00'],
                                    ['-5.94', '6.87', '0.24', '2025-08-05T00:00:00'],
                                    ['1.2', '3.47', '-5.85', '2025-07-16T00:00:00'],
                                    ['10.34', '14.29', '-12.36', '2025-07-12T00:00:00'],
                                    ['-3.52', '12.18', '-6.44', '2025-07-21T00:00:00'],
                                    ['-12.14', '13.02', '-2.64', '2025-07-07T00:00:00'],
                                    ['-0.55', '-3.18', '6.77', '2025-07-11T00:00:00'],
                                    ['-10.86', '4.92', '1.01', '2025-07-23T00:00:00'],
                                    ['-14.28', '-3.36', '9.04', '2025-08-03T00:00:00'],
                                    ['3.79', '-1.12', '6.69', '2025-08-04T00:00:00'],
                                    ['7.11', '-2.05', "14.33", '2025-07-22T00:00:00'],
                                    ['-13.74', '7.91', '2.69', '2025-07-19T00:00:00'],
                                    ['-11.56', '2.49', '7.3', '2025-07-04T00:00:00'],
                                    ['-9.22', '8.67', '12.14', '2025-07-17T00:00:00'],
                                    ['0.14', '6.25', '-13.72', '2025-07-03T00:00:00'],
                                    ['4.72', '2.03', '-11.53', '2025-08-02T00:00:00'],
                                    ['0.39', '-13.27', '11.76', '2025-07-24T00:00:00'],
                                    ['-0.97', '10.26', '-14.3', '2025-07-30T00:00:00'],
                                    ['1.65', '-9.89', '3.27', '2025-07-31T00:00:00'],
                                    ['7.55', '-9.88', '11.21', '2025-07-08T00:00:00'],
                                    ['2.88', '0.42', '-7.9', '2025-07-10T00:00:00'],
                                    ['8.88', '-6.14', '12.77', '2025-07-29T00:00:00'],
                                    ['6.23', '0.0', '-8.91', '2025-07-20T00:00:00'],
                                    ['2.33', '13.91', '-8.82', '2025-08-07T00:00:00'],
                                    ['-5.93', '4.76', '-10.01', '2025-07-09T00:00:00'],
                                    ['-6.18', '-7.61', '1.9', '2025-08-08T00:00:00'],
                                    ['-8.92', '12.34', '-3.76', '2025-07-01T00:00:00'],
                                    ['5.21', '-14.88', '9.63', '2025-07-02T00:00:00'],
                                    ['6.55', '3.84', '-1.63', '2025-07-25T00:00:00'],
                                    ['-7.72', '-4.28', '2.93', '2025-07-26T00:00:00'],
                                    ['8.91', '-1.7', '1.08', '2025-07-14T00:00:00'],
                                    ['14.93', '-6.77', '4.05', '2025-07-06T00:00:00'],
                                    ['-6.12', '-4.04', '3.15', '2025-07-13T00:00:00'],
                                    ['9.27', '0.0', '-2.49', '2025-08-09T00:00:00']];                
        const target : TableData = {headers: targetHeaders,data: targetData} as TableData;

        
        const expectedResult : AdaptedResult = {
            status: "Success",
            result: [
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
            ]
        };
        let result : AdaptedResult;
        
        beforeAll(() => {
            adapter.setReferenceTimestampColumnIndex(1);
            adapter.setTargetTimestampColumnIndex(3);
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });
    describe("Valid input: Multivariate w/ timestamps at index 0", () => {

        const referenceHeaders : Header[] = ["Date", "Var. 1", "Var. 2", "Var. 3"];
        const referenceData : Row[] =   [['2025-07-16T00:00:00', '3.17', '12.87', '9.41'],
                                        ['2025-07-09T00:00:00', '14.81', '1.33', '-2.54'],
                                        ['2025-07-18T00:00:00', '11.64', '4.25', '-5.78'],
                                        ['2025-07-10T00:00:00', '-1.89', '11.07', '6.12'],
                                        ['2025-07-12T00:00:00', '5.86', '-7.01', '-12.43'],
                                        ['2025-07-15T00:00:00', '6.91', '-1.23', '-4.67'],
                                        ['2025-07-13T00:00:00', '2.77', '0.59', '13.26'],
                                        ['2025-07-01T00:00:00', '13.27', '-6.14', '5.33'],
                                        ['2025-07-19T00:00:00', '0.0', '-14.35', '7.65'],
                                        ['2025-07-20T00:00:00', '-5.41', '9.88', '-13.34'],
                                        ['2025-07-05T00:00:00', '-12.07', '5.7', '-3.28'],
                                        ['2025-07-08T00:00:00', '-6.55', '3.27', '-9.91'],
                                        ['2025-07-07T00:00:00', '0.49', '-8.31', '12.96'],
                                        ['2025-07-14T00:00:00', '-9.03', '8.41', '1.17'],
                                        ['2025-07-02T00:00:00', '-4.78', '10.19', '-11.82'],
                                        ['2025-07-17T00:00:00', '-2.01', '-6.16', '0.33'],
                                        ['2025-07-11T00:00:00', '-14.08', '-5.98', '7.71'],
                                        ['2025-07-03T00:00:00', '1.76', '6.44', '8.28'],
                                        ['2025-07-06T00:00:00', '7.66', '-10.4', '2.01'],
                                        ['2025-07-04T00:00:00', '3.91', '-13.93', '-0.64']];
        const reference : TableData = {headers: referenceHeaders, data: referenceData} as TableData;

        const targetHeaders : Header[]= ["Date", "Column 1", "Column 2", "Column 3"];
        const targetData : Row[]= [['2025-07-05T00:00:00', '3.62', '-1.21', '10.58'],
                                    ['2025-07-28T00:00:00', '-11.43', '7.01', '-5.72'],
                                    ['2025-08-06T00:00:00', '10.45', '-12.79', '7.58'],
                                    ['2025-07-27T00:00:00', '13.04', '9.66', '-0.95'],
                                    ['2025-08-01T00:00:00', '-12.6', '0.83', '5.98'],
                                    ['2025-07-15T00:00:00', '9.99', '-7.75', '5.27'],
                                    ['2025-07-18T00:00:00', '4.5', '-11.03', '-6.38'],
                                    ['2025-08-05T00:00:00', '-5.94', '6.87', '0.24'],
                                    ['2025-07-16T00:00:00', '1.2', '3.47', '-5.85'],
                                    ['2025-07-12T00:00:00', '10.34', '14.29', '-12.36'],
                                    ['2025-07-21T00:00:00', '-3.52', '12.18', '-6.44'],
                                    ['2025-07-07T00:00:00', '-12.14', '13.02', '-2.64'],
                                    ['2025-07-11T00:00:00', '-0.55', '-3.18', '6.77'],
                                    ['2025-07-23T00:00:00', '-10.86', '4.92', '1.01'],
                                    ['2025-08-03T00:00:00', '-14.28', '-3.36', '9.04'],
                                    ['2025-08-04T00:00:00', '3.79', '-1.12', '6.69'],
                                    ['2025-07-22T00:00:00', '7.11', '-2.05', "14.33"],
                                    ['2025-07-19T00:00:00', '-13.74', '7.91', '2.69'],
                                    ['2025-07-04T00:00:00', '-11.56', '2.49', '7.3'],
                                    ['2025-07-17T00:00:00', '-9.22', '8.67', '12.14'],
                                    ['2025-07-03T00:00:00', '0.14', '6.25', '-13.72'],
                                    ['2025-08-02T00:00:00', '4.72', '2.03', '-11.53'],
                                    ['2025-07-24T00:00:00', '0.39', '-13.27', '11.76'],
                                    ['2025-07-30T00:00:00', '-0.97', '10.26', '-14.3'],
                                    ['2025-07-31T00:00:00', '1.65', '-9.89', '3.27'],
                                    ['2025-07-08T00:00:00', '7.55', '-9.88', '11.21'],
                                    ['2025-07-10T00:00:00', '2.88', '0.42', '-7.9'],
                                    ['2025-07-29T00:00:00', '8.88', '-6.14', '12.77'],
                                    ['2025-07-20T00:00:00', '6.23', '0.0', '-8.91'],
                                    ['2025-08-07T00:00:00', '2.33', '13.91', '-8.82'],
                                    ['2025-07-09T00:00:00', '-5.93', '4.76', '-10.01'],
                                    ['2025-08-08T00:00:00', '-6.18', '-7.61', '1.9'],
                                    ['2025-07-01T00:00:00', '-8.92', '12.34', '-3.76'],
                                    ['2025-07-02T00:00:00', '5.21', '-14.88', '9.63'],
                                    ['2025-07-25T00:00:00', '6.55', '3.84', '-1.63'],
                                    ['2025-07-26T00:00:00', '-7.72', '-4.28', '2.93'],
                                    ['2025-07-14T00:00:00', '8.91', '-1.7', '1.08'],
                                    ['2025-07-06T00:00:00', '14.93', '-6.77', '4.05'],
                                    ['2025-07-13T00:00:00', '-6.12', '-4.04', '3.15'],
                                    ['2025-08-09T00:00:00', '9.27', '0.0', '-2.49']];                
        const target : TableData = {headers: targetHeaders,data: targetData} as TableData;

        
        const expectedResult = {
            status: "Success",
            result: [
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
            ]
        };
        let result : AdaptedResult;
        
        beforeAll(() => {
            adapter.setReferenceTimestampColumnIndex(0);
            adapter.setTargetTimestampColumnIndex(0);
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        });
        
    });
    describe("Valid input: Multivariate w/ timestamps at index 0 with YYYY-MM-DD format", () => {

        const referenceHeaders : Header[] = ["Date", "Var. 1", "Var. 2", "Var. 3"];
        const referenceData : Row[] =   [['2025-07-16', '3.17', '12.87', '9.41'],
                                        ['2025-07-09', '14.81', '1.33', '-2.54'],
                                        ['2025-07-18', '11.64', '4.25', '-5.78'],
                                        ['2025-07-10', '-1.89', '11.07', '6.12'],
                                        ['2025-07-12', '5.86', '-7.01', '-12.43'],
                                        ['2025-07-15', '6.91', '-1.23', '-4.67'],
                                        ['2025-07-13', '2.77', '0.59', '13.26'],
                                        ['2025-07-01', '13.27', '-6.14', '5.33'],
                                        ['2025-07-19', '0.0', '-14.35', '7.65'],
                                        ['2025-07-20', '-5.41', '9.88', '-13.34'],
                                        ['2025-07-05', '-12.07', '5.7', '-3.28'],
                                        ['2025-07-08', '-6.55', '3.27', '-9.91'],
                                        ['2025-07-07', '0.49', '-8.31', '12.96'],
                                        ['2025-07-14', '-9.03', '8.41', '1.17'],
                                        ['2025-07-02', '-4.78', '10.19', '-11.82'],
                                        ['2025-07-17', '-2.01', '-6.16', '0.33'],
                                        ['2025-07-11', '-14.08', '-5.98', '7.71'],
                                        ['2025-07-03', '1.76', '6.44', '8.28'],
                                        ['2025-07-06', '7.66', '-10.4', '2.01'],
                                        ['2025-07-04', '3.91', '-13.93', '-0.64']];
        const reference : TableData = {headers: referenceHeaders, data: referenceData} as TableData;

        const targetHeaders : Header[]= ["Date", "Column 1", "Column 2", "Column 3"];
        const targetData : Row[]= [['2025-07-05', '3.62', '-1.21', '10.58'],
                                    ['2025-07-28', '-11.43', '7.01', '-5.72'],
                                    ['2025-08-06', '10.45', '-12.79', '7.58'],
                                    ['2025-07-27', '13.04', '9.66', '-0.95'],
                                    ['2025-08-01', '-12.6', '0.83', '5.98'],
                                    ['2025-07-15', '9.99', '-7.75', '5.27'],
                                    ['2025-07-18', '4.5', '-11.03', '-6.38'],
                                    ['2025-08-05', '-5.94', '6.87', '0.24'],
                                    ['2025-07-16', '1.2', '3.47', '-5.85'],
                                    ['2025-07-12', '10.34', '14.29', '-12.36'],
                                    ['2025-07-21', '-3.52', '12.18', '-6.44'],
                                    ['2025-07-07', '-12.14', '13.02', '-2.64'],
                                    ['2025-07-11', '-0.55', '-3.18', '6.77'],
                                    ['2025-07-23', '-10.86', '4.92', '1.01'],
                                    ['2025-08-03', '-14.28', '-3.36', '9.04'],
                                    ['2025-08-04', '3.79', '-1.12', '6.69'],
                                    ['2025-07-22', '7.11', '-2.05', "14.33"],
                                    ['2025-07-19', '-13.74', '7.91', '2.69'],
                                    ['2025-07-04', '-11.56', '2.49', '7.3'],
                                    ['2025-07-17', '-9.22', '8.67', '12.14'],
                                    ['2025-07-03', '0.14', '6.25', '-13.72'],
                                    ['2025-08-02', '4.72', '2.03', '-11.53'],
                                    ['2025-07-24', '0.39', '-13.27', '11.76'],
                                    ['2025-07-30', '-0.97', '10.26', '-14.3'],
                                    ['2025-07-31', '1.65', '-9.89', '3.27'],
                                    ['2025-07-08', '7.55', '-9.88', '11.21'],
                                    ['2025-07-10', '2.88', '0.42', '-7.9'],
                                    ['2025-07-29', '8.88', '-6.14', '12.77'],
                                    ['2025-07-20', '6.23', '0.0', '-8.91'],
                                    ['2025-08-07', '2.33', '13.91', '-8.82'],
                                    ['2025-07-09', '-5.93', '4.76', '-10.01'],
                                    ['2025-08-08', '-6.18', '-7.61', '1.9'],
                                    ['2025-07-01', '-8.92', '12.34', '-3.76'],
                                    ['2025-07-02', '5.21', '-14.88', '9.63'],
                                    ['2025-07-25', '6.55', '3.84', '-1.63'],
                                    ['2025-07-26', '-7.72', '-4.28', '2.93'],
                                    ['2025-07-14', '8.91', '-1.7', '1.08'],
                                    ['2025-07-06', '14.93', '-6.77', '4.05'],
                                    ['2025-07-13', '-6.12', '-4.04', '3.15'],
                                    ['2025-08-09', '9.27', '0.0', '-2.49']];                
        const target : TableData = {headers: targetHeaders,data: targetData} as TableData;

        
        const expectedResult = {
            status: "Success",
            result: [
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
            ]
        };
        let result : AdaptedResult;
        
        beforeAll(() => {
            adapter.setReferenceTimestampColumnIndex(0);
            adapter.setTargetTimestampColumnIndex(0);
            result = adapter.compare(reference, target)
        });

        test("Check result", () => {
            expect(result).toEqual(expectedResult);
        })
    });
});