/**
 * create by zhaomingqiang 2017.12.14
 * 
 * 生成一个信息窗口
 */


define([
	'../../CMap/tools/extend',
	'../../CMap/tools/log'
],function(
	extend,
	log
){
	
	var Message = function(opts){
		var opts = this.opts = extend(opts||{},{
			inner:'',
			backgroundColor:'rgba(255,255,255,0.5)',
			color:'#000',
			fontSize:16,
			width:'auto',
			heigth:'auto',
			textAlign:'center',
			x:0,
			y:0
		});
		
		var obj = this.obj = document.createElement('div');
		
		document.body.appendChild(obj);
		
		
		this.initStyle();
		this.setInnerHTML();
		
	};
	
	Message.prototype.initStyle = function(){
		var s = this.obj.style;
		log(this.opts.backgroundColor);
		s.backgroundColor=this.opts.backgroundColor;
		s.color = this.opts.color;
	  	s.fontSize=this.opts.fontSize;
	  	s.width=this.opts.width;
	  	s.height=this.opts.height;
	  	s.textAlign=this.opts.textAlign;
	  	s.padding = '8px 10px';
	  	s.WebkitBorderRadius=s.MozBorderRadius=s.borderRadius='10px';
	  	s.whiteSpace='nowrap';
      	s.MozUserSelect = "none";
      	s.position = 'absolute';
      	this.setPoint();
      	this.hide();
	};
	
	Message.prototype.setInnerHTML = function ( html ){
		this.opts.inner = this.obj.innerHTML = html || this.opts.inner;
	};
	
	Message.prototype.setPoint = function(point){
		var point = point||{};
		this.opts.x = point.x || this.opts.x;
		this.opts.y = point.y || this.opts.y;
		this.obj.style.top = this.opts.y +'px';
		this.obj.style.left = this.opts.x + 'px';
	};
	
	Message.prototype.show = function(){
		this.obj.style.display = 'block';
	};

	Message.prototype.hide = function(){
		this.obj.style.display = 'none';
	};


	return Message;
	
});


