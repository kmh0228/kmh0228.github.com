//模块详解

//url 是地址解析的模块
var url = require('url');
var parse = url.parse('www.baidu.com');
//console.log(parse);


//querystring 是对象字符串转换的模块
var querystring = require('querystring');
var str = querystring.stringify({name:'zhangsan'});
//console.log(str);

//http 服务模块
var http = require('http');
//建立 服务
/*
http.createServer(function(req,res){
	res.writeHeader(200,{contentType:"text/plain"});
	res.write("hello word");
	res.end();
}).listen(80);
*/

//爬虫 爬某个页面的源码
http.get('http://www.baidu.com',function(res){
	var html='';
	res.on('data',function(data){
		html+=data;
	});
	res.on('end',function(){
		cheeriotest(html);
	});
});

//cheerio   处理字符串形式的html 需要下载
// npm install cheerio
var cheerio=require('cheerio');
function cheeriotest(html){
	var $=cheerio.load(html);
	var title=$('title');
	//console.log(title.text());
	var as=$('a');
	as.each(function(i,e){
		//console.log($(e).attr('href'));
	});
}

//监听事件。最多只能监听十个//res.emit('data'，参数)调用
var events = require('events').EventEmitter;
var obj = new events();
obj.setMaxListeners(11);//修改最大限度，同一个事件上绑定是方法
var arr=['端茶','倒水','端茶','倒水','端茶','倒水','端茶','倒水','端茶','倒水','端茶'];
for(var i=0;i<arr.length;i++){
	(function(i){
		obj.on('去工作',function(){
			console.log('给我 '+arr[i]);
		});
	})(i);
}
//obj.emit('去工作');
obj.on('去玩',function(){
	console.log('去玩游戏');
});
//obj.emit('去玩');
//obj.removeListener(事件，方法) 移除事件
//obj.removeAllListener(事件);//yi'ch'
var ls= obj.listeners('去工作');//查看已注册时间上的方法
console.log(ls.length);


//get request 从后台发起请求，获取远程的资源,get是 request的封装 ，get 能做的 request 都能做
var qs = require('querystring');
//netWork里的headers formdata
var postData=qs.stringify({
	content:'很棒',
	mid:15321
});
var options={
	hostname:'117.121.101.41',//'http://www.imooc.com',
	port:80,
	path:'/course/docomment',
	method:'POST',
	//network>headers>request
	headers:{
		'Accept':'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Connection':'keep-alive',
		'Content-Length':postData.length,
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'Cookie':'imooc_uuid=0360b3af-191b-420d-9e4f-6af907f7e3eb; imooc_isnew_ct=1501147350; loginstate=1; apsid=UxNTU5N2NlZjliNWFlMWUwZThlZjk4N2M5NGI1MmUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANTA0NTY5NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrbWgwMjI4QHNpbmEuY29tAAAAAAAAAAAAAAAAAAAAAGY5ZmU2NTY3N2RkYjEyYzBkZTBmZGYwZTAyN2I4NmExFbF5WRWxeVk%3DZG; last_login_username=kmh0228%40sina.com; PHPSESSID=teluajoljdq3t2cihf94ee7ee5; cninfo=syb12-0e3785bb64ff082e0fe94900fd9b9ed6; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1503386775,1503475486,1503478457,1503541191; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1503562612; imooc_isnew=2; cvde=599e37b9d24e8-170',
		'Host':'www.imooc.com',
		'Origin':'http://www.imooc.com',
		'Referer':'http://www.imooc.com/video/15321',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
		'X-Requested-With':'XMLHttpRequest'
	}
};


var req = http.request(options,function(res){
	res.on('data',function(data){
		console.log(data);
	});
	res.on('end',function(){
		console.log('请求结束');
	});
});

req.on('error',function(e){
	console.log(e);
});
req.write(postData);
req.end();

//get
















