import { NDimensionalPoint } from "../types/TSComparator.types";
import { DistanceStrategy } from "./IDistanceStrategy";
import { PointValidator } from "./validators/PointValidator";

export abstract class AbstractDistanceStrategy implements DistanceStrategy {

    protected abstract calculateDistance(point1: NDimensionalPoint, point2: NDimensionalPoint) : number;

    public distance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        PointValidator.validate(point1, point2);
        return this.calculateDistance(point1, point2);
    }
}