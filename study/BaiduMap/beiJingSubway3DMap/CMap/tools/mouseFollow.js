/**
 * create by zhaomingqiang 2017.12.15
 * 
 * 用于给对象添加鼠标跟随事件, 以当前鼠标位置调用回掉函数
 * 常与mouseover和mouseout配合使用
 */

define([
	'../../CMap/tools/log'
],function(
	log
){
	
	var mouseFollow = function(obj,fnMove){
		if(!obj)return;
		var obj = document.getElementById(obj)?document.getElementById(obj):obj;

		var mousemove=function(ev){
			var oEvent = ev||event;
			fnMove&&fnMove({
				x:oEvent.clientX,
				y:oEvent.clientY
			});
		};
		obj.addEventListener('mousemove',mousemove);			

	};
	return mouseFollow;
	
});


