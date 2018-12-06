// JavaScript Document

//键盘按键 按下事件
//obj 省略则默认为document
var codeToKey= {
	"A":65,
	"B":66,
	"C":67,
	"D":68,
	"E":69,
	"F":70,
	"G":71,
	"H":72,
	"I":73,
	"J":74,
	"K":75,
	"L":76,
	"M":77,
	"N":78,
	"O":79,
	"P":80,
	"Q":81,
	"R":82,
	"S":83,
	"T":84,
	"U":85,
	"V":86,
	"W":87,
	"X":88,
	"Y":89,
	"Z":90,
	'ENTER':13
}

var keyKey={
	Ctrl:'ctrlKey',
	Shift:'shiftKey',
	Alt:'altKey'
};

//obj可以省略，默认为document
//keyarr最多有三个 但最多只有一个不是 Alt/Shift/Ctrl

function keyDown(a,b,c){
	var obj=arguments.length==2?document:arguments[0];
	var keyarr=arguments.length==2?arguments[0]:arguments[1];
	var fn=arguments.length==2?arguments[1]:arguments[2];
	var keydown=function(ev){
		var oEvent=ev||event;
		var bOk=true;
		for(var i=0;i<keyarr.length;i++){
			if(keyKey[keyarr[i]]){
				if(oEvent[keyKey[keyarr[i]]]!=true)bOk=false;
			}else{
				if(oEvent.keyCode!=codeToKey[keyarr[i].toUpperCase()])bOk=false;
			}
		}
		if(bOk)fn&&fn(keyarr);
	};
	obj.addEventListener('keydown',keydown);
	return keydown;
}