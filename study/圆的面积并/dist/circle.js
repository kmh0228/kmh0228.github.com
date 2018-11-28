/**
 * create by zhaomingqiang 2018.5.14
 * 
 * 圆对象
 */

;define([
	'./extend',
	'./point'
	],function(
		extend,
		point
	){
	
	function Circle(opts){
		
		var opts = this.opts = extend(opts||{},{
			x:10,y:10,r:10
		});
		
		this.x = Number(opts.x);
		this.y = Number(opts.y);
		this.r = Number(opts.r);
	}
	
	Circle.prototype.getCenter = function(){
		return point(this.x,this.y);
	};
	
	//判断一个点是否在圆内  point:{x:x,y:y}		//在边缘属于out
	Circle.prototype.checkPoint = function(point){
		
		var dis2 =	Number(Math.pow(point.x - this.x,2)) + Number(Math.pow(point.y - this.y,2));
		var r2 = Math.pow(this.r,2);
		
		//console.log('比较圆心距和半径和的大小');
		//console.log(dis2 + ' <> ' + r2);
		
		if(dis2>r2){
			return 1;			//点在圆外
		}else if(dis2<r2){
			return -1;			//点在圆内
		}else{
			return 0;			//点在圆上
		};
	};
	
	//判断一条线与圆的关系
	Circle.prototype.checkLine = function(line){
		var linePoints = line.getPoints();
		//console.log('获取线的两个端点');
		//console.log(linePoints);
		var s1 = this.checkPoint(linePoints[0]);
		var s2 = this.checkPoint(linePoints[1]);
		//console.log(s1 + ' + ' + s2 + ' <0 ' + (s1+s2<0));
		if(s1+s2<0){
			return -1;			//线在圆内
		}else if(s1+s2>0){
			var center = point(this.x,this.y);
			var dis = line.getDisPoint(center);
			//console.log(dis + ' < ' + this.r);
			if(dis<this.r){
				return 0;		//线与圆相交，线穿过圆
			}else{
				return 1;		//线在圆外
			}		
		}else{
			if(s1!=0){
				return 0;		//线与圆相交
			}else{
				return -1;		//线在圆内。同时两个端点在圆上
			}
		}
	};
	
	Circle.prototype.drawIn = function(parent){
		if(this.obj)return;
		var obj = this.obj = document.createElement('div');
		parent.appendChild(obj);
		obj.style.width = obj.style.height = parseInt(this.r * 2) + 'px';
		obj.style.position = 'absolute';
		obj.style.top = parseInt(this.y - this.r) + 'px';
		obj.style.left = parseInt(this.x - this.r) + 'px';
		obj.style.background = '#999';
		obj.style.opacity = '0.3';
		obj.style.borderRadius = '50%';
	};
	
	var circle = function(opts){
		return new Circle(opts);
	};
	
	return circle;
	
});