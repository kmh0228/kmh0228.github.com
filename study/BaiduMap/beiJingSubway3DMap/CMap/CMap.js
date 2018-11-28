/**
 * create by zhaomingqiang 2017.12.11
 * QQ: 1150123276
 */



define([
	'../CMap/tools/log',
	'../CMap/config/MapConfig',
	'../CMap/build/ThreeContainer',
	'../CMap/overlays/Overlay',
	'../CMap/overlays/Cylinder',
	'../CMap/overlays/Rectangle',
	'../CMap/overlays/HoverMessage'
],function(
	log,
	config,
	ThreeContainer,
	Overlay,
	Cylinder,
	Rectangle,
	HoverMessage
){
	log('CMap.js 开始加载');
	
	log(HoverMessage);
	
	var CMap = {

		Map : ThreeContainer, 	//定义这个地图的框架
		Cylinder : Cylinder,	//圆柱形插件
		Rectangle : Rectangle,	//矩形插件
		HoverMessage : HoverMessage
	
	}
	
	
	
	log('CMap.js 加载结束');
	
	return CMap;
});


	
	
