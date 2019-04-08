
const getDay = function(n){
    var n=Number(n||0);
	var date=new Date();
	var dat=date.getDate();
	date.setDate(dat+n);
	var strYear=date.getFullYear();
	var month=Number(date.getMonth())+1;
	var da=Number(date.getDate());
	return {
        year:strYear,
        month:month,
        date:da
    };
}
export default getDay
