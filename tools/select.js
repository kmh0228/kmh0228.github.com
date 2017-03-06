// JavaScript Document

//我自己的简易选择器
//SC() 选择结果是数组  $() 选择结果是第一个
//支持 # .  tag 的混合
function SC(str){
	if(!str)return [];
	var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/);
	var parents=[document];
	var childs=[];
	for(var i=0;i<arr.length;i++){
		childs=[];
		if(arr[i][0]=='#'){
			for(var j=0;j<parents.length;j++){
				childs.push(parents[j].getElementById(arr[i].substring(1)));
			}
		}else if(arr[i][0]=='.'){
			for(var j=0;j<parents.length;j++){
				var aObject=parents[j].getElementsByClassName(arr[i].substring(1));
				for(var k=0;k<aObject.length;k++){
					childs.push(aObject[k]);
				}
			}
		}else{
			for(var j=0;j<parents.length;j++){
				var aObject=parents[j].getElementsByTagName(arr[i]);
				for(var k=0;k<aObject.length;k++){
					childs.push(aObject[k]);
				}
			}
		}
		parents=childs.slice(0);
		console.log(arr[i]);
		console.log(childs);
	}
	return childs;
}

function $(str){
	return SC(str)[0];
}