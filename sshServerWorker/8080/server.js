//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
var http = require('http');
//2、创建服务器    函数的参数req是发送给服务器的请求，res是服务器的相应
var n = 0;
var httpObj = http.createServer(function(req,res){
            n++;
            console.log('收到请求:' + n);
            res.write('请求成功');
            res.end();    
        
});
//监听端口
httpObj.listen(8080);