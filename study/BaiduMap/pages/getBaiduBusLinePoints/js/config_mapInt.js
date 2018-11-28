/**
 * 
 * create by zhaomingqiang 2018.1.8
 * 
 * 默认初始化地图的参数
 * 
 */

;define({
	
	id:'container_map',							//容器id
	center:{lng:118.144153,lat:24.496983},			//默认中心点位置
	zoom:13,									//默认地图等级
	currentcity:'厦门市',							//地图当前显示的城市
	enableScrollWheelZoom:true,					//是否让地图随滚轮缩放
	navLoc:{x:0,y:20},							//地图层级空间位置
	
	
	initStyle:{									//初始化的地图样式
		styleJson : [ {
			featureType : "land",				//陆地
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				color : "#212121"				//颜色
			}
		}, {
			featureType : "building",			//建筑物
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				color : "#2b2b2b"				//颜色
			}
		}, {
			featureType : "highway",			//高速及国道	
			elementType : "all",				//样式范围 all 所有几何样式和文本样式
			stylers : {
				lightness : -42,				//亮度
				saturation : -91				//饱和度
			}
		}, {
			featureType : "arterial",			//城市主路
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				lightness : -77,				//亮度
				saturation : -94				//饱和度
			}
		}, {
			featureType : "green",				//绿地
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				color : "#1b1b1b"				//颜色
			}
		}, {
			featureType : "water",				//水系
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				color : "#181818"				//颜色
			}
		}, {
			featureType : "subway",				//地铁
			elementType : "geometry.stroke",	//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				color : "#181818"				//颜色
			}
		}, {
			featureType : "railway",			//铁路
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				lightness : -52,				//亮度      1d1d1d
				visibility : "off"				//是否显示
			}
		}, {
			featureType : "railway",			//铁路
			elementType : "all",				//样式范围 all 所有几何样式和文本样式
			stylers : {
				visibility : "off"				//是否显示
			}
		}, {
			featureType : "subway",				//地铁
			elementType : "all",				//样式范围 all 所有几何样式和文本样式
			stylers : {
				visibility : "off"				//是否显示
			}
		}, {
			featureType : "all",				//全部
			elementType : "labels.text.stroke",	//文本边框
			stylers : {
				color : "#313131"				//颜色
			}
		}, {
			featureType : "all",				//全部
			elementType : "labels.text.fill",	//文本填充
			stylers : {
				color : "#8b8787"				//颜色
			}
		}, {
			featureType : "manmade",			//人造区域
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				color : "#1b1b1b"				//颜色
			}
		}, {
			featureType : "local",				//普通道路
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				lightness : -75,				//亮度  283131
				saturation : -91				//饱和度
			}
		}, {
			featureType : "subway",				//地铁
			elementType : "geometry",			//样式范围  geometry 所有几何，geometry.fill几何填充，geometry.stroke几何描边
			stylers : {
				lightness : -65					//亮度
			}
		}, {
			featureType : "railway",			//铁路
			elementType : "all",				//样式范围 all 所有几何样式和文本样式
			stylers : {
				lightness : -40					//亮度
			}
		}, {
			featureType : "poi",				//兴趣点
			elementType : "all",				//样式范围 all 所有几何样式和文本样式
			stylers : {
				visibility : "off"				//是否显示
			}
		}, {
			featureType : "highway",			//高速及国道
			elementType : "labels.icon",		//文本图标
			stylers : {
				visibility : "off"				//是否显示
			}
		} ]
	}
	
	
});