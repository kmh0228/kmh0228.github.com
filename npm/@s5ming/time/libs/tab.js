//转换工具
/* timestamp 时间戳     date 日期格式{year,month,date} 
    dateStr 日期字符串格式year-month-date
*/

 // 时间戳转换成日期   
export const timestampToDate = function(timestamp){
    var date = new Date(timestamp)
    return {
        year:date.getFullYear(),
        month:date.getMonth() + 1,
        date:date.getDate()
    }
}

//日期转日期字符串
export const dateToDateStr = function(date,split){
    var split = split || '-';
    return date.year + '-' + date.month + '-' + date.date;
}

//时间戳转日期字符串格式
export const timestampToDateStr = function(timestamp,split){
    return dateToDateStr(timestampToDate(timestamp),split);
}
