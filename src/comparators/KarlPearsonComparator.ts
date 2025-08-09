import { AbstractTSComparator } from "../TSComparator";
import { TimeSeries, ComparisonResult, NDimensionalPoint } from "../types/TSComparator.types";
import { StdDevHelper } from "../utils/StdDevHelper";
import { TSValidator } from "../validators/TSValidator";

export class KarlPearsonComparator extends AbstractTSComparator{

    private weights! : Array<number>;

    constructor(){
        super();
    }

    public compare(reference: TimeSeries, target: TimeSeries): ComparisonResult {
        TSValidator.validate(reference, target);
        this.computeWeights(reference, target);
        return this.runComparison(reference, target);
    }

    protected distance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        const variable_count = point1.length;
        let sum_squared_weighted_diffs = 0;
        for(let i=0; i<variable_count; i++){
            const weighted_dif = (point1[i] - point2[i]) / this.weights[i];
            sum_squared_weighted_diffs += Math.pow(weighted_dif, 2);
        }
        return Math.sqrt(sum_squared_weighted_diffs);
    }

    private computeWeights(reference : TimeSeries, target : TimeSeries) : void {
        this.weights = StdDevHelper.computeStdDev(reference, target);
    }
}