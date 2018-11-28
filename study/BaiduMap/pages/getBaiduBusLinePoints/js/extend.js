/**
 * create by zhaomingqiang 2017.12.11
 * 
 * 用于将两个json合并的工具。通常用于参数处理，后者填写默认值
 * 
 * 
 */


define(function(){
	//					主要数据  默认的次要数据  参数
	var extend = function(opts,defau,config){
		var config = config || {};
		var exclude = config.exclude || []; 
		var excludeLength = exclude.length;

		var result = {};
		
		for(var name in opts){
			result[name] = opts[name];
		}
		
		for(var name in defau){
			
			var find = false;
			for(var i=0;i<excludeLength;i++){
				if(exclude[i] == name)find = true;
				break;
			}
			if(find)continue;
			if(typeof result[name] == 'undefined'){
				result[name] = defau[name];
			}else if(result[name] && result[name].constructor == Object && result[name].toString() == '[object Object]'){				
				result[name] = extend(result[name],defau[name]);				
			}
				
			
		}
		
		return result;
	};
	
	return extend;
	
});
