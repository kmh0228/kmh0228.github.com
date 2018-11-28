/**
 * create by zhaomingqiang 2017.12.11
 * 
 * 用于将两个json合并的工具。通常用于参数处理，后者填写默认值
 * 
 * 
 */


define([
	'../../CMap/tools/isBe',
	'../../CMap/tools/logWarning'
],function(
	isBe,
	logWarning
){
	
	var extend = function(opts,defau){
		if(arguments.length<2){
			logWarning('extend参数至少为两个');
			return opts;
		}
		var result = {};
		
		for(var name in opts){
			result[name] = opts[name];
		}
		
		for(var name in defau){
			if(isBe(result[name])){
				
			}else{
				result[name] = defau[name];
			}
		}
		return result;
	};
	
	return extend;
	
});
