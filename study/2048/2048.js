//i am kmh0228
// QQ: 1150123276


(function($){
	
	//小方法
	function P(str){return parseInt(str);}
	
	//2048 滑块
	function I048Btn(obj,opts){
		this.e=obj;
		this.opts = opts;
		this.initStyle();
	}
	
	I048Btn.prototype.initStyle = function(){
		var s = this.opts;
		s.width = 
		this.e.css({
			background:s.sBackground,
			border:P(s.sBorderWidth)+'px solid '+s.sBorderColor,			
			'border-radius':s.sBorderRadius,
		});
	}
	
	//2048盒子
	function I048Box(obj,opts){
		this.e = obj;
		this.opts = opts;
		
		this.initStyle();
		this.initDom();
	}
	
	I048Box.prototype.initStyle = function(){
		var s = this.opts;
		this.e.css({
			width:s.width,
			height:s.height,
			background:s.background,
			border:P(s.borderWidth)+'px solid '+s.borderColor,
			'border-radius':s.borderRadius,
		});
	};
	
	I048Box.prototype.initDom = function(){
		var s = this.opts;
		var xLimit = s.xLength;
		var yLimit = s.yLength;
		var s.width
		
		var container = this.container = [];
		for(var i=0;i<xLimit;i++){
			for(var j=0;j<yLimit;j++){
				var i048Btn = new I048Btn({
					offsetWidth:s.width
				});
				this.addI048Btn(i048Btn);
			}
		}
	};
	
	I048Box.prototype.addI048Btn = function(i048Btn){
		var e = i048Btn.e;		
		this.container.push(i048Btn);
		this.e.appendChild(e);
		e.initStyle();
	};
	
	
	$.fn.create2048 = function(opts){
			
		var opts = $.extend({
			
			width:200,			//宽度
			height:200,			//高度
			background:'#ccc',	//背景颜色
			borderColor:'#ddd',	//边线颜色
			borderWidth:2,		//边线宽度
			borderRadius:5,		//四角圆角度
			
			xLength:4,			//x轴滑块个数
			yLength:4,			//y轴滑块个数
			
			sHtml:[2,4,8,16,32,64,128,256,512,1024,2048,4096],		//滑块里面的内容,可用字符串或标签
			sBackground:['transparent'],							//滑块背景颜色,与上对应
			sBorderColor:['transparent'],							//滑块边线颜色，与上对应
			sBorderWidth:[1],										//滑块边线宽度,与上对应
			sBorderRadius:5,										//滑块四角圆角度
			
			
			
			
			
		},opts||{});
		
		return new I048Box(this,opts);
	};
	
	
	
	
	
})(jQuery);