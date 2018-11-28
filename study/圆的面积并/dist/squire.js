/**
 * create by zhaomingqiang 2018.5.14
 * 
 * 方形的对象
 * x,y是方形的中心点坐标，r是方形的内切圆半径
 */

;define([
	'./extend',
	'./line'
],function(
	extend,
	line
){
	
	function Squire(opts){
		var opts = this.opts = extend(opts||{},{
			x:10,y:10,r:10
		});
		this.x = Number(opts.x);
		this.y = Number(opts.y);
		this.r = Number(opts.r);
	}
	
	Squire.prototype.getS = function(){
		return this.r*this.r*4;
	};
	
	Squire.prototype.getMaxR = function(){
		return Number(this.r*Math.sqrt(2));
	};
	
	Squire.prototype.getLines = function(){
		var result = [line({x1:this.x-this.r,y1:this.y-this.r,x2:this.x-this.r,y2:this.y+this.r}),
				line({x1:this.x-this.r,y1:this.y-this.r,x2:this.x+this.r,y2:this.y-this.r}),
				line({x1:this.x+this.r,y1:this.y+this.r,x2:this.x-this.r,y2:this.y+this.r}),
				line({x1:this.x+this.r,y1:this.y+this.r,x2:this.x+this.r,y2:this.y-this.r})];
		return result;
	};
	
	Squire.prototype.checkPoint = function(point){
		var x0 = point.x, y0 = point.y;
		var x = this.x, y = this.y, r = this.r;
		if(x0 < x-r || x0 > x+r || y0 < y-r || y0 > y+r){
			return 1;
		}else if(x0 > x-r && x0 < x+r && y0 > y-r && y0 < y+r){
			return -1;
		}else{
			return 0;
		}
	};
	
	Squire.prototype.drawIn = function(parent){
		if(this.obj)return;
		var obj = this.obj = document.createElement('div');
		parent.appendChild(obj);
		obj.style.width = obj.style.height = parseInt(this.r * 2) + 'px';
		obj.style.position = 'absolute';
		obj.style.top = parseInt(this.y - this.r) + 'px';
		obj.style.left = parseInt(this.x - this.r) + 'px';
		//obj.style.background = '#999';
		obj.style.border = '1px solid #666';
		obj.style.boxSizing = 'border-box';
		obj.style.opacity = '0.3';
	};
	
	
	var squire = function(opts){
		return new Squire(opts);
	};
	
	return squire;
	
});
