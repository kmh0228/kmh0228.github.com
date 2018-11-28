// I am kmh0228
//QQ 1150123276
/*
此为键盘插件，使用很简单
		$('.keyboard').keyboard(opts);
		即可把一个盒子变成键盘
		如上 opts为参数，json格式，可不填，具体参数值如下
		

			width:p($obj.css('width')),			//键盘宽度
			radius:4,							//键盘四角的圆角度数
			padding:10,							//键盘四周空白区域宽度
			segment:4,							//键盘左中右之间分割线宽度

			FbuttonHeight:2,					//第一排F区域按键与第二行之间的距离
			
			keyWidth:0,							//按钮宽度
			keyHeight:0,						//按钮高度
			keyRadius:4,						//每个按钮四角的圆角度数
			keyFontSize:12,						//按钮上字体大小
			keyPassColor:'#fff',				//按钮按下时的字体颜色
			keyMargin:1,						//每个按钮四周留空的距离
			keyBorderWidth:1,					//每个按钮的边线宽度
			keyBorderColor:'#fff',				//每个按钮的边线颜色
			keyColorShadow:5,						//每个按钮的阴影扩散度
			
			keyDoubleFontSize:12,				//两行字的按钮上字体大小
			keyDoubleSegment:4,					//两行字的按钮上 上下两行间距
						
			lightRad:3,							//指示灯半径
			lightBorderColor:'#cdcd00',			//指示灯边线颜色
			lightBorderWidth:1,					//指示灯边线宽度
			lightColor:'#ccc',					//指示灯颜色
			lightColorShow:'#ff0',				//指示灯灯光颜色
			
			keyColors:['rgb(0, 255, 100)','rgb(255, 225, 0)','rgb(255, 100, 0)','rgb(255, 0, 75)','rgb(150, 0, 255)','rgb(0, 150, 255)'],//按钮颜色
			keyColorsRun:true,					//是否开启按钮颜色移动变化
			keyColorsRunTimes:1000,				//按钮颜色移动变化频率(毫秒)
			boardColors:['rgb(0, 255, 100)','rgb(255, 225, 0)','rgb(255, 100, 0)','rgb(255, 0, 75)','rgb(150, 0, 255)','rgb(0, 150, 255)'],//键盘内阴影颜色
			boardColorsShow:true,				//是否显示键盘背景内阴影
			boardColorsRun:true,				//是否开启键盘背景内阴影播放，不开启默认显示第一个颜色
			boardColorsRunType:'random',		//键盘内阴影播放方式'random' 随机播放 'order' 按顺序播放
			boardColorsInsetSize:200,			//键盘内阴影大小
			boardColorsRunTimes:1500,			//键盘内阴影播放频率(毫秒)
			keyAfterToRunTime:8000,				//按键结束后多少秒自动开启默认播放动作
			audio:'',							//按键声音路径
			keyREffect:true,					//是否开启按键四射特效
			keyREffectTimes:3					//按键特效速度，越小越快


 * */


//jQuery插件，请先引入jQuery

(function($) {
	var p = function(str){return parseInt(str);};//把文字转成数字的方法
	
	$.fn.keyboard=function(opts){
				
		var $obj = this;
		var opts=$.extend({
			width:p($obj.css('width')),			//键盘宽度
			radius:4,							//键盘四角的圆角度数
			padding:10,							//键盘四周空白区域宽度
			segment:4,							//键盘左中右之间分割线宽度

			FbuttonHeight:2,					//第一排F区域按键与第二行之间的距离
			
			keyWidth:0,							//按钮宽度
			keyHeight:0,						//按钮高度
			keyRadius:4,						//每个按钮四角的圆角度数
			keyFontSize:12,						//按钮上字体大小
			keyPassColor:'#fff',				//按钮按下时的字体颜色
			keyMargin:1,						//每个按钮四周留空的距离
			keyBorderWidth:1,					//每个按钮的边线宽度
			keyBorderColor:'#fff',				//每个按钮的边线颜色
			keyColorShadow:5,						//每个按钮的阴影扩散度
			
			keyDoubleFontSize:12,				//两行字的按钮上字体大小
			keyDoubleSegment:4,					//两行字的按钮上 上下两行间距
						
			lightRad:3,							//指示灯半径
			lightBorderColor:'#cdcd00',			//指示灯边线颜色
			lightBorderWidth:1,					//指示灯边线宽度
			lightColor:'#ccc',					//指示灯颜色
			lightColorShow:'#ff0',				//指示灯灯光颜色
			
			keyColors:['rgb(0, 255, 100)','rgb(255, 225, 0)','rgb(255, 100, 0)','rgb(255, 0, 75)','rgb(150, 0, 255)','rgb(0, 150, 255)'],//按钮颜色
			keyColorsRun:true,					//是否开启按钮颜色移动变化
			keyColorsRunTimes:1000,				//按钮颜色移动变化频率(毫秒)
			boardColors:['rgb(0, 255, 100)','rgb(255, 225, 0)','rgb(255, 100, 0)','rgb(255, 0, 75)','rgb(150, 0, 255)','rgb(0, 150, 255)'],//键盘内阴影颜色
			boardColorsShow:true,				//是否显示键盘背景内阴影
			boardColorsRun:true,				//是否开启键盘背景内阴影播放，不开启默认显示第一个颜色
			boardColorsRunType:'random',		//键盘内阴影播放方式'random' 随机播放 'order' 按顺序播放
			boardColorsInsetSize:200,			//键盘内阴影大小
			boardColorsRunTimes:1500,			//键盘内阴影播放频率(毫秒)
			keyAfterToRunTime:8000,				//按键结束后多少秒自动开启默认播放动作
			audio:'',							//按键声音路径
			keyREffect:true,					//是否开启按键四射特效
			keyREffectTimes:3					//按键特效速度，越小越快
			
		},opts||{});
		//处理keyWidth 和 keyHeight 两个参数
		opts.keyWidth = opts.keyWidth||p((p(opts.width)-p(opts.padding)*2-p(opts.segment)*2 )/22);
		opts.keyHeight = opts.keyHeight||opts.keyWidth;

		addDom($obj);
		initStyle($obj,opts);
		addEL($obj,opts);
		return this;
	};
	function addDom(obj){
		var html='<div class="keyboard_container">\
					<div class="keyboard_s keyboard_l">\
						<ul class="keyboard_row keyboard_row1">\
							<li data_index="27">Esc</li>\
							<li data_index="0" class="keyboard_gw"></li>\
							<li data_index="112">F1</li>\
							<li data_index="113">F2</li>\
							<li data_index="114">F3</li>\
							<li data_index="115">F4</li>\
							<li data_index="0" class="keyboard_gw keyboard_gw1_2"></li>\
							<li data_index="116">F5</li>\
							<li data_index="117">F6</li>\
							<li data_index="118">F7</li>\
							<li data_index="119">F8</li>\
							<li data_index="0" class="keyboard_gw keyboard_gw1_2"></li>\
							<li data_index="120">F9</li>\
							<li data_index="121">F10</li>\
							<li data_index="122">F11</li>\
							<li data_index="123">F12</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="192" class="keyboard_double">~</br>`</li>\
							<li data_index="49" class="keyboard_double">!</br>1</li>\
							<li data_index="50" class="keyboard_double">@</br>2</li>\
							<li data_index="51" class="keyboard_double">#</br>3</li>\
							<li data_index="52" class="keyboard_double">$</br>4</li>\
							<li data_index="53" class="keyboard_double">%</br>5</li>\
							<li data_index="54" class="keyboard_double">^</br>6</li>\
							<li data_index="55" class="keyboard_double">&</br>7</li>\
							<li data_index="56" class="keyboard_double">*</br>8</li>\
							<li data_index="57" class="keyboard_double">(</br>9</li>\
							<li data_index="48" class="keyboard_double">)</br>0</li>\
							<li data_index="189" class="keyboard_double">—</br>-</li>\
							<li data_index="187" class="keyboard_double">+</br>=</li>\
							<li data_index="8" class="keyboard_w2">Backspace</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="9" class="keyboard_w3_2">Tab</li>\
							<li data_index="81">Q</li>\
							<li data_index="87">W</li>\
							<li data_index="69">E</li>\
							<li data_index="82">R</li>\
							<li data_index="84">T</li>\
							<li data_index="89">Y</li>\
							<li data_index="85">U</li>\
							<li data_index="73">I</li>\
							<li data_index="79">O</li>\
							<li data_index="80">P</li>\
							<li data_index="219" class="keyboard_double">{</br>[</li>\
							<li data_index="221" class="keyboard_double">}</br>]</li>\
							<li data_index="220" class="keyboard_double keyboard_w3_2">|</br>\</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="20" class="keyboard_w2">Caps Lock</li>\
							<li data_index="65">A</li>\
							<li data_index="83">S</li>\
							<li data_index="68">D</li>\
							<li data_index="70">F</li>\
							<li data_index="71">G</li>\
							<li data_index="72">H</li>\
							<li data_index="74">J</li>\
							<li data_index="75">K</li>\
							<li data_index="76">L</li>\
							<li data_index="186" class="keyboard_double">:</br>;</li>\
							<li data_index="222" class="keyboard_double">"</br>\'</li>\
							<li data_index="13" class="keyboard_w2">Enter</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="16" class="keyboard_w5_2">Shift</li>\
							<li data_index="90">Z</li>\
							<li data_index="88">X</li>\
							<li data_index="67">C</li>\
							<li data_index="86">V</li>\
							<li data_index="66">B</li>\
							<li data_index="78">N</li>\
							<li data_index="77">M</li>\
							<li data_index="188" class="keyboard_double">&lt;</br>,</li>\
							<li data_index="190" class="keyboard_double">&gt;</br>.</li>\
							<li data_index="191" class="keyboard_double">?</br>/</li>\
							<li data_index="16" class="keyboard_w5_2">Shift</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="17">Ctrl</li>\
							<li data_index="91">Win</li>\
							<li data_index="18">Alt</li>\
							<li data_index="32" class="keyboard_w8">space</li>\
							<li data_index="18">Alt</li>\
							<li data_index="92">Win</li>\
							<li data_index="93">嘿嘿</li>\
							<li data_index="17">Ctrl</li>\
						</ul>\
					</div>\
					<div class="keyboard_s keyboard_m">\
						<ul class="keyboard_row keyboard_row1">\
							<li data_index="44" class="keyboard_double">Primt Sc</br>SysRq</li>\
							<li data_index="145" class="keyboard_double">Scroll</br>Lock</li>\
							<li data_index="19" class="keyboard_double">Pause</br>Break</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="45">Insert</li>\
							<li data_index="36">Home</li>\
							<li data_index="33" class="keyboard_double">Page</br>Up</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="46">Delete</li>\
							<li data_index="35">End</li>\
							<li data_index="34" class="keyboard_double">Page</br>Down</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="0" class="keyboard_gw"></li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="0" class="keyboard_gw"></li>\
							<li data_index="38">↑</li>\
							<li data_index="0" class="keyboard_gw"></li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="37">←</li>\
							<li data_index="40">↓</li>\
							<li data_index="39">→</li>\
						</ul>\
					</div>\
					<div class="keyboard_s keyboard_r">\
						<ul class="keyboard_row keyboard_row1">\
							<li class="keyboard_gw keyboard_lights">\
								<i><em class="keyboard_light"></em></i>\
								<i><em></em></i>\
								<i><em></em></i>\
							</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="144" class="keyboard_double">Num<br/>Lock</li>\
							<li data_index="111">/</li>\
							<li data_index="106">*</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="103" class="keyboard_double">7</br>Home</li>\
							<li data_index="104" class="keyboard_double">8</br>↑</li>\
							<li data_index="105" class="keyboard_double">9</br>PgUp</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="100" class="keyboard_double">4</br>←</li>\
							<li data_index="101" class="keyboard_double">5</br></li>\
							<li data_index="102" class="keyboard_double">6</br>→</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="97" class="keyboard_double">1</br>End</li>\
							<li data_index="98" class="keyboard_double">2</br>↓</li>\
							<li data_index="99" class="keyboard_double">3</br>PgDn</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="96" class="keyboard_w2 keyboard_double">0<br/>Ins</li>\
							<li data_index="110" class="keyboard_double">.</br>Del</li>\
						</ul>\
					</div>\
					<div class="keyboard_s keyboard_rr">\
						<ul class="keyboard_row keyboard_row1">\
							<li data_index="0" class="keyboard_gw"></li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="109">-</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="107" class="keyboard_h2">+</li>\
						</ul>\
						<ul class="keyboard_row">\
							<li data_index="13" class="keyboard_h2">Enter</li>\
						</ul>\
					</div>\
				</div>';
		obj.html(html);
	}
	function initStyle(obj,opts){
		var container = obj.find('.keyboard_container');//内部容器
		var s = opts;//所有参数
		var keyWidth = p(s.keyWidth);//按钮占位宽度
		var keyHeight = p(s.keyHeight);
		var dWH = p(s.keyBorderWidth)*2 + p(s.keyMargin)*2;//占位宽高与实际宽高差
		var keyInnerWidth = keyWidth - dWH;//按钮实际宽度
		var keyInnerHeight = keyHeight - dWH;// 按钮实际高度
		
		container.css({'width':p(s.width)+'px','overflow':'hidden','border-radius':p(s.radius)+'px',
						'position':'relative','padding':p(s.padding)+'px'});
		container.find('.keyboard_s').css({'float':'left'});//区域
		container.find('.keyboard_l').css({'width':keyWidth*15});//左区域
		container.find('.keyboard_m').css({'width':keyWidth*3,'margin':'0 '+p(s.segment)});//中区域
		container.find('.keyboard_r').css({'width':keyWidth*3});//右区域
		container.find('.keyboard_rr').css({'width':keyWidth});//最右行
		container.find('.keyboard_row').css({'margin':0,'padding':0,'overflow':'hidden'});/*每行*/
		container.find('.keyboard_row1').css({'padding-bottom':p(s.FbuttonHeight)+'px'});//第一行的下边距
		container.find('.keyboard_row>li').css({'cursor':'pointer','border-radius':p(s.keyRadius)+'px',
							'text-align':'center','list-style':'none','float':'left','font-size': p(s.keyFontSize)+'px',
							'width':keyInnerWidth+'px','height':keyInnerHeight+'px',
							'border':p(s.keyBorderWidth)+'px solid '+s.keyBorderColor,'margin':p(s.keyMargin)+'px',
							'line-height':keyInnerHeight+'px'});//每个按键样式
		container.find('.keyboard_row>li.keyboard_gw').css({'width':keyWidth+'px','height':keyHeight+'px',
							'border':'none','margin':'0','cursor':'auto'});/*隔位虚拟键 */
		container.find('.keyboard_row>li.keyboard_gw1_2').css({'width':p(keyWidth/2)+'px'});/*隔位虚拟键 0.5格*/
		container.find('.keyboard_row>li.keyboard_lights').css({'width':keyWidth*3+'px','overflow':'hidden'});/*隔位虚拟键 3格 建立指示灯*/
		container.find('.keyboard_row>li.keyboard_lights i').css({'width':keyWidth+'px','float':'left',
							'overflow':'hidden'});//每个指示灯虚拟键
		
		var lightMarginTop = p(keyHeight/2) - p(s.lightRad) - p(s.lightBorderWidth);
		container.find('.keyboard_row>li.keyboard_lights i em').css({'float':'right','width':p(s.lightRad)*2+'px',
							'height':p(s.lightRad)*2+'px','background':s.lightColor,
							'border':p(s.lightBorderWidth)+'px solid '+s.lightBorderColor,
							'margin-top':lightMarginTop+'px'});//每个指示灯
		container.find('.keyboard_row>li.keyboard_lights i em.keyboard_light').css({'background':s.lightColorShow,
							'border':p(s.lightBorderWidth)+'px solid '+s.lightColorShow,
							'box-shadow':'0 0 5px 0px '+s.lightColorShow});//亮着的指示灯
		
		var keyDoubleLineHeight = p(s.keyDoubleFontSize) + p(s.keyDoubleSegment);
		var keyDoublePadTop = p(keyInnerHeight/2) - keyDoubleLineHeight;
		container.find('.keyboard_row>li.keyboard_double').css({'font-size':p(s.keyDoubleFontSize)+'px',
							'line-height':'16px','padding-top':keyDoublePadTop+'px',
							'height':keyInnerHeight-keyDoublePadTop+'px'});//两行文字的按钮样式
		container.find('.keyboard_row>li.keyboard_w2').css({'width':keyWidth*2-dWH+'px'});//2倍宽度按键
		container.find('.keyboard_row>li.keyboard_w3_2').css({'width':p(keyWidth*1.5)-dWH+'px'});//1.5倍宽度按键
		container.find('.keyboard_row>li.keyboard_w5_2').css({'width':p(keyWidth*2.5)-dWH+'px'});//2.5倍宽度按键
		container.find('.keyboard_row>li.keyboard_w8').css({'width':keyWidth*8-dWH+'px'});//8倍宽度按键
		container.find('.keyboard_row>li.keyboard_h2').css({'height':keyHeight*2-dWH+'px','line-height':keyHeight*2-dWH+'px'});	//2倍高度按钮
	
	}
	
	function addEL(obj,opts){
		var s =opts;
		var container = obj.find('.keyboard_container');//内部容器
		//建立自己的按键数据
		var codesE=container.find('li').not('.gw');//所有按钮的元素
		var codes=[];//定义存放按钮的json集合
		codesE.each(function(i,e){
			var json={};
			var e=json.e=$(e);
			json.key=e.attr('data_index');
			json.x=parseInt(e.position().left+(e.outerWidth()/2)+2);
			json.y=parseInt(e.position().top+(e.outerHeight()/2)+2);
			codes.push(json);
		});
		//给按键加颜色
		codes.sort(function(a,b){			//给元素集合排序
			return (b.x-b.y)-(a.x-a.y);
		});
		var codeslength=codes.length;
		var keyColors=opts.keyColors;
		var keyColorslength=keyColors.length;
		var sameCodesLength=codeslength/keyColorslength;
		var startSetLinearColor=0;
		//按顺序设置按钮颜色,dt为从第几个颜色开始设置
		function setLinearColor(dc){
			var dc =dc||0;
			for(var i=0;i<codeslength;i++){
				var color=keyColors[(parseInt(i/sameCodesLength)+dc)%keyColorslength];
				codes[i].initcolor=color;
				codes[i].e.css({'color':color,'border-color':color, 'box-shadow':'0 0 '+p(s.keyColorShadow)+'px '+color });
			}
		}
		setLinearColor(startSetLinearColor);
		
		//添加键盘内阴影颜色
		var startSetBoardColor = 0;
		var boardColors = s.boardColors;
		var boardColorsLength = boardColors.length;
		function setBoardColor(n){
			var n = n||0;
			container.css({'box-shadow':'0 0 '+p(s.boardColorsInsetSize)+'px 0 '+boardColors[n]+' inset'});
		}
		if(s.boardColorsShow){
			setBoardColor(startSetBoardColor);
		}
		//添加改变颜色计时器
		addTimer();
		var keyColorTimer;
		var boardColorTimer;
		function addTimer(){
			if(s.keyColorsRun){
				clearInterval(keyColorTimer);
				keyColorTimer=setInterval(function(){
					startSetLinearColor++;
					setLinearColor(startSetLinearColor);
				},s.keyColorsRunTimes);
			}
			if(s.boardColorsShow){
				if(s.boardColorsRun){
					clearInterval(boardColorTimer);
					boardColorTimer=setInterval(function(){
						if(s.boardColorsRunType == 'order'){
							startSetBoardColor = (startSetBoardColor+1)%boardColorsLength;
						}else{
							startSetBoardColor = parseInt(boardColorsLength*Math.random());
						}
						setBoardColor(startSetBoardColor);
					},s.boardColorsRunTimes);
				}
			}
		}
		//加事件
		function findKeyByCode(code){
			for(var i=0;i<codeslength;i++){
				if(codes[i].key==code){
					return codes[i];
				};
			}
			return false;
		}		
		function findKeyByE(element){
			for(var i=0;i<codeslength;i++){
				if(codes[i].e[0]==element[0]){
					return codes[i];
				};
			}
			return false;
		}		
		var openLinearTimer;
		function keydown(eCode){
			if(eCode.press)return;
			eCode.press=true;
			if(s.audio){
				var vid=document.createElement('video');
				vid.src=s.audio;
				vid.play();
			}
			var color=eCode.initcolor;
			eCode.e.css({'color':s.keyPassColor,'background':color, 'box-shadow':'0 0 '+p(s.keyColorShadow)+'px '+color,'transform':'scale(1.1)'});
			clearInterval(keyColorTimer);
			clearInterval(boardColorTimer);
			clearTimeout(openLinearTimer);			
		}
		function keyup(eCode){
			eCode.press=false;
			var color=eCode.initcolor;
			eCode.e.css({'color':color,'background':'none', 'box-shadow':'0 0 '+p(s.keyColorShadow)+'px '+color,'transform':'scale(1)'});
			openLinearTimer=setTimeout(function(){
				clearTimeout(openLinearTimer);
				addTimer();
			},s.keyAfterToRunTime);
			if(!s.keyREffect)return;
			//特效
			for(var i=0;i<codeslength;i++){
				(function(i){
					var time=codes[i].time=Math.abs(codes[i].x-eCode.x)+(Math.abs(codes[i].y-eCode.y)*s.keyREffectTimes);
					if(codes[i].press)return;
					codes[i].timeout=setTimeout(function(){
						clearTimeout(codes[i].timeout);
						codes[i].e.css({'color':color,'border-color':color, 'box-shadow':'0 0 '+p(s.keyColorShadow)+'px '+color});
						codes[i].distimeout=setTimeout(function(){
							clearTimeout(codes[i].distimeout);
							codes[i].e.css({'color':codes[i].initcolor,'border-color':codes[i].initcolor, 'box-shadow':'0 0 '+p(s.keyColorShadow)+'px '+codes[i].initcolor });
						},50);
					},codes[i].time);
				})(i);
			}			
			
		}
		$(document).on('keydown',function(event){
			var key=findKeyByCode(event.keyCode);
			if(!key){alert('请切换至英文输入');return;}
			keydown(key);			
		});
		$(document).on('keyup',function(event){
			var key=findKeyByCode(event.keyCode);
			if(!key){alert('请切换至英文输入');return;}
			keyup(key);
		});
		codesE.on('mousedown',function(){
			var eCode = findKeyByE($(this));
			keydown(eCode);
			var timeout = setTimeout(function(){
				clearTimeout(timeout);
				keyup(eCode);
			},100);
		});
	}
})(jQuery);






