var http = require('http'),
	fs = require('fs');
	
http.createServer(function(req,res){
	//req.url 			/1.html
	//'root'+req.url
	//'root/1.html'
	fs.readFile('root'+req.url,function(err,data){
		if(err){
			res.write('404');
		}else{
			res.write(data);
		}
		res.end();
	});
	
}).listen(8081);









