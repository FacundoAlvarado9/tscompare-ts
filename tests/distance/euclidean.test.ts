import { UnweightedEuclidean } from "../../src";

describe('Unweighted Euclidean Distance Strategy', () => {

  const euclid = new UnweightedEuclidean();

  describe("Valid inputs", () => {
    test("Distance is 0 for identical points", () => {
      expect(euclid.distance([-1,-2,-3], [-1,-2,-3])).toBe(0);
      expect(euclid.distance([2,3,4],[2,3,4])).toBe(0);                
      expect(euclid.distance([0],[0])).toBe(0);
    });

    test("Distance is commutative", () => {
      const point1 = [-1,-2,3];
      const point2 = [4,-5,6];
      expect(euclid.distance(point1, point2)).toBe(euclid.distance(point1, point2));
    });
    
    test('1D points', () => {
      expect(euclid.distance([5], [3])).toBe(2);
      expect(euclid.distance([5], [-3])).toBe(8);    
    });

    test('2D points', () => {
      expect(euclid.distance([4,25], [97,2])).toBeCloseTo(95.8019);
    });

    test('3D points', () => {
      expect(euclid.distance([53,5,34], [122,9,-9])).toBeCloseTo(81.4002);
      expect(euclid.distance([-4.78, 10.19, -11.82], [0.14,6.25,-13.72])).toBeCloseTo(6.58);
    });

    test('4D points', () => {
      expect(euclid.distance([5,-1,3,0], [8,9,11,35])).toBeCloseTo(37.3898);
    });
  });  

  describe("Invalid inputs", () => {
    test("Distance between empty points should return an eror", () =>{
      expect(() => euclid.distance([],[])).toThrow();
      expect(() => euclid.distance([], [6,7])).toThrow();
      expect(() => euclid.distance([5,8], [])).toThrow();
    });

    test("Distance between points of different dimensionality should return an error", () => {
      expect(() => euclid.distance([1,2], [5])).toThrow();
      expect(() => euclid.distance([-5], [6,7,9])).toThrow();            
    });
  });  
});
