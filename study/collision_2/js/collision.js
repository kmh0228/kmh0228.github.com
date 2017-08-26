/*
I am kmh0228
QQ:1150123276
2017-06-20
*/
/*
使用方法说明
	1.此插件纯原生js编写，使用时引入此collision.js即可。
	2.生成容器，假设现有一个id为container的盒子做容器。
		var oB=new CollBox(‘container’);
			注：容器必须是有宽高的定位元素。尽量不要有边线。
	3.生成小球
		var ball=new Ball();
	4.把小球放入容器
		oB.addBall(ball);
	5.调用容器的ballRun方法，让小球开始运动。注意：此运动是完全弹性碰撞，不会损失能量。
		oB.ballRun();
	over
	
	参数说明
		容器参数  new CollBox(‘container’，opts);
			opts:{width:num,height:num}//没有边线和padding的时候可不写。有的情况下需要把容器真实宽高填进去。
		小球参数 new Ball(opts);
			opts:{
				e:小球DOM元素/原生对象，可填入页面DOM，不写则生成新DIV DOM,
				b:小球半径 默认30;包含边
				c:小球背景颜色/图片， 默认'pink'
				borderWidth:边线宽度 默认0
				borderColor:边线颜色 默认#000
				x:小球中心点的横坐标 默认为半径
				y:小球中心点的纵坐标 默认为半径
				sx:小球在x轴方向速度每30ms，默认3
				sy:小球在y轴方向速度每30ms，默认3
				m:小球的质量，默认b/30;
				html:小球内部的内容，不填则不会改变DOM本身的内容。
				fontSize:字体大小，默认12;
				opa:小球透明度，默认1；
				callBack:function  碰撞时的回掉函数，参数为碰撞的总次数，方法中this指向此球对象
				click:click 点击时的链接地址
			}
		小球方法：
				setB(num)//重新设置小球半径
				setC(str);//重新设置小球背景颜色/图片
				setBorderWidth(n);//重新设置小球边线宽度
				setBorderColor(str);//重新设置边线颜色
				setM(n);//重设小球质量,如果不给参数，则按照半径重新默认质量
				setHTML(str);//重设小球内容
				setOpa(n);//重设小球透明度

 
 */

//extend方法
	function extend (json,defau) {
		var json=json||{};
		for(var name in defau){
			if(typeof json[name]=='undefined')json[name]=defau[name];
		}
		return json;
	}

//容器对象  必须是一个有宽高的定位（相对/绝对/固定）容器，用来放小球，如果容器有边线。请在opts设定容器的宽高
	function CollBox(id,opts){
		var container=this.container=document.getElementById(id);
		var opts=this.opts=opts||{};
		this.width=opts.width||container.offsetWidth;
		this.height=opts.height||container.offsetHeight;
		this.child=[];
	}
	//容器添加小球的方法
	CollBox.prototype.addBall=function(ball){
		this.child.push(ball);
		if(ball.opts.e.parentNode!=this.container){
			this.container.appendChild(ball.opts.e);
		};
	};
	//让小球开始运动
	CollBox.prototype.ballRun=function(){
		clearInterval(this.ballRunTimer);
		var _this=this;
		var w=this.width;
		var h=this.height;
		var isColl=this.isColl;
		var coll=this.coll;
		this.ballRunTimer=setInterval(function(){
			//获取小球
			var balls=_this.child;
			var blength=balls.length;
			//让小球走一步
			for(var i=0;i<blength;i++){
				balls[i].foot();
			}
			//检测小球与墙
			for(var i=0;i<blength;i++){
				var bi=balls[i].opts;
				var b=bi.b;
				if(bi.x<b){bi.x=b;bi.sx*=-1;}
				if(bi.y<b){bi.y=b;bi.sy*=-1;}
				var mw=w-b;
				if(bi.x>mw){bi.x=mw;bi.sx*=-1;}
				var mh=h-b;
				if(bi.y>mh){bi.y=mh;bi.sy*=-1;}
			}
			//检测小球与小球的碰撞
			for(var i=0;i<blength;i++){
				for(var j=i+1;j<blength;j++){
					if(isColl(balls[i],balls[j])){
						coll(balls[i],balls[j],function() {
							balls[i].collNum++;
							balls[i].opts.callBack.call(balls[i],balls[i].collNum);
							balls[j].collNum++;
							balls[j].opts.callBack.call(balls[j],balls[j].collNum);
						});
					}
				}
			}
		},30)
	};
	CollBox.prototype.ballStop=function() {
		clearInterval(this.ballRunTimer);
	};
	//obj  {type:,x:,y:,b:,sx:,:sy,m:}
	//利用弹性碰撞公式重新设定两球碰撞后的速度
	CollBox.prototype.coll=function(obj1,obj2,fn) {
		//判断两物体是否相向
		var dx=obj2.opts.x-obj1.opts.x;
		var dy=obj2.opts.y-obj1.opts.y;
		var dsx=obj2.opts.sx-obj1.opts.sx;
		var dsy=obj2.opts.sy-obj1.opts.sy;
		var dirdsxy=Math.atan2(dsy,dsx);
		var dirdxy=Math.atan2(-dy,-dx);
		var ddir=Math.abs(dirdxy-dirdsxy);
		var D=Math.PI/2;
		if(ddir<=3*D&&ddir>=D)return;
		fn&&fn();
		//进行碰撞
		(function coll(a,b){
			//a到b的角度
			var dxy=Math.atan2(b.y-a.y,b.x-a.x);
			var D=Math.PI/2;
			if(dxy>D*2)dxy-=D*2;
		
			var MC=Math.cos(dxy);
			var MS=Math.sin(dxy);
		
			var asx=a.sx*MC+a.sy*MS;
			var asy=a.sx*Math.cos(dxy+D)+a.sy*MC;
			var bsx=b.sx*MC+b.sy*MS;
			var bsy=b.sx*Math.cos(dxy+D)+b.sy*MC;
			
			var m1=a.m,m2=b.m;
			var summ=m1+m2;
			var newasx=((m1-m2)*asx+2*m2*bsx)/summ;
			var newbsx=((m2-m1)*bsx+2*m1*asx)/summ;
		
			var DMC=Math.cos(-dxy);
			var DMS=Math.sin(-dxy);
			a.sx=newasx*DMC+asy*DMS;
			a.sy=newasx*Math.cos(D-dxy)+asy*DMC;
			b.sx=newbsx*DMC+bsy*DMS;
			b.sy=newbsx*Math.cos(D-dxy)+bsy*DMC;	
		})(obj1.opts,obj2.opts);
	};
 
	//检测两球是否碰撞
	CollBox.prototype.isColl=function(obj1,obj2){
		if(obj1.stopfoot||obj2.stopfoot)return false;
		var d=Math.pow(obj1.opts.x-obj2.opts.x,2)+Math.pow(obj1.opts.y-obj2.opts.y,2);
		var sb=Math.pow(obj1.opts.b+obj2.opts.b,2);
		return d<sb;
	};

//物体对象
	function Obj(opts){
		if(opts=='extend')return;
		this.opts=extend(opts||{},{
			width:60,//宽度的
			height:60,//高度
			borderWidth:0,//边线宽度
			borderColor:'#000',//边线颜色
			backGround:'pink',//背景颜色 默认pink
			fontSize:12,//字体大小
			opa:1,//透明度
			x:30,//x坐标
			y:30,//y坐标
			sx:3,//x速度
			sy:3,//y速度
			m:1,//质量
			e:document.createElement('div'),//默认小球元素 可自己定义
			callBack:function(){}//回掉函数
			//,html:''//内容，可不写，无默认值
			//,click:''//链接位子可不写
		});
		this.collNum=0;
		this.initStyle();
		this.addEvent();
	}
	Obj.prototype.initStyle=function(){
		var width=this.opts.width;
		var height=this.opts.height;
		var borW=this.opts.borderWidth;
		var s=this.opts.e.style;
		s.position='absolute';
		s.top=s.left=0;
		s.width=width-borW*2+'px';
		var innerHeight=s.height=height-borW*2+'px';
		s.background=this.opts.c;
		s.backgroundSize='cover';
		s.border=borW+'px solid '+this.opts.borderColor;
		s.opacity=this.opts.opa;
		s.cursor='pointer';
		if(this.opts.html){
			this.opts.e.innerHTML=this.opts.html;
			s.textAlign='center';
			s.lineHeight=innerHeight;
			s.fontSize=this.opts.fontSize+'px';
		}
		this.setPos();
	};
	Obj.prototype.addEvent=function(){
		var _this=this;
		this.opts.e.onmouseenter=function(){
			_this.stopFoot();
		};
		this.opts.e.onmouseout=function(){
			_this.startFoot();
		};
		console.log(this.opts);
		console.log(this.opts.click); 
		if(this.opts.click){
			this.opts.e.onclick=function(){
				_this.opts.click();
			};
		}
	};
	Obj.prototype.foot=function(n){
		if(this.stopfoot)return;
		var n=n||1;
		this.opts.x+=this.opts.sx*n;
		this.opts.y+=this.opts.sy*n;
		this.setPos();
	};
	Obj.prototype.startFoot=function(){
		this.stopfoot=false;
		this.opts.e.style.zIndex=1;
	};
	Obj.prototype.stopFoot=function(){
		this.stopfoot=true;
		this.opts.e.style.zIndex=999;
	};
	Obj.prototype.setPos=function(){
		var width2=this.opts.width/2;
		var height2=this.opts.height/2;
		var x=parseInt(this.opts.x-width2);
		var y=parseInt(this.opts.y-height2);
		this.opts.e.style.transform='translate('+x+'px,'+y+'px)';
		this.opts.e.style.webkitTransform='translate('+x+'px,'+y+'px)';
	};
	Obj.prototype.setC=function(str){
		var c=this.opts.c=str;
		this.opts.e.style.background=c;
		this.opts.e.style.backgroundSize='cover';
	};
	Obj.prototype.setBorderWidth=function(n){
		var n=this.opts.borderWidth=n;
		var sn=n*2;
		var s=this.opts.e.style;
		s.width=parseInt(this.opts.width-sn)+'px';
		var innerHeight=s.height=parseInt(this.opts.height-sn)+'px';
		s.lineHeight=innerHeight;
		s.border=n+'px solid '+this.opts.borderColor;
	};
	Obj.prototype.setBorderColor=function(str){
		var str=this.opts.borderColor=str;
		this.opts.e.style.border=this.opts.borderWidth+'px solid '+str;
	};
	Obj.prototype.setM=function(n){
		this.opts.m=n||(this.opts.width*this.opts.height)/3600;
	};
	Obj.prototype.setHTML=function(str){
		var html=this.opts.html=str;
		var s=this.opts.e.style;
		this.opts.e.innerHTML=html;
		s.textAlign='center';
		s.lineHeight=this.opts.height-this.opts.borderWidth*2+'px';
		s.fontSize=this.opts.fontSize+'px';
	};
	Obj.prototype.setOpa=function(n){
		var opa=this.opts.opa=n;
		this.opts.e.style.opacity=n;
	};
	
//小球对象
	function Ball(opts){
		//继承Obj属性
		var opts=this.opts=extend(opts||{},{
			type:'ball',
			b:30,//半径
		});
		opts.width=opts.height=opts.b*2;
		Obj.call(this,opts);
	}
	//继承Obj方法
	Ball.prototype=new Obj('extend');
	Ball.prototype.constructor=Ball;
	var initStyle=Ball.prototype.initStyle;
	Ball.prototype.initStyle=function(){
		initStyle.call(this);
		this.opts.e.style.borderRadius='50%';
	}
	Ball.prototype.setB=function(n){
		var b=this.opts.b=n;
		var s=this.opts.e.style;
		this.opts.width=this.opts.height=b*2;
		s.width=s.height=(b-this.opts.borderWidth)*2+'px';
		s.lineHeight=(b-this.opts.borderWidth)*2+'px';
		this.setPos();
	};

