// JavaScript Document
//拖拽函数，当两个参数时，第二个参数是移动时间
	function drag(obj,fndown,fnmove,fnup){
		if(!obj){return ;}else{}
		if(arguments.length==2){
			var fnmove=fndown;
			fndown=null;
		}else{
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
			};
			document.addEventListener('mousemove',mousemove);
			
			var mouseup=function(){
				document.removeEventListener('mousemove',mousemove);
				document.removeEventListener('mousemove',mousemove);
				fnup&&fnup();
				obj.releaseCapture&&obj.releaseCapture();
			};
			document.addEventListener('mouseup',mouseup);
			obj.setCapture&&obj.setCapture();
			ev.preventDefault();
		};
		obj.addEventListener('mousedown',mousedown);
	}

