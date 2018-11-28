/**
 * create by zhaomingqiang 2017.12.12
 * 圆柱形覆盖物
 * 
 */

define([
	'../../CMap/overlays/Overlay',
	'../../CMap/tools/inherit',
	'../../CMap/tools/log',
	'../../CMap/tools/logERR',
	'../../CMap/tools/extend'
		
],function(
	Overlay,
	inherit,
	log,
	logERR,
	extend
){
	
	var Cylinder = inherit(Overlay,function(opts){
		
		
		var defaul = extend({
			opacity:1
		},this.opts);
		
		this.opts = extend(opts,defaul);
		
		
		
		this.initDOM();
		this.initCylinderStyle();
	});
	
	Cylinder.prototype.initDOM = function(){
		this.up = document.createElement('div');
		this.down = document.createElement('div');
		this.around = document.createElement('div');
		this.e.appendChild(this.up);
		this.e.appendChild(this.down);
		this.e.appendChild(this.around);
	};
	
	Cylinder.prototype.initCylinderStyle = function(){
		if(this.opts.w!=this.opts.l){
			logERR('Cylinder 圆柱体覆盖物长度和宽度不一致');
		}
		
		this.up.style.width = this.up.style.height = this.down.style.width = this.down.style.height = this.opts.l+'px';
		this.up.style.opacity = this.down.style.opacity = this.around.style.opacity = this.opts.opacity;
		this.up.style.position = this.down.style.position = this.around.postion = 'absolute';
		this.up.style.top = this.down.style.top = this.around.left = 0;
		this.up.style.left = this.down.style.left = this.around.left = 0;
		this.up.style.borderRadius = this.down.style.borderRadius ='50%';
		
		this.up.style.WebkitTransform='translateZ('+this.opts.h+'px)';			
		this.down.style.WebkitTransform=' translateZ(1px)';	
		
		this.around.style.width = this.opts.l +'px';
		this.around.style.height = this.opts.h + 'px';
		this.around.style.WebkitTransform = 'translateZ('+(this.opts.h/2)+'px) translateY('+((this.opts.l-this.opts.h)/2)+'px) rotateX(90deg) rotateZ(0deg) rotateY(0deg)';

		this.up.style.background = this.down.style.background = this.around.style.background ='blue';

	};
	
	Cylinder.prototype.mapChange = function(z,viewCenter){
		var deg = Math.atan2(this.opts.l - viewCenter.x, this.opts.w - viewCenter.y);
		var deg = deg/Math.PI*180;
		var z =  -z;
		this.around.style.WebkitTransform = 'translateZ('+(this.opts.h/2)+'px) translateY('+((this.opts.l-this.opts.h)/2)+'px) rotateX(90deg) rotateZ(0deg) rotateY('+z+'deg)';
			
	};

	return Cylinder;
	
});
