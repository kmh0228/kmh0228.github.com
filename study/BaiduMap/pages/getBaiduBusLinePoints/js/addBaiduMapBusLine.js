/**
 * create by zhaomingqiang 2018.4.13
 * 
 * 在地图上添加百度地图线路的方法
 */

;define([
	'./extend'
],function(
	extend,
){
	
	var addBaiduMapBusLine = function(opts){
		
		var opts = extend(opts,{
			map:'必填项',				//地图对象，必填项
			lineName:'1(a-b)',		//线路名称  1(某站-某站)
			complete:null,			//画完之后的回调函数
			usePoints:null			//画完之后获取点的回调函数
		});
		
		if(opts.map == '必填项'){
			alert('addBaiduMapBusLine方法参数中没有给定map对象');
			return;
		}
		
		var road=opts.lineName.substring(0,opts.lineName.indexOf('('));
		var station=opts.lineName.substring(opts.lineName.indexOf('(')+1,opts.lineName.indexOf(')'));
		var busline = new BMap.BusLineSearch(opts.map,{
			renderOptions:{map:opts.map},
			onGetBusListComplete: function(result){
			   if(result&&result.moreResultsUrl) {
					var Line=null;//获取第一个公交列表显示到map上
					for(var i=0;i<100;i++){
						if(!result.getBusListItem(i)){
							alert('没有在百度地图上找到此线路');
							opts.complete&&opts.complete();
							break;
						}
						if(result.getBusListItem(i).name.indexOf(station)!=-1){
							Line=result.getBusListItem(i);
							break;
						}
					}
					busline.getBusLine(Line||{});
			   }
			},
			onGetBusLineComplete:function(rs){
				opts.usePoints&&opts.usePoints(rs.getPath());
			},
			onMarkersSet:function(staions){
				opts.useStations&&opts.useStations(staions);
				opts.complete&&opts.complete(staions);
			}
		});
		busline.getBusList(road);	
		
		
		
	};
	
	return addBaiduMapBusLine;
	
});
