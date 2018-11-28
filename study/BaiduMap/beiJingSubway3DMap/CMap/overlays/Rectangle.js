/**
 * create by zhaomingqiang 2017.12.13
 * 长方体覆盖物
 * 
 */

define([
	'../../CMap/overlays/Overlay',
	'../../CMap/tools/inherit',
	'../../CMap/tools/log',
	'../../CMap/tools/logERR',
	'../../CMap/tools/extend',
	'../../CMap/tools/forEach',
	'../../CMap/tools/setTransForm'
],function(
	Overlay,
	inherit,
	log,
	logERR,
	extend,
	forEach,
	setTransForm
){
	
	var Rectangle = inherit(Overlay,function(opts){
				
		var defaul = extend({
			opacity:0.4,
			backColor:'#0000CD',
			borderWidth:1,
			borderColor:'#00008B'
		},this.opts);
		
		this.opts = extend(opts,defaul);
		
		log(this.opts);
		
		this.initDOM();
		this.initRectangleStyle();
	});
	
	Rectangle.prototype.initDOM = function(){
		var _this = this;
		
		this.up = document.createElement('div');
		this.down = document.createElement('div');
		this.left = document.createElement('div');
		this.right = document.createElement('div');
		this.front = document.createElement('div');
		this.behind = document.createElement('div');
		
		this.DOMS=[this.up,this.down,this.left,this.right,this.front,this.behind];
		
		forEach(this.DOMS,function(e,i){
			_this.e.appendChild(e);
		});
			
	};
	
	Rectangle.prototype.initRectangleStyle = function(){
		var _this = this;
		
		this.setColor();
		
		forEach(this.DOMS,function(e){
			e.style.border = _this.opts.borderWidth +'px solid '+_this.opts.borderColor;
			e.style.boxSizing = 'border-box';
		});
		
		var length = this.DOMS.length;
		
		
		for(var i=0;i<length;i++){
			this.DOMS[i].style.opacity = this.opts.opacity;
			this.DOMS[i].style.position = 'absolute';
			this.DOMS[i].style.top = '0';
			this.DOMS[i].style.left = '0';;
			
			var tx=0,ty=0,tz=0,rx=0,ry=0,rz=0;
			switch(i){
				case 0:tz=this.opts.h;break;
				case 1:tz=1;break;
				case 2:tx=-this.opts.w/2 ;ty=(this.opts.w-this.opts.h)/2;tz=this.opts.h/2;ry=-90;rx=-90;break;
				case 3:tx=this.opts.l - this.opts.w/2 ;ty=(this.opts.w-this.opts.h)/2; tz=this.opts.h/2;ry=90;rx=-90;break;
				case 4:ty=(-this.opts.h)/2 + this.opts.w ;tz=this.opts.h/2;rx=-90;break;
				case 5:ty=(-this.opts.h)/2 ;tz=this.opts.h/2;rx=-90;ry = 180;break;
			}
			setTransForm(this.DOMS[i],{
				tx:tx,ty:ty,tz:tz,rx:rx,ry:ry,rz:rz
			});
		}
		this.up.style.width = this.down.style.width = this.opts.l+'px';
		this.left.style.width = this.right.style.width = this.opts.w+'px';
		this.front.style.width = this.behind.style.width = this.opts.l+'px';
		this.up.style.height = this.down.style.height = this.opts.w+'px';
		this.left.style.height = this.right.style.height = this.opts.h+'px';
		this.front.style.height = this.behind.style.height = this.opts.h+'px';
	
	};
	
	Rectangle.prototype.mapChange = function(z,viewCenter){
					
	};
	
	Rectangle.prototype.setColor = function (color) {
		var color = this.opts.backColor = color||this.opts.backColor;
		forEach(this.DOMS,function(e){
			e.style.background = color;
		});
	};
	
	return Rectangle;
	
});
