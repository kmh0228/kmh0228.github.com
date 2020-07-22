
var https = require('https');
var cheerio=require('cheerio');

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


	let name = tounicode('中国');
	https.get('https://fanyi.baidu.com/#zh/en/'+name,function(pres){
        var html='';
		pres.on('data',function(data){
			html+=data;
		});
		pres.on('end',function(){
         var $=cheerio.load(html);
         var resultDom=$('.translate-main .target-output');
         console.log(resultDom.length)
         console.log(resultDom.html())
		});
	});
//接受指定路径的请求，指定回调函数
