/**
 * create by zhaomingqiang 2017.12.14
 * 
 * 用于封装 transform兼容性写法
 * 
 * 
 * 
 * 参数 opts格式
 * x平移  y平移    z平移  x旋转   y旋转   z旋转
 * {tx:tx,ty:ty,tz:tz,rx:rx,ry:ry,rz:rz}
 */


define([
	'../../CMap/tools/logWarning',
	'../../CMap/tools/forEach',
	'../../CMap/tools/isBe',
	'../../CMap/tools/log'
	],function(
		logWaning,
		forEach,
		isBe,
		log
	){
	log('setTransForm 开始加载');
	var setTransForm = function(obj,opts){
		
		if(!opts){
			logWaning('setTransForm方法参数不足');
			return;
		};
			
		//设置样式
		var transformstyle='';
		transformstyle+=isBe(opts.tx)?'translateX('+opts.tx+'px) ':'';
		transformstyle+=isBe(opts.ty)?'translateY('+opts.ty+'px) ':'';
		transformstyle+=isBe(opts.tz)?'translateZ('+opts.tz+'px) ':'';
		transformstyle+=isBe(opts.rx)?'rotateX('+opts.rx+'deg) ':'';
		transformstyle+=isBe(opts.ry)?'rotateY('+opts.ry+'deg) ':'';
		transformstyle+=isBe(opts.rz)?'rotateZ('+opts.rz+'deg) ':'';
		
		forEach([
			'WebkitTransform',		// chrome，safari 内核
			'MozTransform',			// firefox 内核
			'MsTransform',			// ie 内核
			'OTransform',			// opera 内核
			'transform',			// 默认
		],function(s){
			
			obj.style[s]=transformstyle;
			
		});
		
	}
	
	
	log('setTransForm 加载结束');	
	return setTransForm;
});
