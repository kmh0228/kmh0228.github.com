// JavaScript Document

	//我的红绿灯
	function MyPic(src,pointstart,pointend){
		this.src=src;
		this.ps=pointstart;
		this.pe=pointend;
    }
    MyPic.prototype = new BMap.Overlay();
    MyPic.prototype.initialize = function(map){
      this._map = map;
      var image = this._image = new Image();
	  image.src=this.src;
      image.style.position = "absolute";
      image.style.zIndex = BMap.Overlay.getZIndex(this.ps.lat);
      image.style.height = "9px";
      image.style.width = "23px";
      image.style.MozUserSelect = "none";
	  image.style.cursor='pointer';
	  //this._mouseover&&image.addEventListener('mouseover',this._mouseover);
	  //this._mouseout && image.addEventListener('mouseout',this._mouseout);
      this._map.getPanes().floatPane.appendChild(image);
      
      return image;
    }
	
    MyPic.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this.ps);
      this._image.style.left = pixel.x  + "px";
      this._image.style.top  = pixel.y  + "px";
	  var pixel2 = map.pointToOverlayPixel(this.pe);
	  this._image.style.height=pixel2.y - pixel.y +"px";
	  this._image.style.width=pixel2.x - pixel.x +"px";
    }
