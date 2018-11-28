// JavaScript Document

//百度地图自定义覆盖物的类
	//信息框
    function Message(point,inner,opts){
	  this.opts=opts||{};
      this._point = point||new BMap.Point(116.404, 39.915);
	  this.inner=inner||'';
	  
	  this.backgroundColor=this.opts.backgroundColor||'rgba(0,0,0,0.5)';
	  //this.borderColor=this.opts.borderColor||'#fff';
	  this.color=this.opts.color||'#fff';
	  this.fontSize=this.opts.fontSize||16;
	  this.width=this.opts.width||'auto';
	  this.height=this.opts.height||'auto';
	  this.textAlign=this.opts.textAlign||'center';
    }
    Message.prototype = new BMap.Overlay();
    Message.prototype.initialize = function(map){
      this._map = map;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
      div.style.backgroundColor = this.backgroundColor;
	  div.style.width=this.width+'px';
	  div.style.height=this.height+'px';
	  div.style.paddingTop=div.style.paddingBottom='8px';
	  div.style.paddingLeft=div.style.paddingRight='10px';
	  
	  div.style.WebkitBorderRadius=div.style.MozBorderRadius=div.style.borderRadius='10px';
	  
      //div.style.border = "1px solid "+this.borderColor;
	  div.innerHTML=this.inner;
	  div.style.whiteSpace='nowrap';
      div.style.MozUserSelect = "none";

	  div.style.textAlign=this.textAlign;
	  //div.style.lineHeight='24px';
	  div.style.color=this.color;
	  div.style.fontSize=this.fontSize+'px';
      this._map.getPanes().floatPane.appendChild(div);
      return div;
    }
	
    Message.prototype.draw = function(){
      var map = this._map;
	  var overlayWidth=parseInt(this._div.offsetWidth);
	  var overlayHeight=parseInt(this._div.offsetHeight);
	  var cli=map.getSize();
	  var cliWidth=parseInt(cli.width);
	  var cliHeight=parseInt(cli.height);
	  var pos=map.pointToPixel(this._point);
	  var left=pos.x;
	  var top=pos.y;
	  var dx=10,dy=10;
	  if(left+10+overlayWidth>cliWidth){
		 dx=-10-overlayWidth; 
		}
		if(top+10+overlayHeight>cliHeight){
			dy=cliHeight-overlayHeight-top;
		}
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x +dx + "px";
      this._div.style.top  = pixel.y +dy + "px";
    }
	
	Message.prototype.setInnerHTML=function(str){
		this.inner=str;
		this._div.innerHTML=str;
	}
	
	Message.prototype.setPoint=function(point){
		this._point=point;
		this.draw();
	}


