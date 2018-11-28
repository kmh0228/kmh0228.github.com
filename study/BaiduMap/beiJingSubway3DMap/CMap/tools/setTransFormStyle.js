/**
 * create by zhaomingqiang 2017.12.14
 * 
 * 用于封装设置transformStyle样式的兼容性写法
 * 默认值为 preserve-3d
 */

define([
	'../../CMap/tools/forEach',
	'../../CMap/tools/log'
],function(
	forEach,
	log
){
	
	log('setTransFormStyle 开始加载');
	var setTransFormStyle = function(obj,value){
		
		var value = value||'preserve-3d';
		
		forEach([
			'WebkitTransformStyle',		// chrome，safari 内核
			'MozTransformStyle',		// firefox 内核
			'MsTransformStyle',			// ie 内核
			'OTransformStyle',			// opera 内核
			'transformStyle'			// 默认
		],function(s){
			obj.style[s]=value;
		});
	};
	log('setTransFormStyle 加载结束');
	return setTransFormStyle;
	
});
