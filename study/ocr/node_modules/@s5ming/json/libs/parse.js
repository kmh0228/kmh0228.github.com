/**
 * create by s5ming 2019.4.3
 * qq:1150123276
 * 待解决的问题:value值里出现 逗号或者分号的时候
 */
(function(factory,name){
	if(typeof exports === 'object' && typeof module !== 'undefined'){
		var result = factory();
		module.exports = result;		//webpack模块
	}else if(typeof define === 'function' && define.amd){
		define(factory);			//require模块 
	}else{
		window[name] = factory();	//js引入
	}
})(function(){

    function removeSem(str){
        var str5 = str.trim();
        var length = str5.length;
        if(str5[0] == "'" || str5[0] == '"'){
            return str5.substring(1,length-1);
        }else{
            return str5;
        }
    }

    return function(str){
        var str2 = str.trim();
        var str2length = str2.length;
        var l_kh = str2[0];
        var r_kh = str2[str2length-1];
        console.log(l_kh,r_kh);
        if(l_kh != "{" || r_kh != "}"){
            console.error(str+' 不是一个标准的json,{}大括号不完善');
            return {error:'不是一个标准的json'}
        }
        var str3 = str2.substring(1,str2length-1);
        var result = {};
        var arr = str3.split(',');
        var arrlength = arr.length;
        for(var i = 0;i < arrlength; i++){
            var str4 = arr[i].trim();
            if(!str4)continue;
            var arr2 = str4.split(':');
            result[removeSem(arr2[0])] = removeSem(arr2[1]);
        }
        return result;
    };
    
},'parse');