import type { NDimensionalPoint } from '../types/TSComparator.types';

export interface DistanceStrategy {
    distance(point1 : NDimensionalPoint, point2 : NDimensionalPoint) : number;
}