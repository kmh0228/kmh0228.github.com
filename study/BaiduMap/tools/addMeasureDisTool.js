/**
 * create by kmh0228 2017-12-7 
 * 在地图上添加测量距离的工具
 * 
 * 使用方法
 * 引入百度地图和如下测量工具js
 * <script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
 * 引入加载此js
 * map.addMeasureDisTool(); 即可
 * 
 */

(function(){
	
	if(typeof BMap == 'undefined'){
		console.log('error addMeasureDisTool.js无法找到BMap对象，请先引入BMap');
		return;
	}

	function extend (opts , init){
		for(var name in opts){
			init[name] = opts[name];
		}
		return init;
	};
	
	// 定义一个控件类,即function
	function ZoomControl(opts){
		var opts = this.opts = extend(opts||{},{
			x:10,			//x坐标
			y:10,			//y坐标
			border:'1px solid gray',	//边线
			backgroundColor:'white',
			html:'这是个控件',
			click:function(map){console.log('click');console.log(map);},
		});

	  // 默认停靠位置和偏移量
	  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
	  this.defaultOffset = new BMap.Size(this.opts.x, this.opts.y);
	}

	// 通过JavaScript的prototype属性继承于BMap.Control
	ZoomControl.prototype = new BMap.Control();

	// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
	// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
	ZoomControl.prototype.initialize = function(map){
		var _this = this;
	  // 创建一个DOM元素
	  var div = this.obj = document.createElement("div");
	  // 添加文字说明
	  div.innerHTML = this.opts.html;
	  // 设置样式
	  div.style.cursor = "pointer";
	  div.style.border = this.opts.border;
	  div.style.backgroundColor = this.opts.backgroundColor;
	  // 绑定事件,点击一次放大两级
	  div.onclick = function(e){
		_this.opts.click(map);
	  }
	  // 添加DOM元素到地图中
	  map.getContainer().appendChild(div);
	  // 将DOM元素返回
	  return div;
	};
	
	BMap.Map.prototype.addMeasureDisTool = function(opts){
		// 创建控件
		var myZoomCtrl = new ZoomControl({
			html:'测量',
			click:function(map){
				new BMapLib.DistanceTool(map).open();
			}
		});
		// 添加到地图当中
		map.addControl(myZoomCtrl);
	};
})();


