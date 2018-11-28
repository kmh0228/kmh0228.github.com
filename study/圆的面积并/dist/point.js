/**
 * create by zhaomingqiang 2018.5.4
 */

;define(function(){
	
	function Point(x,y){
		this.x = Number(x);
		this.y = Number(y);
	}
	
	var point = function(x,y){
		return new Point(x,y);
	}
	
	return point;
});