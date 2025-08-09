import { TimeSeries } from "..";
import { WelfordAlgorithmHelper, WelfordVariables } from "./WelfordAlgorithmHelper";

export class StdDevHelper {    
    /**
     * Calculates the standard deviation for each variable of two time-series. It assumes time-series
     * are dimensionally consistent (all points in each time-series have the same number of variables, and this
     * number is the same on both time-series)
     * @param ts1 first time series
     * @param ts2 second time series
     * @returns an array containing the standard deviation for each variable on the time-series
     */
    public static computeStdDev(ts1 : TimeSeries, ts2 : TimeSeries) : Array<number> {
        const variable_count = ts1[0].length;
        let wv = {m: [...ts1[0]], s: Array<number>(variable_count).fill(0), k: 1} as WelfordVariables;

        ts1.forEach((point, point_index) => {
            if(point_index != 0){
                wv = WelfordAlgorithmHelper.update(wv, point);
            }
        });
        ts2.forEach((point) => {
            wv = WelfordAlgorithmHelper.update(wv, point);
        });
        return WelfordAlgorithmHelper.finalize(wv);
    }
}