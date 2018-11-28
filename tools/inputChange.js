// JavaScript Document

//inputChange函数，由于input框数值改变是触发,obj为jquery对象

function inputChange(obj,fn){
	var oldval=obj.val();
	obj.on('focus',function(){
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			var newval=obj.val();
			//if(newval=='')return;
			if(!(newval===oldval)){
				oldval=newval;
				fn&&fn(newval);
			}
		},30);
	});
	obj.on('blur',function(){
		clearInterval(obj.timer);
	});
}
