
function setStyleKuHei(map){
	map.setMapStyle({
							styleJson : [ 
							{
			                    "featureType": "subway",
			                    "elementType": "all",
			                    "stylers": {
			                              "weight": "1.8"
			                    }
			          	},{
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
							}, /*{
								featureType : "subway",
								elementType : "all",
								stylers : {
									visibility : "off"
								}
							}, */{
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
									lightness : 10
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



//创建类Bustool
function Bustool(map){
	this.map=map;
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
		fn&&fn(arr);
		return;
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

