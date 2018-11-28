
var write = function write(str){
	document.body.innerHTML += str||'';
};
define(function(){
	return write;
}); 
