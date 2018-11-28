/**
 * create by zhaomingqiang 2018.5.14
 * 
 * 判断一个正方形 和 圆的关系
 */

;define([
	'./forEach'
],function(
	forEach
){
	
	var isOverlap = function(squire,circle){
		
		var squLines = squire.getLines();
		
		var num = 0;
		forEach(squLines,function(e){
			num += circle.checkLine(e);
			//console.log(num);
		});
		
		if(num == -4){
			return 'out-in';		//方在圆内
		}else if(num == 4){
			if(squire.checkPoint(circle.getCenter()) == -1){
				return 'in';		//圆在方内
			}else{
				return 'out';		//相离
			}
		}else{
			return 'width';			//相交
		}
		
	};
	
	return isOverlap;
	
});