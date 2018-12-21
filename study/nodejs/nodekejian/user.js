var http = require('http'),
	fs = require('fs'),
	mysql = require('mysql'),
	qs = require('querystring');
	
var server = http.createServer(function(request,response){
	if(request.url.indexOf('?')!=-1){
		///?user=admin&pass=123&t=0.4975525114281265
		var arr = request.url.split('?');
		//arr[1]
		//user=admin&pass=123&t=0.4975525114281265
		var GET = qs.parse(arr[1]);
		
		
	}else{
		fs.readFile('www'+request.url,function(err,data){
			if(err){
				response.end('404');
			}else{
				response.end(data);
			}
		});
	}
});
server.listen(8081);