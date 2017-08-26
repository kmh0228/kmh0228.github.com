

var xuesheng = require('./student');
var laoshi = require('./teacher');


function add(teacher,student){
	laoshi.add(teacher);
	student.forEach(function(i,e){
		xuesheng.add(i);
	});
}

exports.add=add;
