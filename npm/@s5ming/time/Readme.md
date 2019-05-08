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
    date : 返回结果 格式 {year:year,month:month,date:date,hour:hour,minute:minute,second:second}
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
## timeStrToDateObj
时间字符串转换成Date对象
```
var date = timeStrToDateObj(time,split)
    @params time : 时间字符串,分隔符标准请在下个字符串定义,例如:"2019-08-24 4:25:26"
    @params split : json参数{
                    dateSplit:'-',  //年月日之间的分隔符,不填写则默认'-'
                    mSplit:' ',     //年月日与时间之间的分隔符,不填写则默认' '
                    timeSplit:':'   //时间之间的分隔符,不填写则默认':'
                }
    @result date Date的实例对象
```
## timeStrToTimestamp
时间字符串转换成时间戳
```
var timestamp = timeStrToTimestamp(time,split)
    //不做详细解释,与上方法相同,只是返回的结果是个时间戳
```
## timestampToTimeStr
时间戳转换成时间字符串
```
var timeStr = timestampToTimeStr(timestamp,split)
    //不做详细解释,上方法的逆向转换,split参数与上相同
```

## milliToHours
毫秒数转换成事件的方法  例如 15131315格式 >> 10:00:00 格式
```
var time = milliToHours(mill)
    //参数是毫秒数, 返回值是 时:分:秒 格式
```


