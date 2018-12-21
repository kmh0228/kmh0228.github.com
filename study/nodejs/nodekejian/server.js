var http = require('http');

var server = http.createServer(function(request,response){
	//request 		请求
	//response 		响应
	console.log('Someone is coming...');
});

server.listen(8081);






