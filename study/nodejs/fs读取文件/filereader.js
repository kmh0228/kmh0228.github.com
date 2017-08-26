

var fs = require('fs');

fs.readFile('test.txt',function(err,data){
	console.log(data);
	console.log(data.length);
	var buf = new Buffer(data);
	console.log(buf.length);
	console.log(buf.toString());
});


