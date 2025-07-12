import type { NDimensionalPoint } from'../types/TSComparator.types';
import { AbstractDistanceStrategy } from './AbstractDistanceStrategy';

export class Manhattan extends AbstractDistanceStrategy {

    constructor(){
        super();
    }

    protected calculateDistance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        const variable_count = point1.length;
        let sum_diffs = 0;
        for(let i=0; i<variable_count; i++){
            sum_diffs += Math.abs(point1[i]-point2[i]);
        }
        return sum_diffs;
    }

}