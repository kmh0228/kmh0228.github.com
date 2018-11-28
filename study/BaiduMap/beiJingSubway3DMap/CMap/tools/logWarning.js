/**
 *  create by zhaomingqiang 2017.12.14
 * 用于在控制台打印错误log的方法
 */
define([
	'../../CMap/tools/log'
],function(log){
	
	function logWarning(str){
		log('WARNING '+str);
	}
	
	return logWarning;

	
});
