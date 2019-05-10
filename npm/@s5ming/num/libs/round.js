
export const roundTo = function(num,fixed){
    var num = num || 0 
    if(typeof fixed == 'undefined'){
        fixed = 2
    }
    var n = Number(num);
    return (Math.round(n*Math.pow(10,fixed))/Math.pow(10,fixed));
};