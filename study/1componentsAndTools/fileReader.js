/**
 * create by zhaomingqiang 2018.9.27
 * js 读取文件的方法
 * qq 1150123276
 */

var fileReader;

fileReader = function(file,opts){
	var opts = opts || {};
	var load = opts.load || null;
	
	var oReader = new FileReader();
	oReader.onload = function(){
		load && load(this.result);
	}
	oReader.readAsDataURL(file);
	//oReader.readAsText(file);
	//oReader.readAsBinaryString(file);
};
