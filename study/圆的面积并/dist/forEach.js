/**
 * create by zhaomingqiang 2018.5.14
 */

;define(function(){
	
	var forEach = function(arr,fn){
		var length = arr.length;
		for(var i = 0 ;i<length;i++){
			fn&&fn(arr[i],i);
		}
	};
	
	return forEach;
	
});