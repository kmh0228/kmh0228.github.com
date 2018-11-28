/**
 * create by zhaomingqiang 2017.12.12
 * 鼠标滚轮事件
 */

define([
	'../../CMap/tools/log'
],function(log){
	
	var addWheel = function (obj,fn){
	    function wheel(ev){
	        var oEvent=ev||event;
	        var bDown=true;

	        if(oEvent.wheelDelta){
	            if(oEvent.wheelDelta<0){
	                bDown=false;
	            }else{
	                bDown=true;
	            }
	        }else{
	            if(oEvent.detail<0){
	                bDown=true;
	            }else{
	                bDown=false;
	            }
	        }
	        fn(bDown);
	        oEvent.preventDefault&&oEvent.preventDefault();
	        return false;
	    }
	    //判断是不是火狐
	    if(window.navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){    
	        obj.addEventListener('DOMMouseScroll',wheel,false);//'DOMMouseScroll'只兼容火狐,必须用事件绑定；
	    }else{
	        obj.onmousewheel=wheel;
	    }
	}
	
	return addWheel;
	
});

