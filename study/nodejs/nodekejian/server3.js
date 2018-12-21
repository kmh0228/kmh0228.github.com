var http = require('http');

var server = http.createServer(function(request,response){
	//request 		请求
	//response 		响应
	//response.write('welcome to my server!');
	response.end('welcome to my server!');
});

server.listen(8081);






