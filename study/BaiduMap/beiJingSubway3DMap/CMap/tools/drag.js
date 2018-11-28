/**
 * create by zhaomingqiang 2017.12.11
 * 
 * 用于给对象添加拖拽事件
 * 
 */

define(function(){
	
	var drag = function(obj,fndown,fnmove,fnup){
		if(!obj)return;
		var obj = document.getElementById(obj)?document.getElementById(obj):obj;
		if(arguments.length==2){
			var fnmove=fndown;
			fndown=null;
		}
		var mousedown=function(ev){
			var oEvent = ev||event;
			var oldX = oEvent.clientX;
			var oldY = oEvent.clientY;
			fndown&&fndown();
			var mousemove=function(ev){
				var oEvent = ev||event;
				var newX = oEvent.clientX;
				var newY = oEvent.clientY;
				fnmove&&fnmove(newX-oldX,newY-oldY);
				oldX=newX;oldY=newY;
			};
			document.addEventListener('mousemove',mousemove);			
			var mouseup=function(){
				document.removeEventListener('mousemove',mousemove);
				document.removeEventListener('mouseup',mouseup);
				fnup&&fnup();
				obj.releaseCapture&&obj.releaseCapture();
			};
			document.addEventListener('mouseup',mouseup);
			obj.setCapture&&obj.setCapture();
			ev.preventDefault();
		};
		obj.addEventListener('mousedown',mousedown);
	};
	return drag;
	
});


