/**
 * 在地图上画覆盖物的工具
 * 需要先引入工具 <script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>
 */
// 
 import {extend} from '@s5ming/json'
var MapDrawOverlay = function(map,opts){
    if(!map)return;
    var opts = this.opts = extend(opts,{
        type:'rectangle',		//默认形状
        drawEnd:function(e){},
        style:{
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.6,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
    });
    
    this.drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        /*drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },*/
        //circleOptions: opts.style, //圆的样式
        //polylineOptions: opts.style, //线的样式
        //polygonOptions: opts.style, //多边形的样式
        rectangleOptions: opts.style //矩形的样式		
  });
  
  var _this = this;
  this.drawingManager.addEventListener('overlaycomplete',function(e){
      _this.opts.drawEnd(e.overlay);
      _this.close();
  });
  
};

MapDrawOverlay.prototype.open = function(str){
    this.opts.type = str || this.opts.type;
    this.drawingManager.setDrawingMode(this.opts.type);
    this.drawingManager.open();
};

MapDrawOverlay.prototype.close = function(){
    this.drawingManager.close();
};

var mapDrawOverlay = function(map,opts){
    return new MapDrawOverlay(map,opts);
};

export default mapDrawOverlay
