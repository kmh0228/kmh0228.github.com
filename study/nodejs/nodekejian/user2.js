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
		
		switch(GET.act){
			case 'log':
				var db = mysql.createConnection({
					host:'localhost',
					user:'root',
					password:'',
					database:'20160718'
				});
				var SQL = "SELECT * FROM user WHERE username='"+GET.user+"'";
				db.query(SQL,function(err,data){
					if(err){
						console.log('错了');
					}else{
						if(data.length){
							if(GET.pass==data[0].password){
								response.end('{"err":1,"msg":"登录成功"}');
							}else{
								response.end('{"err":0,"msg":"用户名或密码错误"}');
							}
						}else{
							response.end('{"err":0,"msg":"用户未注册"}');
						}
					}
				});
				break;
			case 'reg':
				var db = mysql.createConnection({
					host:'localhost',
					user:'root',
					password:'',
					database:'20160718'
				});
				var SQL = "SELECT * FROM user WHERE username='"+GET.user+"'";
				db.query(SQL,function(err,data){
					if(err){
						console.log('err');
					}else{
						if(data.length){
							response.end('{"err":0,"msg":"用户名已被占用"}');
						}else{
							var SQL2 = "INSERT INTO user VALUES('"+GET.user+"','"+GET.pass+"')";
							db.query(SQL2,function(err,data){
								if(err){
									console.log('err');
								}else{
									response.end('{"err":1,"msg":"注册成功"}');
								}
							});
						}
					}
				});
				break;
		}
		
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