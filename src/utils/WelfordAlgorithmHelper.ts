import { NDimensionalPoint } from "..";

export type WelfordVariables = {
    m : Array<number>;
    s : Array<number>;
    k : number;
}

/**
 * Contains utility functions that aim to implement Welford's algorithm for the calculation
 * of standard deviations for populations. Implemented for arrays of N-Dimensional points
 */
export class WelfordAlgorithmHelper {    
    public static update({m,s,k} : WelfordVariables, point : NDimensionalPoint) : WelfordVariables {
        k = k+1;
        point.forEach((variable, var_index) => {
                const prev_m = m[var_index];
                m[var_index] = (prev_m + (variable-prev_m)/k);
                s[var_index] = (s[var_index] + (variable-prev_m)*(variable-m[var_index]));
        });
        return {m: m,s: s,k: k} as WelfordVariables;
    }

    public static finalize({m,s,k} : WelfordVariables) : Array<number> {
        return s.map((s_value) => (Math.sqrt(s_value/k)));
    }
}