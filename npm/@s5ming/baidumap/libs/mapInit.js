/**
 * 地图初始化方法
 */
import {extend} from '@s5ming/json'
import mapSetStyle from './mapSetStyle'
;var mapInit = function(opts){
		
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
        removeNav:移除地图层级空间
    }*/
    
    var opts = extend(opts,{
        container:null,							//容器id
        center:{lng:116.404,lat:39.915},			//默认中心点位置
        zoom:12,									//默认地图等级
        currentcity:'北京',							//地图当前显示的城市
        enableScrollWheelZoom:true,					//是否让地图随滚轮缩放
        navLoc:{x:0,y:20},							//地图层级空间位置
        style:0,
        load:null                       //地图加载完成调用的方法
    });
    //检测参数是否合格
    if(!opts.container){
        console.error('请给mapInit方法一个container参数')
        return;
    }

    //干掉百度地图图标
    var delLogo = false;
    var delText = false;
    var timer = setInterval(function(){
        if((!delLogo)&&$('.anchorBL').length){
            $('.anchorBL').hide();
            delLogo = true;
        }
        if((!delText)&&$('.BMap_cpyCtrl.BMap_noprint.anchorBL').length){
            $('.BMap_cpyCtrl.BMap_noprint.anchorBL').hide();
            delText = true;
        }
        if(delLogo&&delText){
            clearInterval(timer);
        }
    },50);

    var map = new BMap.Map(opts.container);    // 创建Map实例
    map.centerAndZoom(new BMap.Point(opts.center.lng,opts.center.lat),opts.zoom);  // 初始化地图,设置中心点坐标和地图级别
    //map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
    map.setCurrentCity(opts.currentcity);          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(opts.enableScrollWheelZoom);//让地图随滚轮缩放
    mapSetStyle(map,opts.style);
    opts.minZoom && map.setMinZoom(opts.minZoom);
    opts.maxZoom && map.setMaxZoom(opts.maxZoom);
    var loaded=false;
    
    function maploaded(){
        if(loaded)return;
        loaded=true;
        if(!opts.removeNav){
            //添加地图级别控件
            var navigation=new BMap.NavigationControl(map);
            map.addControl(navigation);
            navigation.setOffset(new BMap.Size(opts.navLoc.x,opts.navLoc.y));
        }
        opts.load&&opts.load(map);
    }
    map.addEventListener("tilesloaded",maploaded);
    
    return map;
};
export default mapInit
