/**
 * create by zhaomingqiang 2017.12.12
 * 
 * 用于生成一个对象的子对象,参数同为单参数
 * 
 */

define(function(){
	
	function inherit(obj,fn){
		
		var midObj = function(){};
		midObj.prototype = obj.prototype;
		
		var subObj = function(opts){
			obj.call(this,opts);
			fn&&fn.call(this,opts);
		};
		subObj.prototype = new midObj();
		
		return subObj;
	}

	return inherit;
	
});


	
