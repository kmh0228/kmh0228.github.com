/**
 *  create by zhaomingqiang 2017.12.11
 * 用于在控制台打印错误log的方法
 */
define([
	'../../CMap/tools/log'
],function(log){
	
	function logERR(str){
		log('ERROR '+str);
	}
	
	return logERR;

	
});
