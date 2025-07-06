export function isNumeric(array : Array<any>) : boolean {
    let isNumeric = true;
    for(let i=0; i<array.length && isNumeric; i++){
        if(!(typeof array[i] == 'number') || isNaN(array[i])){
            isNumeric = false;
        }
    }
    return isNumeric;
}