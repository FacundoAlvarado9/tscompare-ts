import type { NDimensionalPoint } from'../types/TSComparator.types';
import { AbstractDistanceStrategy } from "./AbstractDistanceStrategy";

export class ManhattanDistance extends AbstractDistanceStrategy {
    public distance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        this.validatePoints(point1, point2);
        let sumOfDifferences = 0;
        for(let i=0; i<point1.length; i++){
            sumOfDifferences += Math.abs(point1[i]-point2[i]);
        }
        return sumOfDifferences;
    }

}