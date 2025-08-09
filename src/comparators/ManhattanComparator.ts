import { ComparisonResult, NDimensionalPoint, TimeSeries } from "..";
import { AbstractTSComparator } from "../TSComparator";
import { TSValidator } from "../validators/TSValidator";

export class ManhattanComparator extends AbstractTSComparator{

    constructor(){
        super();
    }

    compare(reference: TimeSeries, target: TimeSeries): ComparisonResult {
        TSValidator.validate(reference, target);
        return this.runComparison(reference, target);
    }

    protected distance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        const variable_count = point1.length;
        let sum_diffs = 0;
        for(let i=0; i<variable_count; i++){
            sum_diffs += Math.abs(point1[i]-point2[i]);
        }
        return sum_diffs;
    }

}