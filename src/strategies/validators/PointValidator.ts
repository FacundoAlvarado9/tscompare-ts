import { NDimensionalPoint } from "../../types/TSComparator.types";
import { isNumeric } from "./utils";

export class PointValidator {
    public static validate(point1 : NDimensionalPoint, point2 : NDimensionalPoint) : void {
        if(point1.length == 0 || point2.length == 0){
            throw new Error("Points must not be empty");            
        }
        if(point1.length != point2.length){
            throw new Error("Points must have the same dimensionality.");
        }
        if(!isNumeric(point1) || !isNumeric(point2)){
            throw new Error("Points must contain numeric values");
        }
    }
}