# 关于time的一些工具
# 引入
> import {
    getDay,
    getWeek,
    timestampToDate,
    dateToDateStr,
    timestampToDateStr
} from '@s5ming/time'
>

# 使用说明
## getDay
获取日期
```
var day = getDay(n)
    @params n : 偏移的天数,默认是0,获取的今天 
    day : 返回结果 格式是 {year:year,month:month,date:date}
```
## getWeek
获取今天是周几
```
var week = getWeek(date)
    @params date : 获取星期的日期 格式是 {year:year,month:month,date:date},不填默认今天
    week : 返回结果 0-7的数字,0对应周日
```
## timestampToDate
时间戳转换成日期json
```
var date = timestampToDate(timestamp)
    @params timestamp : 时间戳
    date : 返回结果 格式 {year:year,month:month,date:date}
```
## dateToDateStr
日期json转换成日期字符串
```
var dateStr = dateToDateStr(date, split)
    @params date : 需要转换格式的日期 格式是 {year:year,month:month,date:date}
    @params split : 年月日之间的分隔符,不填写则默认'-'
    dateStr : 返回日期字符串 格式 year-month-date
```
## timestampToDateStr
时间戳转换成日期字符串
```
var dateStr = timestampToDateStr(timestamp)
    @params timestamp : 时间戳
    @params split : 年月日之间的分隔符,不填写则默认'-'
    dateStr : 返回日期字符串 格式 year-month-date
```
