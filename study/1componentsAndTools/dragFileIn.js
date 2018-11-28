/**
 * create by zhaomingqiang 2018.9.27
 * qq：1150123276
 * 将文件拖入dom的事件
 */

var dragFileIn;
var log = console.log;
//					原生对象  回调函数
dragFileIn = function(obj,opts){
	var opts = opts || {};
	var dragEnter = opts.dragEnter || null;	//拖拽文件到此dom上时触发的事件
	var dragOver = opts.dragOver || null;	//拖拽到上面的事件，持续触发
	var dragLeave = opts.dragLeave || null;	//拖拽文件离开dom时触发的事件
	var drop = opts.drop || null;			//把东西放在上面触发，放入后触发一次，参数为放入的文件
	
	obj.ondragenter = function(){
		dragEnter && dragEnter();
		log('ondragenter触发');
	}
	
	//将此事件默认时间阻止，才能触发ondrop
	obj.ondragover = function(){
		log('ondragover触发');
		dragOver && dragOver();
		return false;
	};
	
	obj.ondragleave = function(){
		log('ondragleave触发');
		dragLeave && dragLeave();
	}
	
	obj.ondrop = function(ev){
		log('ondrop触发');
		var files = ev.dataTransfer.files;
		drop&&drop(files);
	};
	
};
