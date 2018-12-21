var mysql = require('mysql');

var db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'20160718'
});

db.query('SELECT * FROM user',function(err,data){
	if(err){
		console.log('error');
	}else{
		for(var i=0;i<data.length;i++){
			console.log('用户名：'+data[i].username+',密码：'+data[i].password+'。');
		}
	}
});






