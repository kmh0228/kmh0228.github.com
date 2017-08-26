
var http = require('http');
//var Promise = require('Promise');

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
