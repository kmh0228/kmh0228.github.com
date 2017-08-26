// I am kmh0228
//QQ 1150123276

//jQuery插件，请先引入jQuery

(function($) {
	$.fn.keyboard=function(opts){
		var opts=$.extend({
			keyColors:['rgb(0, 255, 100)','rgb(255, 225, 0)','rgb(255, 100, 0)','rgb(255, 0, 75)','rgb(150, 0, 255)','rgb(0, 150, 255)']//键盘颜色
		},opts||{});
		addDom(this);
		initStyle(this,opts);
		addEL(this,opts);
	};
	function addDom(obj){
		
	}
	function initStyle(obj,opts){
		
	}
	
	function addEL(obj,opts){
		//建立自己的按键数据
		var codesE=obj.find('li').not('.gw');
		var codes=[];
		codesE.each(function(i,e){
			var json={};
			var e=json.e=$(e);
			json.key=e.attr('data_index');
			json.x=parseInt(e.position().left+(e.outerWidth()/2)+2);
			json.y=parseInt(e.position().top+(e.outerHeight()/2)+2);
			codes.push(json);
		});
		//给按键加颜色
		codes.sort(function(a,b){
			return (b.x-b.y)-(a.x-a.y);
		});
		var codeslength=codes.length;
		var keyColors=opts.keyColors;
		var keyColorslength=keyColors.length;
		var sameCodesLength=codeslength/keyColorslength;
		for(var i=0;i<codeslength;i++){
			var color=keyColors[parseInt(i/sameCodesLength)];
			codes[i].initcolor=color;
			codes[i].e.css({'color':color,'border-color':color, 'box-shadow':'0 0 5px '+color });
		}
		var t=0;
		var colortimer=setInterval(linearColor,1000);
		function linearColor(){
			t++;
			for(var i=0;i<codeslength;i++){
				var color=keyColors[(parseInt(i/sameCodesLength)+t)%keyColorslength];
				codes[i].initcolor=color;
				codes[i].e.css({'color':color,'border-color':color, 'box-shadow':'0 0 5px '+color });
			}
			setObjBorder();

		}
		//添加边线颜色
		function setObjBorder(){
			var n=parseInt(0+Math.random()*keyColorslength);
			obj.css({'box-shadow':'0 0 200px 0 '+keyColors[n]+' inset'});
		}
		setObjBorder();
		//加事件
		function findKey(code){
			for(var i=0;i<codeslength;i++){
				if(codes[i].key==code){
					return codes[i];
				};
			}
			return false;
		}		
		var openLinearTimer;

		$(document).on('keydown',function(event){
			var key=findKey(event.keyCode);
			if(!key){alert('请切换至英文输入');return;}
			key.press=true;
			var vid=document.createElement('video');
			vid.src="music/keydown.mp3";
			vid.play();
			var color=key.initcolor;
			key.e.css({'color':'#fff','background':color, 'box-shadow':'0 0 5px '+color,'transform':'scale(1.1)'});
			clearInterval(colortimer);
			clearTimeout(openLinearTimer);
			//setObjBorder();
		});
		$(document).on('keyup',function(event){
			var key=findKey(event.keyCode);
			if(!key){alert('请切换至英文输入');return;}
			key.press=false;
			var color=key.initcolor;
			key.e.css({'color':color,'background':'none', 'box-shadow':'0 0 5px '+color,'transform':'scale(1)',});
			clearInterval(colortimer);
			openLinearTimer=setTimeout(function(){
				clearInterval(colortimer);
				clearTimeout(openLinearTimer);
				colortimer=setInterval(linearColor,1500);
			},8000);
			//特效
			for(var i=0;i<codeslength;i++){
				(function(i){
					var time=codes[i].time=Math.abs(codes[i].x-key.x)+(Math.abs(codes[i].y-key.y)*3);
					if(codes[i].press)return;
					codes[i].timeout=setTimeout(function(){
						clearTimeout(codes[i].timeout);
						codes[i].e.css({'color':color,'border-color':color, 'box-shadow':'0 0 5px '+color});
						codes[i].distimeout=setTimeout(function(){
							clearTimeout(codes[i].distimeout);
							codes[i].e.css({'color':codes[i].initcolor,'border-color':codes[i].initcolor, 'box-shadow':'0 0 5px '+codes[i].initcolor });
						},50);
					},codes[i].time);
				})(i);
			}			
			
		});
	}
})(jQuery);






