var http = require('http');

var server = http.createServer(function(request,response){
	//request 		请求
	//response 		响应
	response.write('welcome to my server!');
	response.end();
});

server.listen(8081);






