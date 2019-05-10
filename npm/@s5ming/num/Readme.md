# 关于number处理的一些工具
# 引入
> import {
    roundTo
} from '@s5ming/num'
>

# 使用说明
## roundTo
四舍五入,并保留fixed位小数位数
```
var resultNum = roundTo(number,fixed)
    @params number : 准备进行四舍五入的数字
    @params fixed : 保留的小数位数
    resultNum : 返回的处理后的数
```
## getW