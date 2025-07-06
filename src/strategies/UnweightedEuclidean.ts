import type { NDimensionalPoint } from '../types/TSComparator.types';
import { AbstractDistanceStrategy } from './AbstractDistanceStrategy';

export class UnweightedEuclidean extends AbstractDistanceStrategy{

    constructor(){
        super();
    }

    protected calculateDistance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        const variable_count = point1.length;
        let sum_squared_diffs = 0;
        for(let i=0; i<variable_count; i++){
            const dif = point1[i] - point2[i];
            sum_squared_diffs += Math.pow(dif, 2);
        }
        return Math.sqrt(sum_squared_diffs);
    }
}