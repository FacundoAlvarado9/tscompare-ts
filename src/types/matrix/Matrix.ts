export interface IMatrix<T> {
    get(row : number, column : number) : T;
    set(row : number, column : number, value : T) : void;
    getRows() : number;
    getColumns() : number;
}

export class Matrix<T> implements IMatrix<T>{

    private matrix : Array<Array<T>>;

    constructor(num_rows : number, num_columns : number, defaultValue : T){
        if(num_rows <= 0 || num_columns <= 0){
            throw new Error("Matrix must have at least one row and one column.");
        }

        this.matrix = new Array(num_rows);
        for(let i=0; i<num_rows; i++){
            this.matrix[i] = new Array(num_columns).fill(defaultValue);
        }
    }

    private checkInBounds(row: number, column: number) : void {
        if(row < 0 || column < 0 || row >= this.getRows() || column >= this.getColumns()){
            throw new Error(`Index out of bounds: Row ${row}, Column ${column}`);
        }
    }

    get(row: number, column: number): T {
        this.checkInBounds(row, column);
        return this.matrix[row][column];
    }

    set(row: number, column: number, value: T): void {
        this.checkInBounds(row, column);
        this.matrix[row][column] = value;
    }

    getRows(): number {
        return this.matrix.length;
    }
    
    getColumns(): number {
        return this.matrix[0].length;
    }
}