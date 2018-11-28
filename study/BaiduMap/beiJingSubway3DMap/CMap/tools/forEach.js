/**
 * create by zhaomingqiang 2017.12.13
 * 
 * 封装 for循环
 */

define(function(){
	
	var forEach = function ( arr , fn ){
		
		var length = arr.length;
		
		for(var i = 0; i<length;i++){
			fn&&fn(arr[i],i);
		}
	};
	
	return forEach;
});
