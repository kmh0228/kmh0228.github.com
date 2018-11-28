/**
 * create by zhaomingqiang 2018.2.8
 * 
 * 圆的面积并方法
 * 
 */
/**
 * @param {Object} circles  圆的数组  
 * @param {Object} opts     配置参数
 * 		opts:{
 * 				acc:1,   //精度，越小精度越高
 * 
 * 		}
 * 
 * 圆的表达方式为 {x:x坐标,y:y坐标,r:半径}
 * 正方形的表达式为{x1:左下角横坐标,y1:左下角纵坐标,x2:右上角横坐标,y2:右上角纵坐标}
 */

//主方法

define([
	'dist/squire',
	'dist/isOverlap'
],function(
	squire,
	isOverlap
){
	


;var circleAreaAnd;


(function(){
	var log = console.log;
	
	//找出包含多个圆的最小正方形
	function getSquireByCircles(circles){
		//建立一个包含所以圆的正方形
		var minX,minY,maxX,maxY;
		forEach(circles,function(e,i){
			if(!i){
				minX = Number(e.x) - Number(e.r);
				minY = Number(e.y) - Number(e.r);
				maxX = Number(e.x) + Number(e.r);
				maxY = Number(e.y) + Number(e.r);
			}else{
				if(minX > Number(e.x) - Number(e.r)) minX = Number(e.x) - Number(e.r);
				if(minY > Number(e.y) - Number(e.r)) minY = Number(e.y) - Number(e.r);
				if(maxX < Number(e.x) + Number(e.r)) maxX = Number(e.x) + Number(e.r);
				if(maxY < Number(e.y) + Number(e.r)) maxY = Number(e.y) + Number(e.r);
			}
		});
		var r = (((maxX - minX) > (maxY - minY))?(maxX - minX):(maxY - minY))/2;
		return squire({
			x:minX+r,
			y:minY+r,
			r:r
		});
	}

	//把矩形四等分的工具
	function quartSquire(squire2){
		var x = squire2.x,y = squire2.y,r = squire2.r;
		var nr = r/2; 
		return [squire({x:x-nr,y:y-nr,r:nr}),
		squire({x:x+nr,y:y-nr,r:nr}),
		squire({x:x-nr,y:y+nr,r:nr}),
		squire({x:x+nr,y:y+nr,r:nr})];
	}
	
	//主方法
	circleAreaAnd= function(circles,drawS,opts){
		var opts = opts||{};
		var acc = opts.acc || 0.5;			//精度,切割的最小正方形的半径
		var resultMin = 0;					//保守最小结果，即全部在圆内的正方形的面积
		var resultDev = 0;					//不确定面积的区域
		
		//获取包含所有圆的最小正方形
		var squire = getSquireByCircles(circles);
		
		var progress_now = 0;
		
		function getOverLay(circles,squire,progress){
			drawS&&drawS(squire);
			var length = circles.length;
			var statue = '';
			var outNum = 0;
			for(var i=0;i<length;i++){
				var isPlus = isOverlap(squire,circles[i]);
				if(isPlus == 'out-in'){
					statue = 'out-in';
					break;
				}
				if(isPlus ==  'out'){
					outNum++;
				}
			}
			
			if(statue == 'out-in'){
				resultMin += squire.getS();
				progress_now += progress;   console.log(progress_now);
			}else if(outNum == length){
				progress_now += progress;  console.log(progress_now);
			}else{
				if(squire.r <= acc){
					resultDev += squire.getS();
					progress_now += progress;  console.log(progress_now);
				}else{
					forEach(quartSquire(squire),function(e){
						getOverLay(circles,e,progress/4);
					});
				}
			}
			
		}
		
		getOverLay(circles,squire,100);
		var error = resultDev/2;
		return resultMin+error+' 正负 '+error;
	};
	
	
	//循环工具
	function forEach(arr,callback){
		var length = arr.length;
		for(var i=0;i<length;i++){
			callback(arr[i],i);
		}
	}	
	
})();


return circleAreaAnd;

});