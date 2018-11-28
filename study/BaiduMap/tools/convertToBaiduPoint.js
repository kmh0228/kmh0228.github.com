
/**
 * 将其他坐标转换成百度坐标的方法
 * create by kmh0228 2017-12-7
 * 依赖于 BMap
 * @param {Object} points 需要转换的原坐标数组
 * @param {Object} fn     转换完成后的回调函数 参数为转换后的坐标数组
 * @param {Object} opts	  配置项 默认
 * 						{	from:1,      //源数据类型  GIS坐标from为1, 其他高德，谷歌等from为3, 百度为9(不转换)
 * 							pici:10,     //每次发送多少转换坐标请求
 * 							num:10,      //每个请求包含多少坐标点（请选择小于10的数据）
 * 						}
 * 
 */
function convertToBaiduPoint(points,fn,opts){
	if(!points.length){fn&&fn([]);return;}
	var info=opts||{};
	var pici=Number(info.pici||10);
	var num=Number(info.num||10);
	var from=Number(info.from||1);
	if(from == 9){fn&&fn(points);return;}
	var convertor = new BMap.Convertor();
	var length=points.length;
	var newPoints=[];
	var speed=pici*num;
	var start=0;
	var tobaiduPointTimer;
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
	clearInterval(tobaiduPointTimer);
	getBaiduPoint();
	tobaiduPointTimer=setInterval(function(){
		var num=0;
		for(var j=start;j<limit;j++){
			if(newPoints[j]){
				num++;
			}
		}
		if(limit-start==num){
			if(limit==length){
				clearInterval(tobaiduPointTimer);
				fn&&fn(newPoints);
			}else{
				start+=speed;
				getBaiduPoint();
			}
		}
	},30);
};


/**
 * 依赖convertToBaiduPoint
 * @param {Object} arr  多个数组坐标批量转换 [[坐标点，],[],[],[]]
 * @param {Object} fn   转换完成的回调函数,参数与源数据对应
 * @param {Object} opts 同convertToBaiduPoint参数
 */
function converToBaiduPointArr(arr,fn,opts){
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
	convertToBaiduPoint(points,function(newpoints){
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