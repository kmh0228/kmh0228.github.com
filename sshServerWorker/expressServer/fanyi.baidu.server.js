
var http = require('http');
var express = require('express');

//创建一个app对象，类似一个web 应用（网站）
var app = express();

function tounicode(data)
{
   if(data == '') return '请输入汉字';
   var str =''; 
   for(var i=0;i<data.length;i++)
   {
      str+="\\u"+parseInt(data[i].charCodeAt(0),10).toString(16);
   }
   return str;
}

app.get('',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	let name = tounicode(req.query.cn);
	console.log(name)
	http.get('http://api.fanyi.baidu.com/api/trans/vip/translate?q='+name+'&from=zh&to=en&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4',function(pres){
        var html='';
		pres.on('data',function(data){
			html+=data;
		});
		pres.on('end',function(){
			res.end(html);
		});
	});
})
//接受指定路径的请求，指定回调函数
app.listen(8911, () => console.log('翻译功能get服务在8911端口,参数cn'))
