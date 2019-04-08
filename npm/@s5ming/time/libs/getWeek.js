
const getWeek = function(date){
    var sdate=new Date();
    date && sdate.setFullYear(date.year,date.month-1,date.date);
    return sdate.getDay();
}
export default getWeek
