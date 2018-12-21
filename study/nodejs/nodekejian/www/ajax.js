function json2url(json){
	json.t = Math.random();
	var arr = [];
	for(var name in json){
		arr.push(name+'='+encodeURIComponent(json[name]));
	}
	return arr.join('&');
}
//url,data,type,success,error
function ajax(json){
	json = json||{};
	json.data = json.data || {};
	json.type = json.type || 'GET';
	json.timeout = json.timeout||10000;
	if(!json.url){
		return;
	}
	//1.创建一个ajax对象
	if(window.XMLHttpRequest){
		var oAjax = new XMLHttpRequest(); //ff  chrome
	}else{
		var oAjax = new ActiveXObject('Microsoft.XMLHTTP');  //ie
	}
	switch(json.type.toLowerCase()){
		case 'get':
		oAjax.open('GET',json.url+'?'+json2url(json.data),true);
		oAjax.send();
		break;
		case 'post':
		oAjax.open('POST',json.url,true);
		oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		oAjax.send(json2url(json.data));
		break;
	}
	json.loading&&json.loading();
	clearTimeout(timer);
	var timer = setTimeout(function(){
		json.complete&&json.complete();
		json.error&&json.error('网络异常，请稍后重试');
		oAjax.onreadystatechange = null;
	},json.timeout);
	//4.接收  监控网络状态
	oAjax.onreadystatechange = function(){
		//判断网络状态是否是好的  4是好的
		if(oAjax.readyState == 4){
			//http状态  网络状态好的情况下看对方是否能接收
			if(oAjax.status>=200&&oAjax.status<300 || oAjax.status==304){
				clearTimeout(timer);
				json.complete&&json.complete();
				json.success&&json.success(oAjax.responseText);  //服务器返回的数据或文本
			}else{
				clearTimeout(timer);
				json.error&&json.error('网络异常，请稍后重试');
			}
		}
	};
}
