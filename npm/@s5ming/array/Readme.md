# 关于数组的一些处理方法
# 引入
> import {forEach} from 's5-array'
>

# 使用说明
方法|说明|参数说明
--------|---------|--------
forEach|循环处理数组的方法|`1`array:数组或者数字,数字的时候代表循环的次数,`2`fn:回调函数,函数参数是(当前项,下标)
forEachChildren|多层循环处理json数组的方法|`1`arr:json数组`2`fn:回调函数,函数参数是(当前项,下标)`3`childkey:下一层对应的key,默认'children'

