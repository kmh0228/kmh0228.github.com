// JavaScript Document
//公用设置

//创建类Bustool
function Bustool(map){
	this.map=map;
	//初始化透明层
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
}

//坐标转换
Bustool.prototype.toBaiduPoint=function(points,fn,opts){
	if(!points.length){fn&&fn.call(this,[]);return;}
	var info=opts||{};
	var pici=Number(info.pici||10);
	var num=Number(info.num||10);
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
				convertor.translate(points.slice(start+(index*num),start+(index*num)+num<limit?start+(index*num)+num:limit), 1, 5,function(data){
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
			//console.log(newPoints[j]);
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
	console.log('转换输入的数组');
	console.log(arr);
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

