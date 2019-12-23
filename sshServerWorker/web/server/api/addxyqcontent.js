var fs = require('fs');
var path = require('path');

var config = require('../config');

var addxyqcontent = function(req,res){
		var post='';
		var postData;
		req.on('data',function(chunk){
			post += chunk;
		});
		req.on('end',function(){
			postData = JSON.parse(post);
			var ip = req.header('x-forwarded-for');
			var txt = postData.content+'|'+postData.time+'|'+ip+'|'+postData.author+'\n';
			fs.appendFile(path.join(config.dataUrl,'./xuyuanqiang.txt'),txt ,function(err){
			  if (err){res.send('error');}else{res.send('success');}
			});
		});
		
};

//addxyqcontent();

module.exports = addxyqcontent;
