/**
 * create by zhaomingqiang 2017.12.18
 * 
 * 墨卡托投影公式
 * 返回当前点在起始点中所占的比例
 * 
 */

define([
	'../../CMap/tools/extend',
	'../../CMap/tools/logWarning'
],function(
	extend,
	logWarning
){
/**
 * 
 * @param {Object} cur  当前经纬度数值
 * @param {Object} opts		{
 * 	s:起点数值
 *  e:终点数值
 *  type: lon  数据类型(lon/lat)
 * }
 */
	function ProjectionLat(lat){
		return Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
	}

	var mercator = function(cur,opts){
		var opts = extend(opts||{},{
			s:15,
			e:45,
			type:'lon'
		});
		
		if(opts.type == 'lon'){
			return (cur-opts.s)/(opts.e-opts.s);
		}else if(opts.type == 'lat'){
			var LatS = ProjectionLat(opts.s);
			var LatE = ProjectionLat(opts.e);
			var LatCur = ProjectionLat(cur);
			return 1-(LatCur-LatS)/(LatE-LatS);
		}else{
			logWarning('mercator 参数标明数据类型错误');
			return 0;
		}
		
		
	};
		
	return mercator;	
	
});
