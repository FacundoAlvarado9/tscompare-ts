import { EuclideanDistance, NDimensionalPoint } from "../../src";

describe('Karl-Pearson', () => {

    const weights = [44.76, 56.5, 133.67];
    const karlpearson = new EuclideanDistance(weights);
    
    test('Distance between identical points must be 0 (zero)', () => {
        expect(karlpearson.distance([-64.88,2.16,-76], [-64.88,2.16,-76])).toBeCloseTo(0);
        expect(karlpearson.distance([0,0,0], [0,0,0])).toBeCloseTo(0);
    });
    
    test('Distance must be commutative', () => {
        let point1 = [26.44,40.89,65.72];
        let point2 = [8.73,98.85,-23.40];
        let zero = [0,0,0];
        expect(karlpearson.distance(point1, point2)).toBeCloseTo(karlpearson.distance(point2, point1));
        expect(karlpearson.distance(zero, point2)).toBeCloseTo(karlpearson.distance(point2, zero));
    });
  
    test('3D points', () => {
        expect(karlpearson.distance([-64.88,2.16,-76], [9.34,7.72,96.35])).toBeCloseTo(2.1);
        expect(karlpearson.distance([0.56,54.00,1.43], [26.44,40.89,65.72])).toBeCloseTo(0.787);
        expect(karlpearson.distance([8.73,98.85,-23.40], [56.90,-53.00,7.77])).toBeCloseTo(2.9);
    });

    describe("Invalid inputs", () => {
    test("Distance between empty points should return an eror", () =>{
      expect(() => karlpearson.distance([],[])).toThrow();
      expect(() => karlpearson.distance([], [6,7,-1])).toThrow();
      expect(() => karlpearson.distance([5,8,1], [])).toThrow();
    });

    test("Distance between points of different dimensionality should return an error", () => {
      expect(() => karlpearson.distance([1,2,3], [5])).toThrow();
      expect(() => karlpearson.distance([-5], [6,7,9])).toThrow();            
    });
  });  

});
