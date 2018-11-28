/**
 * create by zhaomingqiang 2017.12.12
 * CMap 的 覆盖物基类
 * 
 * 
 */

define([
	'../../CMap/tools/log',
	'../../CMap/tools/logERR',
	'../../CMap/tools/extend',
	'../../CMap/tools/setTransFormStyle'
],function(
	log,
	logERR,
	extend,
	setTransFormStyle
){
	log('Overlay.js开始加载');
	
	function Overlay(opts){
		this.e = document.createElement('div');		//覆盖物元素
		this.opts = extend(opts||{},{
			l:0,									//覆盖物长
			w:0,									//覆盖物宽
			h:0,									//覆盖物高
			x:0,									//覆盖物x坐标
			y:0,									//覆盖物y坐标
			opacity:1,							//透明度
			background:'none'
		});
		this.type = 'overlay';						//覆盖物类型
		this.p=800;									//覆盖物透视距离
		this.initStyle();						//重置样式
	}
	
	Overlay.prototype.initStyle = function(){
		this.e.style.width = this.opts.l+'px';
		this.e.style.height = this.opts.w+'px';
		this.e.style.position = 'absolute';
		this.e.style.background = this.opts.background;
		this.e.style.top = this.opts.x+'px';
		this.e.style.left = this.opts.y+'px';
		setTransFormStyle(this.e,'preserve-3d');
		this.e.style.cursor = 'pointer';		
	};
	
	Overlay.prototype.mapChange = function(z){		
	};
	
	Overlay.prototype.addHoverMessage = function(hoverMessage){
		if(hoverMessage.type !='hoverMessage'){
			logERR('Overlay的addHoverMessage方法参数必须是HoverMessage对象');return;
		}
		
		hoverMessage.addInOverlay(this);
	}
	
	Overlay.prototype.mouseenter = function (fn){
		var _this = this;
		this.e.addEventListener('mouseover',function(){
			fn&&fn.call(_this);
		});
	}
	
	Overlay.prototype.mouseleave = function (fn){
		var _this = this;
		this.e.addEventListener('mouseout',function(){
			fn&&fn.call(_this);
		});
	}
	
	
	log('Overlay.js 加载结束');
	return Overlay;
	
});


