/**
 * create by zhaomingqiang 2017.12.11
 * QQ: 1150123276
 * 
 * 生成一个三维框架的工具
 */

define([
	'../../CMap/tools/log',
	'../../CMap/tools/extend',
	'../../CMap/tools/drag',
	'../../CMap/tools/addWheel',
	'../../CMap/tools/setTransForm',
	'../../CMap/tools/setTransFormStyle',
	'../../CMap/point/Point',
],function(
	log,
	extend,
	drag,
	addWheel,
	setTransForm,
	setTransFormStyle,
	Point
){
	log('ThreeContainer.js 开始加载');
	
	function ThreeContainer(id , opts){
		//定义三维框架的容器
		var container = this.container = document.getElementById(id)?document.getElementById(id):id;
		//定义默认配置项
		var opts = this.opts = extend(opts||{},{
			loadColor:'none',		//默认地面底层颜色
			xR:60,					//默认地面倾斜角度
			zR:0,					//默认地面旋转角度
			xSen:0.1,				//垂直方向鼠标灵敏度
			zSen:0.1,				//水平方向鼠标灵敏度
			maxXR:80,				//最大倾斜角度(以垂直方向为零向后倾斜)
			minXR:20,				//最小倾斜角度(以垂直方向为零向后倾斜)
			per:1200,				//透视距离
			translateZ:0,			//地图距离屏幕的距离
			mouseSen:50,			//鼠标灵敏度
			cursor:'pointer',		//鼠标样式
			ltPoint:new Point(0,0),	//图片左上角经纬度
			rbPoint:new Point(100,100),//图片右下角经纬度
			mapPicSrc:'CMap/images/t0175497b4af8017cf3.jpg'
		});
			
		this.overlays=[];
		this.initHTML();
		this.initStyle();
		this.addEL();
	
	}
	
	ThreeContainer.prototype.initHTML = function(){
		var mapContainer = this.mapContainer = document.createElement('div');
		var ground = this.ground = document.createElement('div');
		var mapPicContainer = this.mapPicContainer = document.createElement('div');
		var groundContainer = this.groundContainer = document.createElement('div');
		this.container.appendChild(mapContainer);
		mapContainer.appendChild(ground);
		ground.appendChild(mapPicContainer);
		ground.appendChild(groundContainer);
	
	};
	
	
	ThreeContainer.prototype.initStyle = function(){
		this.mapContainer.style.width = this.mapContainer.style.height = '100%';
		this.mapContainer.style.cursor = this.opts.cursor;
		this.mapContainer.style.position = 'relative';
		this.mapContainer.style.overlay = 'hidden';
		setTransFormStyle(this.mapContainer,'preserve-3d');
		this.mapContainer.style.perspective = this.opts.per+'px';
		this.ground.style.width = this.ground.style.height = '100%';		
		this.ground.style.background=this.opts.loadColor;
		this.ground.style.width = this.groundContainer.style.height = '100%';
		setTransFormStyle(this.ground,'preserve-3d');
		this.mapPicContainer.style.width = this.mapPicContainer.style.height = '100%';
		this.setMapPic();
		this.groundContainer.style.width = this.groundContainer.style.height = '100%';
		setTransFormStyle(this.groundContainer,'preserve-3d');
		this.groundContainer.style.position = 'absolute';
		this.groundContainer.style.top = this.groundContainer.style.left = 0;
		this.view = {
			width:parseInt(this.mapContainer.offsetWidth),
			height:parseInt(this.mapContainer.offsetHeight)
		};
		this.viewCenter = {
			x:this.view.width/2,
			y:this.view.height/2
		};
		this.eyeCenter = {
			x:this.view.width/2,
			y:this.view.height/2
		}
		this.initGroundStatus();
	};
	
	ThreeContainer.prototype.setMapPic = function (opts){
		var opts = opts || {};
		this.opts.mapPicSrc = opts.mapPicSrc || this.opts.mapPicSrc;
		this.mapPicContainer.style.background = 'url('+this.opts.mapPicSrc+')';
		this.mapPicContainer.style.backgroundSize = 'cover';
	};
	
	
	ThreeContainer.prototype.setRotate = function(json){
		var json = json||{};
		var x = this.opts.xR = json.xR||this.opts.xR;
		var z = this.opts.zR = json.zR||this.opts.zR;
		this.initGroundStatus();
	};
	
	ThreeContainer.prototype.setTranslateZ = function(value){
		var translateZ = this.opts.translateZ = value||this.opts.translateZ;
		this.initGroundStatus();
	};
	
	ThreeContainer.prototype.setPer = function(value){
		var per = this.opts.per = value||this.opts.per;
		this.initGroundStatus();
	};
	
	// 重置地图旋转，倾斜，及拉伸的状态
	ThreeContainer.prototype.initGroundStatus = function(){
		setTransForm(this.ground,{
			tz:this.opts.translateZ,
			rx:this.opts.xR,
			rz:this.opts.zR
		});
		
		this.eyeCenter.x = this.viewCenter.x + Math.sin(this.opts.xR/180*Math.PI)*(this.opts.per-this.opts.tz);
		var overlaysLength = this.overlays.length;
		for(var i=0;i<overlaysLength;i++){
			this.overlays[i].mapChange(this.opts.zR,this.eyeCenter);
		}				
	}
	
	ThreeContainer.prototype.addEL = function(){
		var _this = this;
		drag(this.mapContainer,function(dx,dy){
			var x = _this.opts.xR-(dy*_this.opts.xSen);
			if(x >= _this.opts.maxXR){
				x = _this.opts.maxXR;
			}else if(x<=_this.opts.minXR){
				x = _this.opts.minXR;
			}	
			_this.setRotate({
				xR:x,
				zR:_this.opts.zR-(dx*_this.opts.zSen)
			});
		});
		
		addWheel(this.mapContainer,function(dir){
			if(dir){
				_this.opts.translateZ += _this.opts.mouseSen;
			}else{
				_this.opts.translateZ -= _this.opts.mouseSen;
			}
			_this.setTranslateZ();
		});
		
	};
	
	ThreeContainer.prototype.setHTML = function (html){
		this.groundContainer.innerHTML = html;
	};
	
	ThreeContainer.prototype.addOverlay = function(overlay){
		this.groundContainer.appendChild(overlay.e);
		this.overlays.push(overlay);
	};
	
	log('ThreeContainer.js 加载结束');
	return ThreeContainer;
});

