# 关于time的一些工具
# 引入
> import {getDay} from '@s5ming/time'
>

# 使用说明
## getDay
```
var day = getDay(n)
    @params n : 偏移的天数,默认是0,获取的今天 
    day : 返回结果 格式是 {year:year,month:month,date:date}
```
## getWeek
```
var week = getWeek(date)
    @params date : 获取星期的日期 格式是 {year:year,month:month,date:date},不填默认今天
    week : 返回结果 0-7的数字,0对应周日
```
