/**模拟请求的服务，使用页面前请把这个打开 */


var http = require('http');
var querystring = require('querystring');

var qq = http.request({
    hostname:'58.251.61.150',
    post:'443',
    path:'/cgi-bin/mmwebwx-bin/webwxsendmsg?lang=zh_CN',
    headers:{
        'Accept':'application/json, text/plain, */*',
        'Accept-Encoding':'gzip, deflate, br',
// Accept-Language	
// zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
// Connection	
// keep-alive
// Content-Length	
// 424
// Content-Type	
// application/json;charset=utf-8
// Cookie	
// webwxuvid=7ae497687f6996297f69…iNGJc; wxpluginkey=1545380282
// Host	
// wx2.qq.com
// Referer	
// https://wx2.qq.com/?&lang=zh_CN
// User-Agent	
// Mozilla/5.0 (X11; Linux x86_64…) Gecko/20100101 Firefox/60.0
    }
},function(req){
    var html = '';
    req.on('data',function(data){html+=data;});
    req.on('end',function(){
        console.log(html);
    })
});

qq.end();