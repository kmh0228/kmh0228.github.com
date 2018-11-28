/**
 * create by zhaomingqiang 2018.5.14
 */

;define(function(){
	
	var extend = function(opts,defalut){
		var json = {};
		for(var name in defalut){
			json[name] = defalut[name];
		}
		for(var name in opts){
			json[name] = opts[name];
		}
		
		return json;
	};
	
	return extend;
	
});