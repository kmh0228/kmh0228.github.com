
let openUrl = function(url,info){
    var linkUrl=url+(info?'?':'');
	var info=info||{};
	var copyN=0;
	for(var name in info){
		linkUrl+=(copyN?'&':'')+name+'='+info[name];
		copyN++;
	}
	window.open(linkUrl);
}
export default openUrl;
