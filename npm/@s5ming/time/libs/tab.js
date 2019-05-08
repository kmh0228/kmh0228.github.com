//转换工具
/* timestamp 时间戳     date 日期格式{year,month,date} 
    dateStr 日期字符串格式year-month-date
*/
import {extend} from '@s5ming/json'
const toDou = function(n){
    return n<10?'0'+n:''+n;
}
 // 时间戳转换成日期   
export const timestampToDate = function(timestamp){
    var date = new Date(timestamp)
    return {
        year:date.getFullYear(),
        month:date.getMonth() + 1,
        date:date.getDate(),
        hour:date.getHours(),
        minute:date.getMinutes(),
        second:date.getSeconds()
    }
}

//日期转日期字符串
export const dateToDateStr = function(date,split){
    var split = split || '-';
    return date.year + '-' + toDou(date.month) + '-' + toDou(date.date);
}

//时间戳转日期字符串格式
export const timestampToDateStr = function(timestamp,split){
    return dateToDateStr(timestampToDate(timestamp),split);
}

//时间字符串转日期对象 时间字符串默认格式 2019-05-06 14:25:26
export const timeStrToDateObj = function(timeStr,split){
    var date = new Date();
    var split = extend(split || {},{
        dateSplit:'-',
        mSplit:' ',
        timeSplit:':'
    })
    var arr = timeStr.split(split.mSplit)
    date.setFullYear(...arr[0].split(split.dateSplit))
    date.setHours(...arr[1].split(split.timeSplit),0)
    return date
}

//时间字符串转成时间戳 参数同上   时间字符串默认格式 2019-05-06 14:25:26
export const timeStrToTimestamp = function(){
    return timeStrToDateObj(...arguments).getTime()
}

//时间戳转时间字符串  12231231131312 >  2019-05-06 14:25:26
export const timestampToTimeStr = function(timestamp,split){
    var split = extend(split || {},{
        dateSplit:'-',
        mSplit:' ',
        timeSplit:':'
    })
    var date = timestampToDate(timestamp)
    return date.year + split.dateSplit + toDou(date.month) + split.dateSplit + toDou(date.date) + split.mSplit
        + toDou(date.hour) + split.timeSplit + toDou(date.minute) + split.timeSplit + toDou(date.second)
}

//毫秒数转换成时分秒   4646541315 >> 10:00:00
export const milliToHours = function(mill){
    var mi = parseInt(mill / 1000)
    var hour = parseInt(mi / 3600)
    var minute = parseInt((mi % 3600) / 60)
    var second = mi % 60
    return hour + ':' + toDou(minute) + ':' + toDou(second)
}
