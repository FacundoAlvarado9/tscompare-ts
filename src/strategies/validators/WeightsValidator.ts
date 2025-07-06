import { isNumeric } from "./utils";

export class WeightsValidator {
    public static validate(weights : Array<number>, variable_count? : number) : void {
        if(weights == null || weights == undefined){
            throw new Error("Weights must be defined before running the distance calculation.");            
        }
        if(weights.length == 0){
            throw new Error("Weights must not be empty.");
        }
        if(!isNumeric(weights)){
            throw new Error("Weights must be numeric.");            
        }
        if(weights.includes(0)){
            throw new Error("No weight must be equal to zero (will lead to a division by zero)");            
        }    
        if(variable_count != undefined){
            if(weights.length != variable_count){
                throw new Error("There must be as many weights as variables in the points to compare.");  
            }
        }
    }
}