import { StdDevHelper } from "../../src";

describe('Std deviation of multivariate array', () => {

  describe("Valid inputs", () => {    
    test("Std. Dev. calculation for a single variable time-series", () => {
        const ref = [[5],[5],[9]];
        const target = [[9],[9],[10],[5],[10],[10]];
        const expectedStd = [2.16]
        StdDevHelper.computeStdDev(ref, target).forEach((std, index) => {
          expect(std).toBeCloseTo(expectedStd[index]);
        })
    });

    test("Std. Dev. calculation for a multi-variate time-series", () => {
        const ref = [[26,93,14],[60,60,10], [42,71,10]];
        const target = [[53,23,94],[42,78,47],[12,88,13],[97,15,35],[5,11,49],[70,22,14],[18,15,41],[71,4,85],[92,33,42]];
        const expectedStd = [29.02,31.46,27.27]
        StdDevHelper.computeStdDev(ref, target).forEach((std, index) => {
          expect(std).toBeCloseTo(expectedStd[index]);
        })
    });

    test("Same numbers at the same positions in different points do not alter final result", () => {
        const ref = [[26,93,14],[12,88,13]];
        const target = [[53,23,94],[60,78,47],[42,71,10],[97,15,35],[5,11,49],[70,22,14],[18,15,41],[92,4,10],[71,33,42],[42,60,85]];
        const expectedStd = [29.02,31.46,27.27]
        StdDevHelper.computeStdDev(ref, target).forEach((std, index) => {
          expect(std).toBeCloseTo(expectedStd[index]);
        })
    });
  });
});
