// JavaScript Document
function getStyle(obj,name){
	return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
}

function dragY(obj,par,con,conpar){
	obj.onmousedown  = function(ev){
			var oEvent = ev||event;
			var disY = oEvent.clientY - obj.offsetTop;
			document.onmousemove = function(ev){
				var oEvent = ev||event;
				var t = oEvent.clientY - disY;
				if(t<0){
					t = 0;
				}else if(t>parseFloat(getStyle(par,'height'))- obj.offsetHeight){
					t=parseFloat(getStyle(par,'height'))- obj.offsetHeight;
				}
				obj.style.top = t +'px';
				sca=t/(parseFloat(getStyle(par,'height'))- obj.offsetHeight);
				con.style.top=(parseFloat(getStyle(conpar,'height'))- con.offsetHeight)*sca+'px';
			};
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
				obj.releaseCapture&&obj.releaseCapture();
			};
				obj.setCapture&&obj.setCapture();
			return false;
		};
};