// I am kmh0228
//QQ 1150123276

//jQuery插件，请先引入jQuery

(function($) {
	$.fn.keyboard=function(opts){
		var opts=$.extend({
			backgroundType:'linearSrcoll',//'color' 纯色  'linear'渐变色 'radial'放射渐变  'linearSrcoll' 动态渐变色  'radialScroll'动态放射性渐变     
			backgroundColors:['red','yellow','orange'],//颜色，纯色的话只写一个
			backgroundColorsTilt:45,//渐变颜色倾斜度
			borderType:'linearSrcoll',//'color' 纯色  'linear'渐变色 'radial'放射渐变  'linearSrcoll' 动态渐变色  'radialScroll'动态放射性渐变     
			borderColors:['red','yellow','orange'],//颜色，纯色的话只写一个
			borderColorsTilt:45,//渐变颜色倾斜度
			keyType:'byS',
			keyColors:['red','yellow','orange'],
		},opts||{});
		initStyle(this,opts);
		addEL(this,opts);
	};
	function initStyle(obj,opts){
		
	}
	function addEL(obj,opts){
		
	}
})(jQuery);






