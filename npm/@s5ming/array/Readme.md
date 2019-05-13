# 关于数组的一些处理方法
# 引入
> import {forEach,forEachChildren} from 's5-array'
>

# 使用说明

### forEach
forEach(arr,fn)     //循环处理数组的方法
    params:`1`array:数组或者数字,数字的时候代表循环的次数,`2`fn:回调函数,函数参数是(当前项,下标)

### forEachChildren
forEachChildren  //多层循环处理json数组的方法
    params:`1`arr:json数组`2`fn:回调函数,函数参数是(当前项,下标)`3`childkey:下一层对应的key,默认'children'

### binaryPlus
binaryPlus //在一个递增数组里找到第一大于或等于某个数的值的下标,全部小于,则返回最后一个值的下标 此方法是根据二分法查找的,不管数据多大,毫秒级找出来
binaryPlus(arr,n)