// JavaScript Document
function getByClassName(obj,name){
	if(document.getElementsByClassName){
		return obj.getElementsByClassName(name);
	}else{
		var aSall=obj.getElementsByTagName('*');
		var classArr=[];
		var res=new RegExp('\\b'+name+'\\b','g');
		for(var i=0;i<aSall.length;i++){
			var arr=aSall[i].className.split(' ');
			if(res.test(aSall[i].className)){classArr.push(aSall[i])}
		}
		return classArr;
	}
}

