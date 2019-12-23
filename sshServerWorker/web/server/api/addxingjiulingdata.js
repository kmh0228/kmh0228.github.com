var fs = require('fs');
var path = require('path');
var config = require('../config');

var datapth = path.join(config.dataUrl,'./xingjiulingData.js');

var addxingjiulingdata = function(req,res){
	var post='';
	var postData;
	req.on('data',function(chunk){
		post += chunk;
	});
	req.on('end',function(){
		postData = JSON.parse(post);
		var oldjs = fs.readFileSync(datapth,'utf-8');
		var header = oldjs.substring(0,21);
		var foot = oldjs.substring(21);
		var newjs = header + '\n{"question":"“'+postData.quest+'”的下一句是？","opt1":"'+postData.opt+'"},' + foot;
		fs.writeFile(datapth, newjs, function (err) {
		   if (err){res.send('error');}else{res.send('success');}
		});
	});	
};
module.exports = addxingjiulingdata;
