import type { NDimensionalPoint } from '../types/TSComparator.types';
import type { DistanceStrategy } from './IDistanceStrategy';

export abstract class AbstractDistanceStrategy implements DistanceStrategy {    

    protected validatePoints(point1 : NDimensionalPoint, point2 : NDimensionalPoint){
        if(point1.length != point2.length){
            throw new Error("Points must be of the same dimensionality");
            
        } else if(point1.length == 0 || point2.length == 0){
            throw new Error("Points must not be empty");
        }
    }

    public abstract distance(point1: NDimensionalPoint, point2: NDimensionalPoint) : number;
}