/**
 * create by s5ming 2019.3.19
 * qq:1150123276
 */

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
    function Camera(){

    }
	return function(){
        new Camera(opt)
    };
},'camera');