import type { NDimensionalPoint } from '../types/TSComparator.types';
import { WeightsValidator } from './validators/WeightsValidator';
import { AbstractDistanceStrategy } from './AbstractDistanceStrategy';

export class WeightedEuclidean extends AbstractDistanceStrategy{

    private weights : Array<number>;

    constructor(weights : Array<number>){
        super();
        WeightsValidator.validate(weights);
        this.weights = [...weights];
    }

    protected calculateDistance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        WeightsValidator.validate(this.weights);
        return this.computeWeightedDistance(point1, point2);
    }

    private computeWeightedDistance(point1: NDimensionalPoint, point2: NDimensionalPoint){        
        const variable_count = point1.length;
        let sum_squared_weighted_diffs = 0;
        for(let i=0; i<variable_count; i++){
            const weighted_dif = (point1[i] - point2[i]) / this.weights[i];
            sum_squared_weighted_diffs += Math.pow(weighted_dif, 2);
        }
        return Math.sqrt(sum_squared_weighted_diffs);
    }
}