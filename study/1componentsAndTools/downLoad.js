
/**
 * create by zhaomingqiang 20180927
 * 浏览器下载文件的方法
 * qq:1150123276
 */

var downLoad;

downLoad = function(fileData,opts){
	
	var opts = opts || {};
	
	//fileData = fileData.replace(/^data:[^;]*;/, 'data:attachment/file;');
	//1.html5 a.download 导出           这里不适用
	//2.location.href  好像被屏蔽了
	//window.location.href = fileData;
	//或者 window.open(fileData,'_blank');
	//3.ie专用
	//navigator.msSaveOrOpenBlob(blob, fileName);
	//4 iframe
	
	var frame = document.createElement('iframe');
	console.log(frame);
	if(frame){
		document.body.appendChild(frame);
		frame.setAttribute("style", "display:none");
		frame.contentDocument.open("txt/html", "replace");
		frame.contentDocument.write(fileData); // data 是 string 类型
		frame.contentDocument.close();
		frame.focus();
		frame.contentDocument.execCommand("SaveAs", true, "filename");
		document.body.removeChild(frame);
	}
	
};
