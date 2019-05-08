/**
 * 二分法在一个递增数组中找到第一个大于等于某个数的数字的下标
 */
var binaryPlus = function(arr,n){
    var left = 0;
    var right = arr.length-1;
    while(left < right){
        var center = Math.floor((left+right)/2); 
        if(n <= arr[center]){
            right = center;
        }else{
            left = center + 1;
        }
    }
    return right;
}
export default binaryPlus