//主方法

requirejs.config({
	baseUrl:'dist',
	paths:{
		"write":'write'
	}
});

requirejs(['write'],function(write){
	write('acb ');
});

