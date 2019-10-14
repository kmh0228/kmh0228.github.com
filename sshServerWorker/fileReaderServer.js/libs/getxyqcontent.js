var fs = require('fs');
var path = require('path');

var getxyqcontent = function(req,res){
	var data = fs.readFileSync(path.join(__dirname,'../../../../../home/s5ming/data/xuyuanqiang.txt'),'utf-8');
	var result = [];
	var arr1 = data.split('\n');
	arr1.forEach(function(item){
		if(item){
			var arr2 = item.split('|');
			result.push({
				content:arr2[0],
				time:arr2[1],
				auhor:arr2[3]
			});
		}
	})
	res.send(JSON.stringify(result));
};

//getxyqcontent();

module.exports = getxyqcontent;
