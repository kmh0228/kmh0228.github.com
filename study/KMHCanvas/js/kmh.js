//i am kmh0228    QQ:1150123276

;var Kmh,KmhPoint,KmhLine,KmhCircle,KmhPhyon;
(function(){
	//合并json的方法
	function extend (json,defau) {
		for(var name in defau){
			if(typeof json[name]=='undefined')json[name]=defau[name];
		}
		return json;
	}
	//继承行为的方法 a继承b的行为
	function inherit (a,b){
		var c=function(){};
		c.prototype=b.prototype;
		a.prototype=new c();
		a.prototype.constructor=a;
	}
	var P=Math.PI;
	//定义容器对象
	//kmh对象
	Kmh = function (id,opts) {
		//获取canvas元素对象
		var canvas=this.canvas=document.getElementById(id)?document.getElementById(id):id;//定义元素
		canvas.innerHTML='该浏览器版本不支持canvas功能，请升级或更换浏览器';//处理兼容性
		//获取画笔
		this.gd=canvas.getContext('2d');
		//储存样式参数
		var opts=this.opts=opts||{};//所有样式
		this.width=Number(opts.width||this.canvas.width||500);//画布宽度
		this.height=Number(opts.heigth||this.canvas.height||300);//画布高度
		//建立容器存放canvas里的所有元素
		this.content=[];
		//初始化canvas状态
		this.init();
	}
		//初始化
		Kmh.prototype.init=function(){
			//设置宽高
			this.canvas.width=this.width;
			this.canvas.height=this.height;
		};
		//画图
		Kmh.prototype.draw=function(){
			//获取画笔
			var gd=this.gd;
			//清屏
			gd.clearRect(0,0,this.width,this.height);
			//循环画已经存放的元素
			var content=this.content;		//获取所有元素
			var length=content.length;		//获取元素个数
			for(var i=0;i<length;i++){		//循环
				gd.save();				//保存画布状态
				gd.beginPath();			//开始画笔
				var obj=content[i];			//获取单个元素
				var type=obj.type;			//获取元素类型
				switch(type){				//判断类型
					case 'line':
						var points=obj.points;//获取所有的点
						var pointslength=points.length;//获取点数
						gd.moveTo(points[0].x,points[0].y);//落笔
						for(var j=1;j<pointslength;j++){
							gd.lineTo(points[j].x,points[j].y);
						}
						gd.stroke();//描边
						gd.lineWidth=obj.lineWidth;
						gd.strokeStyle=obj.strokeColor;
					break;
					case 'phyon':
						var points=obj.points;//获取所有的点
						var pointslength=points.length;//获取点数
						gd.moveTo(points[0].x,points[0].y);//落笔
						for(var j=1;j<pointslength;j++){
							gd.lineTo(points[j].x,points[j].y);
						}
						gd.closePath();
						gd.stroke();//描边
						gd.lineWidth=obj.lineWidth;
						gd.strokeStyle=obj.strokeColor;
					break;
					case 'circle':
						var center=obj.center;
						var r=obj.r;
						gd.arc(center.x,center.y,r,0,2*P);
						gd.stroke();
					break;
				}
				gd.restore();				//还原画布状态
			};
		};
		//添加线圆多边形等对象
		Kmh.prototype.push=function(KmhObj){
			this.content.push(KmhObj);
		};

	//点对象，参数可为json{x:y:z:}或者2-3个参数，分别为 x y z
	KmhPoint = function(arg){
		var argumentslength=arguments.length;
		if(argumentslength<2){
			var arg=this.arg=arg||{};
			this.x=arg.x||0;
			this.y=arg.y||0;
			this.z=arg.z||0;			
		}else{
			this.x=arguments[0];
			this.y=arguments[1];
			this.z=arguments[2]||0;
		}
		this.type='point';
	};
	//形状对象
	function KmhObj (points,opts){
		this.points=points||[];//
		var opts=this.opts=extend(opts||{},{
			lineWidth:1,			//默认边线宽度
			strokeColor:'#000'		//默认描边颜色
		});
		this.lineWidth=opts.lineWidth;
		this.strokeColor=opts.strokeColor;
	}
	
	//线对象
	KmhLine = function(points,opts){
		KmhObj.call(this,points,opts);
		this.type='line';
	};

	//多边形对象
	KmhPhyon = function(points,opts){
		KmhObj.call(this,points,opts);
		this.type='phyon';
	};
	
	KmhCircle = function(point,opts){
		KmhObj.call(this,[point],opts);
		this.r=this.opts.r||10;//半径
		this.center=point;
		this.type='circle';
	};
	
})();
