import { abs, floor, max, mean, min } from 'mathjs';
import type { DistanceStrategy } from './strategies/IDistanceStrategy';
import type { ComparisonResult, TimeSeries } from './types/TSComparator.types';

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
            throw new Error("A distance strategy must be set before running a comparison");            
        }
        if(reference.length == 0 || target.length == 0){
            throw new Error("Time-Series cannot be empty");            
        }

        const accDistMatrix = this.computeAccumDistMatrix(reference, target);
        const minDistPath = this.findMinimalDistancePath(accDistMatrix);
        const distance = this.computeDistance(reference, target, minDistPath);
        const misalignment = this.computeMisalignment(reference, minDistPath);
        const degreeOfMisalignment = this.computeDegreeOfMisalignment(misalignment);

        return { 
            distance: distance,
            misalignment: misalignment,
            degree_of_misalignment: degreeOfMisalignment
        }
    }

    private initializeDistanceMatrix(l : number, n : number){
        const m = new Array(l);
        for(let i=0; i<l; i++){
            m[i] = new Array(n).fill(0);
        }
        return m;
    }

    private computeAccumDistMatrix(reference : TimeSeries, target : TimeSeries) : Array<Array<number>> {
        const l = reference.length;
        const n = target.length;
        const accDistMatrix = this.initializeDistanceMatrix(l, n);

        accDistMatrix[0][0] = this.distanceStrategy.distance(reference[0], target[0]);
        
        for(let i=1; i<l; i++){
            accDistMatrix[i][0] = this.distanceStrategy.distance(reference[i], target[0]) + accDistMatrix[i-1][0];
        }
    
        for(let i=1; i<n; i++){
            accDistMatrix[0][i] = this.distanceStrategy.distance(reference[0], target[i]) + accDistMatrix[0][i-1];
        }
    
        for(let i=1; i<l; i++){
            for(let j=1; j<n; j++){
                accDistMatrix[i][j] = this.distanceStrategy.distance(reference[i], target[j]) + min(accDistMatrix[i-1][j-1], accDistMatrix[i-1][j], accDistMatrix[i][j-1]);
            }
        }
    
        return accDistMatrix;
    }

    private findMinimalDistancePath(distMatrix : Array<Array<number>>) : Array<Array<number>>{ 
        const path = [];
        
        let i = distMatrix.length - 1;
        let j = distMatrix[0].length - 1;

        while(i>=0 && j>=0){
            path.push([i,j]);
            if(i == 0) {
                j = j-1;
            } else if(j == 0) {
                i = i-1;
            } else {
                let m = min(distMatrix[i-1][j], distMatrix[i][j-1], distMatrix[i-1][j-1]);
                if (m == distMatrix[i][j-1]){
                    j = j-1;
                } else if(m == distMatrix[i-1][j]){
                    i = i-1;
                } else {
                    i = i-1;
                    j = j-1;
                }
            }
        }

        return path;
    }

    private getBestMatch(index : number, minimalDistancePath : Array<Array<number>>){
        const matchingPairs = minimalDistancePath.filter((pair) => (pair[0] == index));
        const candidates = matchingPairs.map((innerArray) => innerArray[1]);
        return floor(mean(candidates));
    }

    private computeDegreeOfMisalignment(misalignment : Array<number>) : Array<number>{
        let dG = Array<number>(misalignment.length);        
        let h = Array<number>(misalignment.length);
        if(misalignment.length == 1){
            dG[0] = 1;
            h[0] = 0;
        } else{
            for(let i=0; i<misalignment.length-1; i++){
                dG[i] = misalignment[i+1] - misalignment[i]
            }
            dG[misalignment.length-1] = dG[misalignment.length-2];
            let max_dG = max(dG);

            for(let i=0; i<dG.length; i++){
                if(dG[i] > 0){
                    h[i] = dG[i]/max_dG;
                } else if(dG[i] < 0){
                    h[i] = dG[i]/abs(max_dG);
                } else {
                    h[i] = 0;
                }
            }
        }
        return h;
    }

    private computeMisalignment(reference : TimeSeries, minimalDistancePath : Array<Array<number>>){
        let misalignment = Array<number>(reference.length);
        for(let i=0; i<reference.length; i++){
            misalignment[i] = (this.getBestMatch(i, minimalDistancePath) - i)
        }
        return misalignment;
    }

    private computeDistance(reference : TimeSeries, target : TimeSeries, minimalDistancePath : Array<Array<number>>){
        let dist = Array<number>(reference.length);
        for(let i=0; i<reference.length; i++){
            let bestMatch = this.getBestMatch(i, minimalDistancePath);
            dist[i] = this.distanceStrategy.distance(reference[i], target[bestMatch])
        }
        return dist;
    }
}