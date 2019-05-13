/**
 * 对于多层数组的循环方法,默认子数组的key是children
 * 例如 [{a:1,b:1,children[{a:2,b:2}]}]
 * 
 * @param {arr} 数组或者数字 
 * @param {fn} 回调函数
 * @param {childkey} 
 */

const forEachChildren = (arr, fn, childkey = 'children') => {
    if(!fn)return
    function work(arr2,index){
        var length = arr2.length;
        var index = index?index+'-':''			
        for(var i = 0; i<length;i++){
            var item = arr2[i]
            fn&&fn(item,index+i)
            if(item[childkey]&&item[childkey].length){
                work(item[childkey],index+i)
            }
        }
    }
    work(arr)
  }
export default forEachChildren