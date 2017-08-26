// JavaScript Document
//公用方法，把以0开头的两位数变成一位数
//公用方法，把字符串变日期
function strtodate(str){
	return str.substring(8,10)+':'+str.substring(10,12)+':'+str.substring(12,14);
}


//创建类Bustool
function Bustool(map){
	this.map=map;
}

//坐标转换
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

//JSON格式坐标转换
