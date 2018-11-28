// JavaScript Document
//公用方法，把以0开头的两位数变成一位数
//公用方法，把字符串变日期
function strtodate(str){
	return str.substring(8,10)+':'+str.substring(10,12)+':'+str.substring(12,14);
}


//创建类Bustool
function Bustool(map){
	this.map=map;
	//初始化透明层
	this.initTranslucent();
	//图层内线段
	this.segments=[];
	//图层内线段背景色
	this.segmentBacks=[];
	//图层内圆点图标
	this.circles=[];
	//图层内车辆小图标
	this.busIcon=[];
	//覆盖物水平方向范围
	this.overlay_lng=[];
	//覆盖物坚方向范围
	this.overlay_lat=[];
		
}

//坐标转换
Bustool.prototype.toBaiduPoint=function(points,fn){
	var convertor = new BMap.Convertor();
	var _this=this;
	var length=points.length;
	var newPoints=[];
	//为增加速度，一次性转50个
	var speed=50;
	//从第0个开始转
	var start=0;
	var limit=length>(start+speed)?start+speed:length;
	var getBaiduPoint=function(){
		limit=length>(start+speed)?start+speed:length;
		for(var i=start;i<limit;i++){
			(function(index){
				convertor.translate([points[index]], 1, 5,function(data){
				  if(data.status === 0) {
					  //console.log(data.points)
					newPoints[index]=data.points[0];
				  }
				});
			})(i);
		}		
	};
	getBaiduPoint();	
	points.timer=setInterval(function(){
		var num=0;
		for(var j=start;j<limit;j++){
			if(newPoints[j]){
				num++;
			}
		}
		//console.log(points.length+' == '+num)
		if(limit-start==num){
			//转完10个之后
			if(limit==length){
				//检测是否全部转完，如果全部转完就调用回调函数
				clearInterval(points.timer);
				fn&&fn.call(_this,newPoints);
			}else{
				//没有全部转完就继续
				start+=speed;
				getBaiduPoint();
			}
		}
	},30);
	
		
};

//JSON格式坐标转换
Bustool.prototype.jsonToBaiduPoint=function(json,fn){
	var convertor = new BMap.Convertor();
	var _this=this;
	var newJsonPoints=[];
	for(var name in json){
		(function(name){
			convertor.translate([json[name]], 1, 5,function(data){
			  if(data.status === 0) {
				  //console.log(data.points)
				newJsonPoints[name]=data.points[0];
			  }
			});
		})(name);
	}
	json.timer=setInterval(function(){
		var num=0;
		var sum=-1;//去掉这个timer
		for(var name in json){
			sum++;
			if(newJsonPoints[name]){
				num++;
			}
		}
		//console.log(points.length+' == '+num)
		if(sum==num){
			//检测是否全部转完，如果全部转完就调用回调函数
			clearInterval(json.timer);
			fn&&fn.call(_this,newJsonPoints);
		}
	},30);
	
		
};


//初始化透明层
Bustool.prototype.initTranslucent=function(){
	var lng_l=-150,
		lng_r=178,
		lat_t=74,
		lat_b=-58;
	var points=[new BMap.Point(lng_l,lat_t),point_rt=new BMap.Point(lng_r,lat_t),point_rb=new BMap.Point(lng_r,lat_b),point_lb=new BMap.Point(lng_l,lat_b)];
	this.translucent=new BMap.Polygon(points);
	this.map.addOverlay(this.translucent);
	this.translucent.disableMassClear();
	this.translucent.hide();
}
//添加透明层
Bustool.prototype.addTranslucent=function(){
	if(!this.map)return;
	this.translucent.show();
	return this;
};
//移除透明层
Bustool.prototype.removeTranslucent=function(){
	if(!this.map)return;
	this.translucent.hide();
	return this;
};

//批量添加线段
//arr格式[{blon:起始级度,blat:起始纬度 ,elon:终止经度,elat:终止纬度;},{}]
Bustool.prototype.addSegments=function(arr,list){
	if(!this.map)return;
	this.removeSegments();
	var _this=this;
	//把arr换成坐标点组
	var sumpoints=[];
	for(var i=0;i<arr.length;i++){
		var point1=new BMap.Point(arr[i].blon,arr[i].blat);
		var point2=new BMap.Point(arr[i].elon,arr[i].elat);
		sumpoints.push(point1,point2);
		//console.log(point1);
		//console.log(point2);
	}
	this.toBaiduPoint(sumpoints,function(backarr){
		for(var i=0;i<backarr.length;i+=2){
			var segmentBack=new BMap.Polyline([backarr[i],backarr[i+1]],{strokeColor:'#808c9e',strokeWeight:10,strokeOpacity:0.8});
			_this.map.addOverlay(segmentBack);
			_this.segmentBacks.push(segmentBack);
		};
		for(var i=0;i<backarr.length;i+=2){
			(function(i){
				var segment=new BMap.Polyline([backarr[i],backarr[i+1]],{strokeColor:'#5298ff',strokeWeight:8,strokeOpacity:0.8});
				_this.overlay_lng.push(backarr[i].lng,backarr[i+1].lng);
				_this.overlay_lat.push(backarr[i].lat,backarr[i+1].lat);
				_this.map.addOverlay(segment);
				_this.segments.push(segment);
				//添加事件
				var infolist=arr[i/2];
				var oldColor='';
				segment.addEventListener('mouseover',function(e){
					oldColor=this.getStrokeColor();
					this.setStrokeColor('#ffff00');
					var id=infolist.line;
					$('.info .info_bus .num').html(list[id]);
					$('.info .info_list p').html('班车特征向量总数:'+_this.segments.length);
					$('.info .info_list ul').html(
						'<li class="fl l">起点座标：<span>'+infolist.blon+','+infolist.blat+'</span></li>'
						+'<li class="fl r">终点座标：<span>'+infolist.elon+','+infolist.elat+'</span></li>'
						+'<li class="fl l">起驶时间：<span>'+strtodate(infolist.bt)+'</span></li>'
						+'<li class="fl r">停驶时间：<span>'+strtodate(infolist.et)+'</span></li>'
/*						+'<li class="fl w">持续时长：<span></span></li>'
						+'<li class="fl l">班次出发时间：<span></span></li>'
						+'<li class="fl r">班次到达时间：<span></span></li>'*/);
					$('.info').show();
				});
				segment.addEventListener('mouseout',function(event){
					this.setStrokeColor(oldColor);
					$('.info').hide();
				});
			})(i);
		}
		_this.addCircles(arr);
	});
	
};

//批量移出线段
Bustool.prototype.removeSegments=function(){
	for(var i=0;i<this.segments.length;i++){
		this.map.removeOverlay(this.segments[i]);
		this.map.removeOverlay(this.segmentBacks[i]);
	}
	this.segments=[];
	this.segmentBacks=[];
}

//批量添加起始点圆图标
//arr格式[{blon:起始级度,blat:起始纬度 ,elon:终止经度,elat:终止纬度;},{}]
Bustool.prototype.addCircles=function(arr){ 
	if(!this.map)return;
	this.removeCircles();
	var sumpoints=[];
	for(var i=0;i<arr.length;i++){
		var point1=new BMap.Point(arr[i].blon,arr[i].blat);
		var point2=new BMap.Point(arr[i].elon,arr[i].elat);
		sumpoints.push(point1,point2);
	}
	this.toBaiduPoint(sumpoints,function(backarr){
		for(var i=0;i<backarr.length;i++){
			var marker=new BMap.Marker(backarr[i],{icon:new BMap.Icon('../image/circle_icon.png',new BMap.Size(13,13))});
			this.circles.push(marker);
			this.map.addOverlay(marker);
		}
		this.setCenterByOverlay();
	})
};
//批量移出圆图标
Bustool.prototype.removeCircles=function(){
	for(var i=0;i<this.circles.length;i++){
		this.map.removeOverlay(this.circles[i]);
	}
	this.circles=[];
}

//根据覆盖物视区平移地图
Bustool.prototype.setCenterByOverlay=function(){
	if(this.overlay_lng.length!=0){
		var x=(Math.max.apply([],this.overlay_lng)+Math.min.apply([],this.overlay_lng))/2;
		var y=(Math.max.apply([],this.overlay_lat)+Math.min.apply([],this.overlay_lat))/2;
		this.map.panTo(new BMap.Point(x,y));
	}
};

//根据线路名称添加地图
Bustool.prototype.addBusLine=function(busname,fn){
	var _this=this;
	var road=busname.substring(0,busname.indexOf('('));
	var station=busname.substring(busname.indexOf('(')+1,busname.indexOf(')'));
	var busline = new BMap.BusLineSearch(this.map,{
		renderOptions:{map:this.map},
		onGetBusListComplete: function(result){
		   if(result&&result.moreResultsUrl) {
				var Line;//获取第一个公交列表显示到map上
				for(var i=0;i<100;i++){
					//console.log(result.getBusListItem(i))
					if(result.getBusListItem(i).name.indexOf(station)!=-1){
						Line=result.getBusListItem(i);
						break;
					}
				}
				busline.getBusLine(Line);
		   }
		},
		onMarkersSet:function(){
			fn&&fn();
		}
	});
	busline.getBusList(road);
};

//批量添加车辆图标
//arr格式[{cid:车辆id,lon:经度,lat:纬度,s:车辆状态},{}]
Bustool.prototype.addBusIcon=function(arr,fn){
	if(!this.map)return;
	var sumpoints=[];
	this.arr=[];
	var statusinfo={'0':'停靠站','1':'出站','2':'行驶','3':'进站','4':'故障','9':'未知'};
	for(var i=0;i<arr.length;i++){
		if(arr[i].s<4){
			var point=new BMap.Point(parseFloat(arr[i].lon),parseFloat(arr[i].lat));
			sumpoints.push(point);
			this.arr.push(arr[i]);
		}
	}
	//console.log(sumpoints)
	this.toBaiduPoint(sumpoints,function(backarr){
		this.removeBusIcon();
		for(var i=0;i<backarr.length;i++){
			if(this.arr[i].s==0){
				var marker=new BMap.Marker(backarr[i],{icon:new BMap.Icon('image/redbus.png',new BMap.Size(29,29))});
				var status=new ComplexCustomOverlay(backarr[i], statusinfo[this.arr[i].s],'#EA1415');
			}else{
				var marker=new BMap.Marker(backarr[i],{icon:new BMap.Icon('image/greenbus.png',new BMap.Size(29,29))});
				var status=new ComplexCustomOverlay(backarr[i],statusinfo[this.arr[i].s],'#11C34D');
			}
			this.busIcon.push(marker);
			this.busStatus.push(status);
			this.map.addOverlay(marker);
			this.map.addOverlay(status);
			status.hide();
		}
		fn&&fn();
	})
};

Bustool.prototype.removeBusIcon=function(arr){
	for(var i=0;i<this.busIcon.length;i++){
		this.map.removeOverlay(this.busIcon[i]);
		this.map.removeOverlay(this.busStatus[i]);
	}
	this.busIcon=[];
	this.busStatus=[];
};


//公交状态信息显示
Bustool.prototype.showBusStatus=function(){
	for(var i=0;i<this.busStatus.length;i++){
		this.busStatus[i].show();
	}
};

//公交状态信息隐藏
Bustool.prototype.hideBusStatus=function(){
	if(this.busStatus){
		for(var i=0;i<this.busStatus.length;i++){
			this.busStatus[i].hide();
		}
	}
};

//设置公交车辆图标
Bustool.prototype.setBusIcon=function(pic){
	var _this=this;
	if(!this.arr)return;
	//clearInterval(this.busIconTimer);
	//this.busIconTimer=setInterval(function(){
		/*if(curPic=='image/redbus.png'){
			curPic='image/whiteBusIcon.png'
		}else{
			curPic='image/redbus.png'
		}*/
		for(var i=0;i<_this.arr.length;i++){
			if(_this.arr[i].s=='0'){
				_this.busIcon[i].setIcon(new BMap.Icon(pic,new BMap.Size(29,29)));
			}
		}
	//},300);
};

//根据线路名称添加地图
Bustool.prototype.addBusLine=function(busname,fn){
	var _this=this;
	var road=busname.substring(0,busname.indexOf('('));
	var station=busname.substring(busname.indexOf('(')+1,busname.indexOf(')'));
	var busline = new BMap.BusLineSearch(this.map,{
		renderOptions:{map:this.map},
		onGetBusListComplete: function(result){
		   if(result&&result.moreResultsUrl) {
				var Line;//获取第一个公交列表显示到map上
				for(var i=0;i<100;i++){
					if(!result.getBusListItem(i)){
						console.log('没有在百度地图上找到此线路');
						break;
					}
					if(result.getBusListItem(i).name.indexOf(station)!=-1){
						Line=result.getBusListItem(i);
						break;
					}
				}
				busline.getBusLine(Line);
		   }
		},
		onMarkersSet:function(){
			fn&&fn();
		}
	});
	busline.getBusList(road);
};








