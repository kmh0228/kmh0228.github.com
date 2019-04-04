(function(factory,name){
	if(typeof exports === 'object' && typeof module !== 'undefined'){
		var result = factory();
		export default result;		//webpack模块
	}else if(typeof define === 'function' && define.amd){
		define(factory);			//require模块 
	}else{
		window[name] = factory();	//js引入
	}
})(function(){

    return function(data){
        var type = typeof data;
        if(type == 'object'){
            if(data === null){
                type = 'null';
            }else if(data.constructor == Array){
                type = 'array'
            }else if(data.toString() == '[object Object]'){
                if(data.constructor == Object){
                    type = 'json';
                }
            };
        }
        return type;
    };
    
},'getDataType');