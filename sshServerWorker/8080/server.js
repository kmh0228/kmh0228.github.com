//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
var http = require('http');
//2、创建服务器    函数的参数req是发送给服务器的请求，res是服务器的相应
var querystring = require('querystring');

var n = 0;
var httpObj = http.createServer(function(req,res){
            n++;
            var str="";
            req.on("data",function(chuck){
                str += chuck;
            })
            req.on("end",function(){
                var data = querystring.parse(str);
                console.log('收到请求:' + data.user_name + ":" + n);
                res.write('请求成功');
                res.end();    
            })
});
//监听端口
httpObj.listen(8080);