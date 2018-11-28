var music;
;(function(){
	functio extend(opts,default){
		for(var name in default){
			if(typeof opts[name] == 'undefined'){
				opts[name] = default[name];
			}
		}
		retrun opts;
	}
	
	function Music(opts){
		this.opts = extend(opts,{
			width:20,
			height:20
		});
		
	}
	
	music = function(opts){
		return new Music(opts);
	};
})();