/**
 * create by zhaomingqiang 2018.1.8
 * 
 * 初始化地图的方法
 * 
 * 使用 var map = mapInit(opts);
 * 
 */

;define([
	'./config_mapInt',		//默认配置项
	'./extend',
	'./BMap'
],function(
	mapConfig,
	extend
){
	
	
	var mapInit = function(opts){
		
		/*opts参数{					//详见mapConfig
			id:id,										//id
			center:{lng:116.404,lat:39.915},			//默认中心点位置
			zoom:12,									//默认地图等级
			currentcity:'北京',							//地图当前显示的城市
			enableScrollWheelZoom:true,					//是否让地图随滚轮缩放
			initStyle:initStyle,//初始化的地图样式
			load:function(){}							//地图首次加载完成事件
			minZoom:11,									//地图最小层级
			maxZoom:16,									//地图最大层级
			navLoc:{x:0,y:20}							//地图层级空间位置
		}*/
		
		var opts = extend(opts,mapConfig);
		
		var map = new BMap.Map(opts.id);    // 创建Map实例
		if(opts.center){map.centerAndZoom(new BMap.Point(opts.center.lng,opts.center.lat),opts.zoom)};  // 初始化地图,设置中心点坐标和地图级别
		//map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
		if(opts.currentcity){map.setCurrentCity(opts.currentcity)};          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(opts.enableScrollWheelZoom);//让地图随滚轮缩放
		map.setMapStyle(opts.initStyle);
		opts.minZoom && map.setMinZoom(opts.minZoom);
		opts.maxZoom && map.setMaxZoom(opts.maxZoom);
		var loaded=false;
		function maploaded(){
			if(loaded)return;
			loaded=true;

			//添加地图级别控件
			var navigation=new BMap.NavigationControl(map);
			map.addControl(navigation);
			navigation.setOffset(new BMap.Size(opts.navLoc.x,opts.navLoc.y));
			opts.load&&opts.load(map);
		}
		map.addEventListener("tilesloaded",maploaded);
		
		return map;
	};
	
	
	
	return mapInit;
});
