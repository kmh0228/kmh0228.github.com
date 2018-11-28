/*
 * create by zhaomingqiang 2018.9.10
 */

;define([
	'./water.min'
],function(
	
){
	
	var River = function(opts){
		var opts = this.opts = opts || {};
		var id = this.id = opts.id || 'river';
		
		var obj = this.obj = document.getElementById(id);
		var settings = {
            image: './images/water.jpg',//image path
            rippleRadius: 3,//radius of the ripple
            width: 800,//width
            height: 800,//height
            delay: 1,//if auto param === true. 1 === 1 second delay for animation
            auto: true//if auto param === true, animation starts on it´s own

        };
		this.water = new WaterRippleEffect(obj, settings );
		this.initStyle();
	};
	
	River.prototype.initStyle = function(){
		var ts = this.obj.style;
		ts.overflow = 'hidden';
	};
	
	
	
	return function(opts){
		return new River(opts);
	};
	
});