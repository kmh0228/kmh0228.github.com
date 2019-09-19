var http = require('http');

http.createServer(function(request,response){
    response.setHeader('Content-Type','text/html'); //contentType 告诉浏览器我发给你的是个什么东西
    //              'Content-Type','text/plain;charset=utf-8"  明文，utf-8解析。 这里的charset级别比浏览器的charset高
    response.writeHead(202,'haha');              //告诉请求的状态
    response.write('hello');
}).listen(8081);
