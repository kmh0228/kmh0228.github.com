/**
 * 
 * @param {arr} 数组或者数字 
 * @param {fn} 回调函数
 */
export const forEach = (arr, fn) => {
    if(!fn)return
    if(typeof arr == 'number'){
        for(var i=0;i<arr;i++){
            fn&&fn(i);
        }
    }else{
        var length = arr.length;			
        for(var i = 0; i<length;i++){
            fn&&fn(arr[i],i)
        }
    }
  }