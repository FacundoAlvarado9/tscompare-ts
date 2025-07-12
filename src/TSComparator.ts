import { abs, floor, max, mean, min } from 'mathjs';
import type { DistanceStrategy } from './strategies/IDistanceStrategy';
import type { ComparisonResult, Pair, Path, TimeSeries } from './types/TSComparator.types';
import { TSValidator } from './validators/TSValidator';
import { Matrix } from './types/matrix/Matrix';

export interface ITSComparator {
    setStrategy(distanceStrategy : DistanceStrategy) : void;
    runComparison(reference : TimeSeries, target : TimeSeries) : ComparisonResult;
}

export class TSComparator implements ITSComparator {    

    private distanceStrategy!: DistanceStrategy;

    constructor(){}

    public setStrategy(distanceStrategy: DistanceStrategy): void {
        this.distanceStrategy = distanceStrategy;
    }

    public runComparison(reference : TimeSeries, target : TimeSeries) : ComparisonResult {
        if(this.distanceStrategy == null){
            throw new Error("A distance strategy must be defined before comparing the time-series.");            
        }

        TSValidator.validate(reference, target);

        const accDistMatrix = this.calculateDistanceMatrix(reference, target);
        const minDistPath = this.calculateMinimalDistPath(accDistMatrix);
        const warping = this.calculateWarping(reference, minDistPath);
        const distance = this.calculateDistance(reference, target, warping);
        const misalignment = this.calculateMisalignment(warping);
        const degreeOfMisalignment = this.calculateMisalignmentDegree(misalignment);

        return {
            warping: warping,
            distance: distance,
            misalignment: misalignment,
            degree_of_misalignment: degreeOfMisalignment
        }
    }
    /**
     * Calculates the accumulated distance matrix for two time series.
     * @param {TimeSeries} reference - the reference time-series
     * @param {TimeSeries} target - the target time-series
     * @returns the accumulated distance matrix
     */
    private calculateDistanceMatrix(reference : TimeSeries, target : TimeSeries) : Matrix<number> {
        const accDistMatrix = new Matrix<number>(reference.length, target.length, 0);

        accDistMatrix.set(0,0, this.distanceStrategy.distance(reference[0], target[0]));
        
        for(let i=1; i<accDistMatrix.getRows(); i++){
            const distance = this.distanceStrategy.distance(reference[i], target[0])
            accDistMatrix.set(i,0, (distance + accDistMatrix.get(i-1,0)));
        }
    
        for(let i=1; i<target.length; i++){
            const distance = this.distanceStrategy.distance(reference[0], target[i])
            accDistMatrix.set(0,i, (distance + accDistMatrix.get(0,i-1)));
        }
    
        for(let i=1; i<reference.length; i++){
            for(let j=1; j<target.length; j++){
                const min_neighbor : number = min(accDistMatrix.get(i-1,j-1), accDistMatrix.get(i-1,j), accDistMatrix.get(i,j-1));
                accDistMatrix.set(i,j,this.distanceStrategy.distance(reference[i], target[j]) + min_neighbor);
            }
        }    
        return accDistMatrix;
    }

    /**
     * Calculates the minimal distance path between the time-series
     * @param {Matrix} distMatrix - the accumulated-distance matrix
     * @returns a list of pairs (i,j) that describes a warping between the sequences
     */
    private calculateMinimalDistPath(distMatrix : Matrix<number>) : Path {        
        const path : Path = [];
                
        let i = distMatrix.getRows()-1;
        let j = distMatrix.getColumns()-1;

        while(i>=0 && j>=0){
            path.push({first: i, second: j} as Pair<number>);
            if(i == 0) {
                j = j-1;
            } else if(j == 0) {
                i = i-1;
            } else {
                let m = min(distMatrix.get(i-1,j), distMatrix.get(i,j-1), distMatrix.get(i-1,j-1))
                if (m == distMatrix.get(i-1,j-1)){
                    i = i-1;
                    j = j-1;
                } else if(m == distMatrix.get(i-1,j)){
                    i = i-1;
                } else {                    
                    j = j-1;
                }
            }
        }    
        return path;
    }

    /**
     * Given a record in the reference time-series, defines a best-matching record in the target time-series
     * @param index - index of the record in the reference time-series
     * @param minimalDistancePath - minimal distance path between both time-series
     * @returns the best matching record in the target-time series for the given record in the reference time-series
     */
    private getBestMatch(index : number, minimalDistancePath : Path) : number {
        const matchingPairs = minimalDistancePath.filter((pair) => (pair.first == index));
        const candidates = matchingPairs.map((pair) => pair.second);
        return floor(mean(candidates));
    }

    /**
     * For a given reference time-series, calculates all the best matching records in the target time-series
     * @param reference - reference time-series
     * @param minimalDistancePath - minimal distance path between the reference time-series and a target time-series
     * @returns an array containing all best-matching records for each record in the reference time-series
     */
    private calculateWarping(reference : TimeSeries, minimalDistancePath : Path) : Array<number>{
        const warping = Array<number>(reference.length);
        for(let n=0; n<reference.length; n++){
            warping[n] = this.getBestMatch(n, minimalDistancePath);
        }
        return warping;
    }

    /**
     * For each record in the reference time-series, calculates the distance of its index
     * to the index of the best-matching record in the target time-series
     * @param warping - warping function for the reference time-series to the target time-series
     * @returns an array containing the distance to the best-matching index in the target time-series for each record
     * in the reference time-series
     */
    private calculateMisalignment(warping : Array<number>) : Array<number> {
        let misalignment = Array<number>(warping.length);
        for(let n=0; n<warping.length; n++){
            misalignment[n] = warping[n] - n;
        }
        return misalignment;
    }

    /**
     * Defines the degree of misalignment, i.e. how early, delayed, or on-time a record in the reference time-series is,
     * compared to the target time-series
     * @param misalignment - array of distances between the index of each record reference time-series and
     * the index of its best-match in the target time-series
     * @returns an array containing the degree of misalignment of each record in the reference time-series
     */
    private calculateMisalignmentDegree(misalignment : Array<number>) : Array<number>{
        let dG = Array<number>(misalignment.length);        
        let h = Array<number>(misalignment.length);
        if(misalignment.length == 1){
            dG[0] = 1;
            h[0] = 0;
        } else{
            for(let i=0; i<misalignment.length-1; i++){
                dG[i] = misalignment[i+1] - misalignment[i];
            }
            dG[misalignment.length-1] = dG[misalignment.length-2];
            let max_dG = max(dG);
            let min_dG = min(dG);

            for(let i=0; i<dG.length; i++){
                if(dG[i] > 0){
                    h[i] = dG[i]/max_dG;
                } else if(dG[i] < 0){
                    h[i] = dG[i]/abs(min_dG);
                } else {
                    h[i] = 0;
                }
            }
        }
        return h;
    }

    /**
     * Calculates the distance between each record in the reference-time series to its best-match in the target time-series
     * @param reference - the reference time-series
     * @param target - the target time-series
     * @param warping - the warping function from the reference time-series to the target time-series
     * @returns an array containing the distance between each record in the reference-time series to its best-match in the target time-series
     */
    private calculateDistance(reference : TimeSeries, target : TimeSeries, warping : Array<number>) : Array<number> {
        let dist = Array<number>(reference.length);
        for(let n=0; n<reference.length; n++){
            const bestMatch = warping[n];
            dist[n] = this.distanceStrategy.distance(reference[n], target[bestMatch])
        }
        return dist;
    }
}