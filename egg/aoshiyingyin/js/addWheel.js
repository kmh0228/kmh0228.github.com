// JavaScript Document
function addWheel(obj,fn){
	function fnWheel(ev){
		var oEvent = ev||event;
		var down = false;
		if(oEvent.wheelDelta){
			if(oEvent.wheelDelta<0){
				down = true;
			}else{
				down = false;
			}
							
		}else{
			if(oEvent.detail>0){
				down = true;
			}else{
				down = false;
			}
		}
		fn(down);
		if(oEvent.wheelDelta){
			ev.preventDefault();
		}else{
			return false;	
		}
	}
	obj.onmousewheel = fnWheel;
	obj.addEventListener&&obj.addEventListener('DOMMouseScroll',fnWheel,false);
}
