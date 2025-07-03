import type { NDimensionalPoint } from '../types/TSComparator.types';
import { AbstractDistanceStrategy } from './AbstractDistanceStrategy';

export class EuclideanDistance extends AbstractDistanceStrategy{

    private weights : Array<number>;

    constructor();
    constructor(weights : Array<number>);

    constructor(...args: any[]){
        super();
        if(args.length === 0){
            this.weights = [];
        } else{            
            this.weights = args[0];
        }
        return;
    }

    distance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        this.validatePoints(point1, point2);
        let dist = 0;

        if(this.weights.length === 0){
            dist  = this.unweightedDistance(point1, point2);
        } else {
            dist = this.weigthedDistance(point1, point2);
        }        

        return dist;
    }

    private unweightedDistance(point1: NDimensionalPoint, point2: NDimensionalPoint) : number {
        let sumOfSquaredDifferences = 0;
        for(let i=0; i<point1.length; i++){
            sumOfSquaredDifferences += this.square(point1[i] - point2[i]);
        }
        return Math.sqrt(sumOfSquaredDifferences);
    }

    private weigthedDistance(point1: NDimensionalPoint, point2: NDimensionalPoint) : number {
        if(this.weights.length != point1.length){
            throw new Error("There must be either no weights or as many weights as variables in the points to compare.");            
        }

        let sum = 0;
        const no_variables = point1.length;
        for(let i=0; i<no_variables; i++){
            sum += this.square(((point1[i] - point2[i]) / this.weights[i]));
        }
        return Math.sqrt(sum);
    }    

    private square(num : number){
        return Math.pow(num, 2)
    }

}