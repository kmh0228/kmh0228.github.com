/**
 * create by zhoamingqiang 2018.5.14
 * 
 * 线段对象
 */

;define([
	'./extend',
	'./point'
],function(
	extend,
	point
){
	
	function Line (opts) {
		//console.log('line接收的参数');
		//console.log(opts);
		var opts = this.opts = extend(opts||{},{
			x1:10,y1:10,x2:20,y2:20
		});
		
		
		
		this.x1 = opts.x1;
		this.y1 = opts.y1;
		this.x2 = opts.x2;
		this.y2 = opts.y2;
		this.points = this.getPoints();
		this.length2 = Number(Math.pow(this.x2 - this.x1,2)) + Number(Math.pow(this.y2 - this.y1,2));
	}
	
	//获取线段的两个端点
	Line.prototype.getPoints = function(){
		return [point(this.x1,this.y1),point(this.x2,this.y2)];
	};
	
	//获取一个点到此线段的最近距离
	Line.prototype.getDisPoint = function(point){
		var length2 = this.length2;
		var ds12 = Number(Math.pow(point.x - this.x1,2)) + Number(Math.pow(point.y - this.y1,2));
		var ds22 = Number(Math.pow(point.x - this.x2,2)) + Number(Math.pow(point.y - this.y2,2));

		//console.log('length2 ' + length2);
		//console.log('ds12 '+ds12);
		//console.log('ds22 '+ds22);

		if(length2 + ds12 <= ds22 ){
			return Math.sqrt(ds12);
		}else if(length2 + ds22 <= ds12){
			return Math.sqrt(ds22);
		}else{
			var x1 = this.x1, y1 = this.y1,
				x2 = this.x2, y2 = this.y2,
				x3 = point.x, y3 = point.y;
			//console.log('x1:'+x1+',y1:'+y1+',x2:'+x2+',y2:'+y2+',x3:'+x3+',y3:'+y3);
			var S2=x1*y2+x2*y3+x3*y1-x1*y3-x2*y1-x3*y2;
			//console.log(S2);
			return Math.abs(S2 / Math.sqrt(length2));
		}
	};
	
	
	
	var line = function (opts) {
		return new Line(opts);
	}
	
	return line;
	
});