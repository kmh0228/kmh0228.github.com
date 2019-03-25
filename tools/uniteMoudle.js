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
	return '模块内容'; 
},'myPlugin');