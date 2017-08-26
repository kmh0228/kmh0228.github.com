// JavaScript Document
//公用设置
if(!console){var console={'log':function(){}};}


//公用方法，把字符串变日期
function strtodate(str){
	return str.substring(8,10)+':'+str.substring(10,12)+':'+str.substring(12,14);
}
//把一位数变成两位数
function todou(n){return n>9?''+n:'0'+n;}

//求两像素点合成的线的角度,以s为中心点X轴正方向为0，取-PI-PI
//s:{x:'',y:''},e:{x:'',y:''}
function getDeg(s,e){
	return Math.atan2(e.y-s.y,e.x-s.x);
}

function setStyleKuHei(map){
	map.setMapStyle({
							styleJson : [ {
								featureType : "land",
								elementType : "geometry",
								stylers : {
									color : "#212121"
								}
							}, {
								featureType : "building",
								elementType : "geometry",
								stylers : {
									color : "#2b2b2b"
								}
							}, {
								featureType : "highway",
								elementType : "all",
								stylers : {
									lightness : -42,
									saturation : -91
								}
							}, {
								featureType : "arterial",
								elementType : "geometry",
								stylers : {
									lightness : -77,
									saturation : -94
								}
							}, {
								featureType : "green",
								elementType : "geometry",
								stylers : {
									color : "#1b1b1b"
								}
							}, {
								featureType : "water",
								elementType : "geometry",
								stylers : {
									color : "#181818"
								}
							}, {
								featureType : "subway",
								elementType : "geometry.stroke",
								stylers : {
									color : "#181818"
								}
							}, {
								featureType : "railway",
								elementType : "geometry",
								stylers : {
									lightness : -52,
									visibility : "off"
								}
							}, {
								featureType : "railway",
								elementType : "all",
								stylers : {
									visibility : "off"
								}
							}, {
								featureType : "subway",
								elementType : "all",
								stylers : {
									visibility : "off"
								}
							}, {
								featureType : "all",
								elementType : "labels.text.stroke",
								stylers : {
									color : "#313131"
								}
							}, {
								featureType : "all",
								elementType : "labels.text.fill",
								stylers : {
									color : "#8b8787"
								}
							}, {
								featureType : "manmade",
								elementType : "geometry",
								stylers : {
									color : "#1b1b1b"
								}
							}, {
								featureType : "local",
								elementType : "geometry",
								stylers : {
									lightness : -75,
									saturation : -91
								}
							}, {
								featureType : "subway",
								elementType : "geometry",
								stylers : {
									lightness : -65
								}
							}, {
								featureType : "railway",
								elementType : "all",
								stylers : {
									lightness : -40
								}
							}, {
								featureType : "poi",
								elementType : "all",
								stylers : {
									visibility : "off"
								}
							}, {
								featureType : "highway",
								elementType : "labels.icon",
								stylers : {
									visibility : "off"
								}
							} ]
						});
}

//input框更改触发事件  于jq之上，obj为jq对象
function inputChange(obj,fn){
	var oldval=obj.val();
	obj.on('focus',function(){
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			var newval=obj.val();
			if(newval=='')return;
			if(newval!=oldval){
				oldval=newval;
				fn&&fn(newval);
			}
		},30);
	});
	obj.on('blur',function(){
		clearInterval(obj.timer);
	});
}
//alert(getDeg({x:0,y:0},{x:-1,y:0}));

//找出数组中最大的数
function maxFormArr(arr){
	if(!arr.length)return;
	var maxNum=arr[0];
	for(var i=0;i<arr.length;i++){
		if(arr[i]>maxNum){
			maxNum=arr[i];
		}
	}
	return maxNum;
}

//创建类Bustool
function Bustool(map){
	this.map=map;
	//图层内线段
	this.segments=[];
	//图层内线段背景色
	this.segmentBacks=[];
	//图层内圆点图标
	this.circles=[];
	//图层内车辆小图标
	this.busIcon=[];
	//车牌信息
	this.cards=[];
	
	//覆盖物范围
	this.view=[];
	//for lineOD
	//断面hover事件
	this.dmhover=true;

	//上下行线线断和点
	this.direction1=[];
	this.direction2=[];
	this.directionCircle1=[];
	this.directionCircle2=[];
	//for lineOD 断面颜色
	this.lineODColors=['#A20000','#FF0000','#FF8900','#FFCC00','#FCED03'].reverse();
	
	//for lineNetwork  路线覆盖物
	this.lineroad=[];
	this.lineNetworkColors=['#4cae3d','#9cc624','#fead26','#fd7122','#fe3034'];
	
	this.limitsAndStandards=[
							{limit:[90,100,110,120],standard:[65,50,35,20]},
							{limit:[60,70,80],standard:[40,30,20,15]},
							{limit:[40,50],standard:[35,25,15,10]},
							{limit:[30,35],standard:[25,20,15,10]}
							];
	
	this.startAndEndIcon=[];	
	//行政区域覆盖物
	this.bdarys=[];					
}

//坐标转换
//原GIS坐标from为1, 其他高德，谷歌等from为3
Bustool.prototype.toBaiduPoint=function(points,fn,opts){
	if(!points.length){fn&&fn.call(this,[]);return;}
	var info=opts||{};
	var pici=Number(info.pici||10);
	var num=Number(info.num||10);
	var from=Number(info.from||1);
	var convertor = new BMap.Convertor();
	var _this=this;
	var length=points.length;
	var newPoints=[];
	var speed=pici*num;
	var start=0;
	var limit=length>(start+speed)?start+speed:length;
	var getBaiduPoint=function(){
		limit=length>(start+speed)?start+speed:length;
		var changsum=limit-start;
		var changepici=Math.ceil(changsum/num);
		for(var j=0;j<changepici;j++){
			(function(index){
				convertor.translate(points.slice(start+(index*num),start+(index*num)+num<limit?start+(index*num)+num:limit), from, 5,function(data){
				  if(data.status === 0) {
					  for(var i=0;i<data.points.length;i++){
						  newPoints[start+(index*num)+i]=data.points[i];
					}
				  }else{
					alert('坐标转换失败,错误'+data.status+' : '+data.message);
					return; 
					}
				});
				
			})(j);
		}
	};
	clearInterval(_this.tobaiduPointTimer);
	getBaiduPoint();
	_this.tobaiduPointTimer=setInterval(function(){
		var num=0;
		for(var j=start;j<limit;j++){
			if(newPoints[j]){
				num++;
			}
		}
		if(limit-start==num){
			if(limit==length){
				clearInterval(_this.tobaiduPointTimer);
				fn&&fn.call(_this,newPoints);
			}else{
				start+=speed;
				getBaiduPoint();
			}
		}
	},30);
};
//旧版本坐标转换
/*Bustool.prototype.toBaiduPoint=function(points,fn){
	if(!points.length)return;
	var convertor = new BMap.Convertor();
	var _this=this;
	var length=points.length;
	var newPoints=[];
	//为增加速度，一次性转50个
	var speed=10;
	//从第0个开始转
	var start=0;
	var limit=length>(start+speed)?start+speed:length;
	var getBaiduPoint=function(){
		limit=length>(start+speed)?start+speed:length;
		

				console.log(points.slice(start,limit));
				convertor.translate(points.slice(start,limit), 1, 5,function(data){
				  if(data.status === 0) {
					  for(var i=0;i<data.points.length;i++){
						  newPoints.push(data.points[i]);
					}
				  }else{
					alert('坐标转换失败,错误'+data.status+' : '+data.message)  
					}
				});
		
--		for(var i=start;i<limit;i++){
			(function(index){
				convertor.translate([points[index]], 1, 5,function(data){
				  if(data.status === 0) {
					newPoints[index]=data.points[0];
				  }else{
					alert('坐标转换失败,错误'+data.status+' : '+data.message)  
					}
				});
			})(i);
		}	
++		
			
	};
	getBaiduPoint();	
	points.timer=setInterval(function(){
		var num=0;
		for(var j=start;j<limit;j++){
			if(newPoints[j]){
				num++;
			}
		}
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
*/
//多个数组坐标批量转换 [[],[],[],[]]
Bustool.prototype.toBaiduPointArr=function(arr,fn,opts){
	var start=0;
	var nums=[];
	var points=[];
	for(var i=0;i<arr.length;i++){
		start+=arr[i].length;
		nums.push(start);
		points=points.concat(arr[i]);
	}
	if(points.length==0){
		return arr;
	}
	this.toBaiduPoint(points,function(newpoints){
		var newarr=[];
		for(var i=0;i<nums.length;i++){
			if(i==0){
				newarr.push(newpoints.slice(0,nums[i]));
			}else{
				newarr.push(newpoints.slice(nums[i-1],nums[i]));
			}
		}
		fn&&fn(newarr);
	},opts);
};

//JSON格式坐标转换
Bustool.prototype.jsonToBaiduPoint=function(json,fn){
	var names=[],points=[];
	for(var name in json){
		names.push(name);
		points.push(json[name]);
	}
	this.toBaiduPoint(points,function(points2){
		var newjson={};
		for(var i=0;i<points2.length;i++){
			newjson[names[i]]=points2[i];
		}
		fn(newjson);
	});
};

//坐标平移  参数(原坐标点POINT， X轴平衡像素， Y轴平移像素)
Bustool.prototype.pointTranslate=function(point,x,y){
	var pixel = this.map.pointToPixel(point);
	var x=pixel.x+x;
	var y=pixel.y+y;
	return this.map.pixelToPoint(new BMap.Pixel(x,y));
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
};
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

Bustool.prototype.addStartAndEndIcon=function(pointStart,pointEnd,dy){
	var dy1=dy||4;
	var marker1=new BMap.Marker(pointStart,{icon:new BMap.Icon('../image/Start.png',new BMap.Size(34,34),{anchor:new BMap.Size(17,34+dy1)})});
	this.map.addOverlay(marker1);
	this.startAndEndIcon.push(marker1);
	var marker2=new BMap.Marker(pointEnd,{icon:new BMap.Icon('../image/End.png',new BMap.Size(34,34),{anchor:new BMap.Size(17,34+dy1)})});
	this.map.addOverlay(marker2);
	this.startAndEndIcon.push(marker2);
};

Bustool.prototype.removeStartAndEndIcon=function(){
	for(var i=0;i<this.startAndEndIcon.length;i++){
		this.map.removeOverlay(this.startAndEndIcon[i]);
	}
	this.startAndEndIcon=[];
};


//批量添加线段
//arr格式[{blon:起始级度,blat:起始纬度 ,elon:终止经度,elat:终止纬度;},{}]
Bustool.prototype.addSegments=function(arr,list,fn){
	if(!this.map)return;
	var overNum=0;
	this.removeSegments();
	this.removeCircles();
	this.removeStartAndEndIcon();
	var _this=this;
	var short=8;
	//把arr换成坐标点组
	var sumpoints=[];
	for(var i=0;i<arr.length;i++){
		var point1=new BMap.Point(arr[i].blon,arr[i].blat);
		var point2=new BMap.Point(arr[i].elon,arr[i].elat);
		sumpoints.push(point1,point2);
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
				_this.map.addOverlay(segment);
				_this.segments.push(segment);
				//添加事件
				var infolist=arr[i/2];
				var oldColor='';
				segment.addEventListener('mouseover',function(e){
					overNum++;
					oldColor=this.getStrokeColor();
					this.setStrokeColor('#ffff00');
					var id=infolist.line;
					$('.info .info_bus .num').html(list[id]);
					$('.info .info_list p').html('运行特征向量总数:'+_this.segments.length);
					$('.info .info_list ul').html(
						'<li class="fl l">起驶座标：<span>'+(infolist.blon.toFixed(7)/1)+','+(infolist.blat.toFixed(7)/1)+'</span></li>'
						+'<li class="fl r">停驶座标：<span>'+(infolist.elon.toFixed(7)/1)+','+(infolist.elat.toFixed(7)/1)+'</span></li>'
						+'<li class="fl l">起驶时间：<span>'+strtodate(infolist.bt)+'</span></li>'
						+'<li class="fl r">停驶时间：<span>'+strtodate(infolist.et)+'</span></li>'
/*						+'<li class="fl w">持续时长：<span></span></li>'
						+'<li class="fl l">班次出发时间：<span></span></li>'
						+'<li class="fl r">班次到达时间：<span></span></li>'*/);
					$('.info').show();
				});
				segment.addEventListener('mouseout',function(event){
					overNum--;
					this.setStrokeColor(oldColor);
					if(overNum==0)$('.info').hide();
				});
			})(i);
		}
		_this.addCircles(arr,fn);
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
};

//批量添加起始点圆图标
//arr格式[{blon:起始级度,blat:起始纬度 ,elon:终止经度,elat:终止纬度;},{}]
Bustool.prototype.addCircles=function(arr,fn){ 
	if(!this.map)return;
	var sumpoints=[];
	for(var i=0;i<arr.length;i++){
		var point1=new BMap.Point(arr[i].blon,arr[i].blat);
		var point2=new BMap.Point(arr[i].elon,arr[i].elat);
		sumpoints.push(point1,point2);
	}
	this.toBaiduPoint(sumpoints,function(backarr){
		this.relaySetCenter();
		this.view=backarr.slice(0);
		for(var i=0;i<backarr.length;i++){
			var marker=new BMap.Marker(backarr[i],{icon:new BMap.Icon('../image/circle_icon.png',new BMap.Size(13,13))});
			this.circles.push(marker);
			this.map.addOverlay(marker);
		}
		this.addStartAndEndIcon(backarr[0],backarr[backarr.length-1]);
		this.setCenterByOverlay();
		fn&&fn();
	})
};
//批量移出圆图标
Bustool.prototype.removeCircles=function(){
	for(var i=0;i<this.circles.length;i++){
		this.map.removeOverlay(this.circles[i]);
	}
	this.circles=[];
};


Bustool.prototype.relaySetCenter=function(){
	this.view=[];
};
//根据覆盖物视区平移地图
Bustool.prototype.setCenterByOverlay=function(arr){
	if(arr){
		this.view=this.view.concat(arr);
	}
	if(this.view.length!=0){
		var cz=this.map.getViewport(this.view);
		this.map.setZoom(cz.zoom-1);
		this.map.panTo(cz.center);
	}
};

//根据线路名称添加地图
Bustool.prototype.addBusLine=function(busname,fn){
	console.log(busname);
	var _this=this;
	var road=busname.substring(0,busname.indexOf('('));
	var station=busname.substring(busname.indexOf('(')+1,busname.indexOf(')'));
	var busline = new BMap.BusLineSearch(this.map,{
		renderOptions:{map:this.map},
		onGetBusListComplete: function(result){
		   if(result&&result.moreResultsUrl) {
				var Line=null;//获取第一个公交列表显示到map上
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
				busline.getBusLine(Line||{});
		   }
		},
		onMarkersSet:function(){
			fn&&fn();
		}
	});
	busline.getBusList(road);
};

//批量添加车辆图标
//arr格式[{cid:车辆id,lon:经度,lat:纬度,s:车辆状态,card:车牌号},{}]
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
				var marker=new BMap.Marker(backarr[i],{icon:new BMap.Icon('image/redbus.png',new BMap.Size(20,20))});
				var status=new ComplexCustomOverlay(backarr[i], statusinfo[this.arr[i].s],'#EA1415');
			}else{
				var marker=new BMap.Marker(backarr[i],{icon:new BMap.Icon('image/greenbus.png',new BMap.Size(20,20))});
				var status=new ComplexCustomOverlay(backarr[i],statusinfo[this.arr[i].s],'#11C34D');
			}
			var card=new ComplexCustomOverlay2(backarr[i], this.arr[i].cid+'</br>'+this.arr[i].card+'</br>');
			
			this.busIcon.push(marker);
			this.busStatus.push(status);
			this.cards.push(card);
			
			this.map.addOverlay(marker);
			this.map.addOverlay(status);
			this.map.addOverlay(card);
			
			status.hide();
			card.hide();
		}
		fn&&fn();
	})
};

Bustool.prototype.removeBusIcon=function(arr){
	for(var i=0;i<this.busIcon.length;i++){
		this.map.removeOverlay(this.busIcon[i]);
		this.map.removeOverlay(this.busStatus[i]);
		this.map.removeOverlay(this.cards[i]);
	}
	this.busIcon=[];
	this.busStatus=[];
	this.cards=[];
};


//公交状态信息显示
Bustool.prototype.showBusStatus=function(){
	if(!this.busStatus)return;
	for(var i=0;i<this.busStatus.length;i++){
		this.busStatus[i].show();
		this.cards[i].show();
	}
};

//公交状态信息隐藏
Bustool.prototype.hideBusStatus=function(){
	if(this.busStatus){
		for(var i=0;i<this.busStatus.length;i++){
			this.busStatus[i].hide();
			this.cards[i].hide();
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
				_this.busIcon[i].setIcon(new BMap.Icon(pic,new BMap.Size(20,20)));
			}
		}
	//},300);
};
//批量添加线段 for lineOD
//arr格式[{direction:'',station:[{xh:站点序号，name:站点名，lon:经度，lat:纬度，up:登量，down：隆量，dm:断面},{}...]},{},{}...]
Bustool.prototype.setlines=function(arr,n,hover,fn){
	if(hover==true){
		this.dmhover=true;
	}else if(hover==false){
		this.dmhover=false;
	}
	if(!this.lineODArr&&!arr)return;
	if(arr){
		this.lineODArr=arr.slice(0);
	}
	this.lineODArrLength=this.lineODArr.length;
	if(this.lineODArrLength<1)return;
	if(this.lineODArrLength>1){this.doubleLine=true;}else{this.doubleLine=false;}
	if(n||n==0)this.ntranslate=n;
	if(!this.map)return;
	this.removelines();
	this.removeStartAndEndIcon();
	var _this=this;
	//线段减少多少像素
	var short=8;
	//把arr换成坐标点组
	var oldPoints1=[];
	if(this.doubleLine)var oldPoints2=[];
	//求最大断面量
	var dms=[];
	for(var i=0;i<this.lineODArrLength;i++){
		var station=this.lineODArr[i].station;
		var arr=[];
		for(var j=0;j<station.length;j++){
			arr.push(station[j].dm);
		}
		dms.push(arr);
	}
	var maxDm1=Math.max.apply('',dms[0]);
	var maxDm=maxDm1;
	if(this.doubleLine){
		var maxDm2=Math.max.apply('',dms[1]);
		maxDm=Math.max(maxDm1,maxDm2);
	}
	var maxDmlength=(''+maxDm).length;
	var base=Math.pow(10,maxDmlength-1)/5;
	if(base<2){base=2}
	//设置各级别颜色对应的值
	
	var av=Math.ceil(((maxDm+1)/5/base))*base;
	$('.color .colors li').each(function(i,e){
		var start=av*i;
		var end=av*(i+1)-1;
		e.innerHTML=start+' - '+end;
	});
	
	
	var overlength=0;
	//开始收集点，以备画图后设置层级和位置	
	this.relaySetCenter();
	
	for(var i=0;i<this.lineODArr[0].station.length;i++){
		var point=new BMap.Point(this.lineODArr[0].station[i].lon,this.lineODArr[0].station[i].lat);
		oldPoints1.push(point);
	}
	if(this.doubleLine){
		for(var i=0;i<this.lineODArr[1].station.length;i++){
			var point=new BMap.Point(this.lineODArr[1].station[i].lon,this.lineODArr[1].station[i].lat);
			oldPoints2.push(point);
		}
	}
	//转换坐标
	this.toBaiduPoint(oldPoints1,function(points1){
		var points1Arr=[];
		for(var i=0;i<points1.length;i++){
			var json={};
			json.lat=points1[i].lat;
			json.lon=points1[i].lng;
			points1Arr.push(json);
		}
		var sumpoints1=this.lineTranslate(points1Arr,this.ntranslate);
		this.view=sumpoints1.slice(0);
		//添加信息框info
		this.windowinfo=new Message(sumpoints1[0]);
		this.map.addOverlay(this.windowinfo);
		this.windowinfo.hide();
			//添加上行路段
			for(var i=0;i<sumpoints1.length-1;i++){
				(function(i){
					var dm=_this.lineODArr[0].station[i].dm;
					var colorNum=parseInt(dm/av);
					if(colorNum>4)colorNum=4;
					var color=_this.lineODColors[colorNum];
					var segmentBack=new BMap.Polyline(_this.dellong(sumpoints1[i],sumpoints1[i+1],short),{strokeColor:color,strokeWeight:6,strokeOpacity:0.8});
					_this.map.addOverlay(segmentBack);
					_this.direction1.push(segmentBack);
					_this.dmhover&&segmentBack.addEventListener('mouseover',function(e){
						overlength++;
						if(dm==maxDm1){
							_this.windowinfo.setInnerHTML('最大断面<br/>'+_this.lineODArr[0].station[i].name+'->'+_this.lineODArr[0].station[i+1].name+' 断面: '+dm);
						}else{
							_this.windowinfo.setInnerHTML(_this.lineODArr[0].station[i].name+'->'+_this.lineODArr[0].station[i+1].name+' 断面: '+dm);
						}
						_this.windowinfo.setPoint(e.point);
						_this.windowinfo.show();
						this.mousemove=function(e){
							if(overlength==1){
								_this.windowinfo.setPoint(e.point);
							}
						}
						this.addEventListener('mousemove',this.mousemove);
					});
					_this.dmhover&&segmentBack.addEventListener('mouseout',function(){
						this.removeEventListener('mousemove',this.mousemove);
						overlength--;if(overlength<0)overlength=0;
						if(!overlength)_this.windowinfo.hide();
					});
				})(i);
			};
			//添加上行站点
			for(var i=0;i<sumpoints1.length;i++){
				var marker=new BMap.Marker(sumpoints1[i],{icon:new BMap.Icon('image/lineODIconbig.png',new BMap.Size(13,13))});
				this.directionCircle1.push(marker);
				this.map.addOverlay(marker);
				
				//_this.overlay_lng.push(sumpoints1[i].lng);
				//_this.overlay_lat.push(sumpoints1[i].lat);
				(function(i){
					marker.addEventListener('mouseover',function(e){
						overlength++;
						_this.windowinfo.setInnerHTML(_this.lineODArr[0].station[i].name+'<hr/>登量 ： '+_this.lineODArr[0].station[i].up+'<br/>降量 ： '+_this.lineODArr[0].station[i].down);
						_this.windowinfo.setPoint(sumpoints1[i]);
						_this.windowinfo.show();
						
						e.domEvent.stopPropagation();
					});
					marker.addEventListener('mouseout',function(){
						overlength--;if(overlength<0)overlength=0;
						if(!overlength)_this.windowinfo.hide();
					});
				})(i);
			};
			//添加起始点
			this.addStartAndEndIcon(sumpoints1[0],sumpoints1[sumpoints1.length-1]);
		if(this.doubleLine)this.toBaiduPoint(oldPoints2,function(points2){
			
			var points2Arr=[];
			for(var i=0;i<points2.length;i++){
				var json={};
				json.lat=points2[i].lat;
				json.lon=points2[i].lng;
				points2Arr.push(json);
			}
			
			var sumpoints2=this.lineTranslate(points2Arr,this.ntranslate);
			this.view=sumpoints1.concat(sumpoints2);
			//添加下行路段
			for(var i=0;i<sumpoints2.length-1;i++){
				(function(i){
					var dm=_this.lineODArr[1].station[i].dm;
					var colorNum=parseInt(dm/av);
					if(colorNum>4)colorNum=4;
					var color=_this.lineODColors[colorNum];
					var segmentBack=new BMap.Polyline(_this.dellong(sumpoints2[i],sumpoints2[i+1],short),{strokeColor:color,strokeWeight:6,strokeOpacity:0.8});
					_this.map.addOverlay(segmentBack);
					_this.direction2.push(segmentBack);
					_this.dmhover&&segmentBack.addEventListener('mouseover',function(e){
						overlength++;
						
						if(dm==maxDm2){
							_this.windowinfo.setInnerHTML('最大断面<br/>'+_this.lineODArr[1].station[i].name+'->'+_this.lineODArr[1].station[i+1].name+' 断面: '+dm);
						}else{
							_this.windowinfo.setInnerHTML(_this.lineODArr[1].station[i].name+'->'+_this.lineODArr[1].station[i+1].name+' 断面: '+dm);
						}
						
						_this.windowinfo.setPoint(e.point);
						_this.windowinfo.show();
						this.mousemove=function(e){
							if(overlength==1){
								_this.windowinfo.setPoint(e.point);
							}
						}
						this.addEventListener('mousemove',this.mousemove);
					});
					_this.dmhover&&segmentBack.addEventListener('mouseout',function(){
						this.removeEventListener('mousemove',this.mousemove);
						overlength--;if(overlength<0)overlength=0;
						if(!overlength)_this.windowinfo.hide();
					});
				})(i);
			};
			//添加下行站点
			for(var i=0;i<sumpoints2.length;i++){
				var marker=new BMap.Marker(sumpoints2[i],{icon:new BMap.Icon('image/lineODIconbig.png',new BMap.Size(13,13))});
				this.directionCircle2.push(marker);
				this.map.addOverlay(marker);
				
				//_this.overlay_lng.push(sumpoints2[i].lng);
				//_this.overlay_lat.push(sumpoints2[i].lat);
				(function(i){
					marker.addEventListener('mouseover',function(e){
						overlength++;
						_this.windowinfo.setInnerHTML(_this.lineODArr[1].station[i].name+'<hr/>登量 ： '+_this.lineODArr[1].station[i].up+'人<br/>降量 ： '+_this.lineODArr[1].station[i].down+'人');
						_this.windowinfo.setPoint(sumpoints2[i]);
						_this.windowinfo.show();

						e.domEvent.stopPropagation();

					});
					marker.addEventListener('mouseout',function(){
						overlength--;if(overlength<0)overlength=0;
						if(!overlength)_this.windowinfo.hide();
					});
				})(i);
			};
			//添加起始点
			this.addStartAndEndIcon(sumpoints2[0],sumpoints2[sumpoints2.length-1]);
			fn&&fn();
		});
		
	});
};

//刷新线段 for lineO
Bustool.prototype.setLinesTranslate=function(n){
	if(!this.lineODArr)return;
	if(!n)n=0;
	this.ntranslate=n;
	this.setlines();
};

//批量移出线段 for lineOD
Bustool.prototype.removelines=function(){
	for(var i=0;i<this.direction1.length;i++){
		this.map.removeOverlay(this.direction1[i]);
	}
	for(var i=0;i<this.direction2.length;i++){
		this.map.removeOverlay(this.direction2[i]);
	}
	for(var i=0;i<this.directionCircle1.length;i++){
		this.map.removeOverlay(this.directionCircle1[i]);
	}
	for(var i=0;i<this.directionCircle2.length;i++){
		this.map.removeOverlay(this.directionCircle2[i]);
	}
	this.direction1=[];
	this.direction2=[];
	this.directionCircle1=[];
	this.direction2Circle2=[];
	this.windowinfo&&this.map.removeOverlay(this.windowinfo);
};

//把数组点向右平移动的方法
//参数 line:[{lat:'',lon:''},{lat:'',lon:''},{}……]  n：向右平移量px
Bustool.prototype.lineTranslate=function(line,n){
	
	//经纬度坐标转换成像素坐标
	var pixels=[];
	var points=[];
	for(var i=0;i<line.length;i++){
		var point=new BMap.Point(line[i].lon,line[i].lat);
		points.push(point);
		var pixel=this.map.pointToPixel(point);
		pixels.push(pixel);
	}
	if(line.length<2||n==0){
		return points;
	}
	
	var degs=[];
	//添加第一个点的平移角度
	var deg=getDeg(pixels[0],pixels[1]);
	var newdeg=deg+(Math.PI/2)>0?deg-(Math.PI/2):deg+(Math.PI/2*3);
	degs.push(newdeg);
	//添加中间的点的平移动角度
	var length=pixels.length;
	for(var i=1;i<length-1;i++){
		var deg1=getDeg(pixels[i],pixels[i-1]);
		var deg2=getDeg(pixels[i],pixels[i+1]);
		var newdeg;
		if(deg1>deg2){
			newdeg=(deg2+deg1)/2>0?(deg2+deg1)/2-Math.PI:(deg2+deg1)/2+Math.PI;		
		}else if(deg1<=deg2){
			newdeg=(deg2+deg1)/2;
		}
		degs.push(newdeg);
	}
	//添加最后一个点的平移角度
	var deg=getDeg(pixels[length-2],pixels[length-1]);
	var newdeg=deg+(Math.PI/2)>0?deg-(Math.PI/2):deg+(Math.PI/2*3);
	degs.push(newdeg);
	//角度添加完成，开始平移点
	var newpoints=[];
	for(var i=0;i<length;i++){
		var x=pixels[i].x;
		var y=pixels[i].y;
		var newx=x-n*Math.cos(degs[i]);
		var newy=y-n*Math.sin(degs[i]);
		var pixel=new BMap.Pixel(newx,newy);
		newpoints.push(this.map.pixelToPoint(pixel));
	}
	return newpoints;
};

//将两点向中间靠拢n像素
Bustool.prototype.dellong=function(point1,point2,n){
	var pixel1=this.map.pointToPixel(point1);
	var pixel2=this.map.pointToPixel(point2);
	var deg=getDeg(pixel1,pixel2);
	var x1=pixel1.x,y1=pixel1.y;
	var x2=pixel2.x,y2=pixel2.y;
	var dx=x2-x1,dy=y2-y1;
	var tx=n*Math.cos(deg); //if(tx*2>dx){tx=dx/2;}
	var ty=n*Math.sin(deg); //if(ty*2>dy){ty=dy/2;}
	var newx1=x1+tx,newy1=y1+ty;
	var newx2=x2-tx,newy2=y2-ty;
	var newpoint1=this.map.pixelToPoint(new BMap.Pixel(newx1,newy1))
	var newpoint2=this.map.pixelToPoint(new BMap.Pixel(newx2,newy2))
	return [newpoint1,newpoint2];
};

//for lieNetwork 根据道路限速和当前速度计算出拥挤度
function findInArr(arr,n){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==n){return true;}
	}
	return false;
};

Bustool.prototype.getLineJam=function(limit,speed){
	var length=this.limitsAndStandards.length;
	for(var i=0;i<length;i++){
		var limits=this.limitsAndStandards[i].limit;
		if(findInArr(limits,limit)){
			var standards=this.limitsAndStandards[i].standard;
			var leval=1;
			for(var j=0;j<standards.length;j++){
				if(speed<=standards[j]){
					leval=j+2;
				}
			}
			return leval;
		}
	}
	return false;					
};

//for lieNetwork 画线路
//newpointarea  {1:[{lv:'',speed:'',limit:'',point:[{lon,lat},{}]},{}...],2:[]..}
//arrSelect   [1,2..],1-5
Bustool.prototype.drawLineNet=function(newpointarea,roadwidth,translate){
	var _this=this;
	
		_this.removeLineNet();
		//添加一个信息窗
		_this.windowinfo=new Message();
		_this.map.addOverlay(_this.windowinfo);
		_this.windowinfo.hide();
		
		var overlength=0;
		
		_this.relaySetCenter();
		
		var linenum=0;
		var pointnum=0;
		for(var i in newpointarea){
			(function(iN){
				var datas=newpointarea[iN];
				var datasLength=datas.length;
				for(var j=0;j<datasLength;j++){
					(function(jN){
						var color=_this.lineNetworkColors[_this.getLineJam(datas[jN].limit,datas[jN].speed)-1];
						if(color){
							linenum++;
							pointnum+=datas[jN].point.length;
							
							_this.view=_this.view.concat(datas[jN].point);
							for(var k=0;k<datas[jN].point.length;k++){
								datas[jN].point[k].lng=datas[jN].point[k].lon;
							}
							var line=new BMap.Polyline(_this.lineTranslate(datas[jN].point,translate),{strokeColor:color,strokeWeight:roadwidth,strokeOpacity:1});
							_this.map.addOverlay(line);
							_this.lineroad.push(line);
							
							
							line.addEventListener('mouseover',function(e){
								overlength++;
								_this.windowinfo.setInnerHTML('路段平均速度为 '+datas[jN].speed+' km/h');
								_this.windowinfo.setPoint(e.point);
								_this.windowinfo.show();
								this.mousemove=function(e){
									//if(overlength==1){
										_this.windowinfo.setPoint(e.point);
									//}
								}
								this.addEventListener('mousemove',this.mousemove);
							});
							line.addEventListener('mouseout',function(){
								this.removeEventListener('mousemove',this.mousemove);
								overlength--;if(overlength<0)overlength=0;
								if(!overlength)_this.windowinfo.hide();
							});
						}
					})(j);
				}
			})(i);
		}
		
				//addOverylays
		//this.map.addOverlays(this.lineroad[i]);
	
};

Bustool.prototype.removeLineNet=function(){
	for(var i=0;i<this.lineroad.length;i++){
		this.map.removeOverlay(this.lineroad[i]);
	}
	this.map.removeOverlay(this.windowinfo);
	this.lineroad=[];
};


Bustool.prototype.removeMigration=function(BMapExt){
	this.BMapExt=BMapExt||this.BMapExt;
	if(this.BMapExt){
		var option={"tooltip":{"trigger":"item"},"dataRange":{"min":0,"max":0,"y":"400","calculable":true,"color":["#A20000","#FF0000","#FF8900","#FFCC00","#FCED03"],"show":true},"series":[]};
		var myChart = this.BMapExt.initECharts(this.BMapExt.getEchartsContainer());
		window.onresize = myChart.onresize;
		this.BMapExt.setOption(option);
	}
};

//画迁徙图
//参数 pts：{名字:坐标，……},odlist:[{oid:起始名字，did:终点名字，count:值}……]，nameForId:id转换成名字,option:{mx:最大值}

Bustool.prototype.drawMigration=function(BMapExt,pts,odlist,nameForId,option){
	if(!pts&&!odlist)return;
	var opt=option||{};
	this.BMapExt=BMapExt;
	//确定最大值
	var mx=0;
	var odlistlength=odlist.length;
	if(opt.mx){
		mx=opt.mx;
	}else{
		for(var i=0;i<odlistlength;i++){
			if(mx<odlist[i].count){mx=odlist[i].count}
		}
	}
	
	odlist.sort(function(a,b){return a.count-b.count;});
	
	//配置各线参数
	var series=[];
	//根据起点分类数据
	var curpointss={};
	var nameforcount={};
	for(var i=0;i<odlist.length;i++){
		var json={};
		json.did=odlist[i].did;
		json.count=odlist[i].count;
		if(!curpointss[odlist[i].oid]){
			curpointss[odlist[i].oid]=[];
		}
		curpointss[odlist[i].oid].push(json);		
		
		if(!nameforcount[Number(odlist[i].oid)])nameforcount[Number(odlist[i].oid)]={};
		nameforcount[Number(odlist[i].oid)][Number(odlist[i].did)]=odlist[i].count;
		
	}
	//循环往seris里加数据**************************
	console.log('nameForId');
	console.log(nameForId);
	
	for(var name in curpointss){
		var marklinedata=[];
		for(var i=0;i<curpointss[name].length;i++){
			var onedata=[{name:name},{name:curpointss[name][i].did,value:curpointss[name][i].count}];
			marklinedata.push(onedata);
		}
		var markline={
			tooltip : {
				trigger: 'item',
				formatter: function (v) {
					var arrs=v[1].replace(/\s/g,'');
					console.log(arrs);
					var arr=arrs.split(/[:>]/);
					console.log('arr0 '+arr[0]);
					console.log('arr1 '+arr[1]);
						 return nameForId[''+arr[0]]+' > '+nameForId[''+arr[1]]+'</br>迁徙量:'+nameforcount[Number(arr[0])][Number(arr[1])];
				}
			},
			//large:true,
			smooth:true,
			effect : {
				show: false,
				scaleSize: 1,
				period: 30,
				color: '#fff',
				shadowBlur: 10
			},
			itemStyle : {
				normal: {
					borderWidth:2,
					lineStyle: {
						type: 'solid',
						shadowBlur: 10
					},
					label:{show:false}
				}
			},
			data : marklinedata
		};
		
		var markPointdata=[];
		for(var i=0;i<curpointss[name].length;i++){
			var onedata={name:curpointss[name][i].did,value:curpointss[name][i].count};
			markPointdata.push(onedata);
		}
		var markPoint={
			symbol:'emptyCircle',
			//改变光圈大小
			symbolSize : function (v){
				return 0;//5 + v/10
			},
			effect : {
				show: false,
				shadowBlur : 0
			},
			itemStyle:{
				normal:{
					label:{show:false}
				},
				emphasis:{
					label:{show:true}
				}
			},
			data : markPointdata
		}
		
		var onelist={
			name:name,
			type:'map',
			mapType:'none',
			data:[],
			markLine:markline,
			markPoint:markPoint
		};
		series.push(onelist);
	}
	//把各点加入到参数中
	if(series.length)series[0].geoCoord=pts;
	
	//$('#container_map').html(JSON.stringify(series));
	var option = {
		//color: ['gold','aqua','lime'],
		tooltip : {
			trigger: 'item',
			formatter: function (v) {
				//var arr=v[1].split(' > ');
				return v[1].replace(':', ' > ');
			}
		},
		dataRange: {
			min : 0,
			max : mx,
			y: '400',
			calculable : true,
			color: ['#A20000', '#FF0000', '#FF8900', '#FFCC00','#FCED03'],
			show:true
		},
		
		series : series  
	};
	var myChart = BMapExt.initECharts(BMapExt.getEchartsContainer());
	window.onresize = myChart.onresize;
	BMapExt.setOption(option);
	console.log(JSON.stringify(option));
}


//添加行政区域
Bustool.prototype.drawBdary=function(str,fn,opts){
	this.removeBdary();
	this.bdary=this.bdary||new BMap.Boundary();
	var opts=opts||{};
	var color=opts.color||'green';
	var weight=opts.weight||2;
	var srokeOpacity=opts.strokeOpacity||0.4;
	var fillColor=opts.fillColor||'transparent';
	var _this=this;
	this.bdary.get(str, function(rs){       //获取行政区域
		var count = rs.boundaries.length; //行政区域的点有多少个
		if (count === 0) {
			console.log('未能获取 '+str+' 行政区域');
			return ;
		}
		//var pointArray = [];
		for (var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: weight, strokeColor: color,fillColor:fillColor,srokeOpacity:srokeOpacity}); //建立多边形覆盖物
			_this.map.addOverlay(ply);  //添加覆盖物
			//pointArray = pointArray.concat(ply.getPath());
			_this.bdarys.push(ply);
		}    
		//map.setViewport(pointArray);    //调整视野  
		//addlabel(); 
		fn&&fn();              
	}); 
};

//移除行政区域覆盖物
Bustool.prototype.removeBdary=function(){
	for(var i=0;i<this.bdarys.length;i++){
		this.map.removeOverlay(this.bdarys[i]);
	}
};

//设置行政区域覆盖物颜色
Bustool.prototype.setBdaryFillColor=function(str){
	for(var i=0;i<this.bdarys.length;i++){
		this.bdarys[i].setFillColor(str);
	}
	
};
//设置行政区域覆盖物边线颜色
Bustool.prototype.setBdaryBorderColor=function(str){
	for(var i=0;i<this.bdarys.length;i++){
		this.bdarys[i].setStrokeColor(str);
	}
};
//设置行政区域覆盖物边线颜色 透明度
Bustool.prototype.setBdaryBorderColorOpacity=function(str){
	for(var i=0;i<this.bdarys.length;i++){
		this.bdarys[i].setStrokeOpacity(str);
	}
};
