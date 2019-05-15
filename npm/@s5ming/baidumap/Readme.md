# baidumap 的一些相关工具
使用时请先在public/index.html里添加百度地图的引用,注意要加入你的秘钥
```
<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak=你的秘钥&services=&t=20180102152545"></script>
```
# 引入
> import {mapInit,mapSetStyle,overlayFloat} from '@s5ming/baidumap' //用到哪个引入哪个
>

# 使用说明
### mapInit
在一个容器里初始化一个地图
```
var map = mapInit({
    container:null,							//容器,原生对象,在vue中可以用this.$refs.dom指向容器
    center:{lng:116.404,lat:39.915},			//默认中心点位置
    zoom:12,									//默认地图等级
    currentcity:'北京',							//地图当前显示的城市
    enableScrollWheelZoom:true,					//是否让地图随滚轮缩放
    navLoc:{x:0,y:20},							//地图层级控制插件的位子
    style:0,                                    //地图默认样式,具体数值输入请参照下面的mapSetStyle的style参数
    load:function(map){...}                     //地图加载完成调用的方法
});
```
### mapSetStyle
给地图添加样式
```
mapSetStyle(map,style)
    // @params map : 你要修改样式的地图
    // @params style : 样式,支持格式如下
        字符串格式:'normal','light','dark','redalert','googlelite','grassgreen','midnight','pink','darkgreen','bluish','grayscale','hardedge'  分别对应> 默认地图样式,清新蓝风格,黑夜风格,红色警戒风格,精简风格,自然绿风格,午夜蓝风格,浪漫粉风格,青春绿风格,清新蓝绿风格,高端灰风格,强边界风格
        数字格式:输入数字则代表以上几种风格的下标,例如0则标示'normal' 默认地图样式
        数组格式:参照 [地图样式在线编辑器](http://lbsyun.baidu.com/custom/)
```
### overlayFloat
自定义地图覆盖物,大小固定,不会随着地图而变化
```
参数如下:
var overlay = overlayFloat({
    point:new BMap.Point(116.404, 39.915),      //默认覆盖物左上角位置
    offset:{x:10,y:10},                         //默认覆盖物左上角与位置的偏差
    html:null                                    //覆盖物的内容,可以为字符串,或者docment.create出来的dom,或者function({return 字符串/dom}
    zIndex:0                                     //覆盖物层级
})
方法如下:
overlay.setHTML(html)       //修改覆盖物内容
overlay.setPoint(point)     //修改覆盖物坐标
overlay.show()              //显示覆盖物
overlay.hide()              //隐藏覆盖物

`注意: 此覆盖物与地图其他覆盖物一样,需要map.addOverlay方法添加到地图上`

```
### overlayImage
如果自定义覆盖物封装的图片添加到地图的方法,大小固定,不会随着地图而变化
```
参数如下:
var image = overlayFloat({
    point:new BMap.Point(116.404, 39.915),      //默认覆盖物左上角位置
    offset:{x:10,y:10},                         //默认覆盖物左上角与位置的偏差,默认位置在图片中间
    zIndex:0,                                    //覆盖物层级
    src:url,                                    //图片地址,在webpack项目中注意不能用路径,编译会使路径失效
    width:num,                                  //图片宽度
    height:num,                                  //图片高度
    title:''                                     //image的title属性
})
方法如下:
image.setPoint(point)     //修改覆盖物坐标
image.show()              //显示覆盖物
image.hide()              //隐藏覆盖物

`注意: 此覆盖物与地图其他覆盖物一样,需要map.addOverlay方法添加到地图上`

```

### mapDrawOverlay
在地图上画图的工具,目前只支持画矩形,因为工作需要,所以只写了矩形. 我的代码都是源码上传的,如有需要可自行修改扩展
使用此插件前,需要先引入BMapLib工具
```
引入BMapLib
<script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>

参数如下:
var mapDarwTool = mapDrawOverlay(map,{
    type:'rectangle',		    //绘制形状,默认 矩形
    drawEnd:function(e){},      //绘制完成后的回调函数,参数是绘制出来的覆盖物
    style:{                    //绘制的覆盖物的基本样式
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.6,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
})
方法如下:
mapDarwTool.open(type)       //开始绘制模式, @params type:绘制形状
mapDarwTool.close()     //关闭绘制模式

`注意: 实例化此工具之后,需要调用 open 方法,才能开始绘制`

```
### driving
在地图上索引道路的工具
快速使用: driving(map).search()
```
参数如下:
var driv = driving(map,{        //第一个参数是map,地图对象,第二个是json参数,具体key如下
    autoViewport:true,          //检索结束后是否自动调整地图视野,默认ture
    policy:'BMAP_DRIVING_POLICY_LEAST_TIME',                           //驾车方案策略
    searchEnd:function(DrivingRouteResult){console.log('searchend')},                 //搜索结束触发的回调事件
    setMarkerStyle:function(markers){console.log('markers',markers)},      //标注设置好之后的回调事件
    setlineStyle:function(lines){console.log('lines',lines)},    //线路添加之后的触发的回调事件
})
方法如下:
driv.search(start,end)       //开始搜寻路线, @params start:起始点, end:终点

`注意: 实例化此工具之后,需要调用 search 方法,才能开始绘制路线`

```
[驾车方案策略参照](http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html#a7b19)

### getCoverPoint
获取多个点的最大小经纬度的方法
```
参数如下:
var result = getCoverPoint(points) //points为坐标点的数组
result格式:{
    minLng:0,
    maxLng:0,
    minLat:0,
    maxLat:0
}

```

### baiduPoints
因为工作经常应对各种各样的坐标格式,所以统一了此方法把其他格式的转成baidu格式的
```
参数如下:
var points = baiduPoints([point,point,...]) //point为坐标点
// 如上,参数是个数组,
    point可以是的格式
    1.[num,num]   长度为2的数组,转换时把第一个当成lng,第二个当成lat
    2.{lng:num,lat:num}  坐标格式
    2.{lon:num,lat:num}  在找不到lng的时候,该方法会自动寻找lon来替代lng
返回结果points:
    BMap.Point实例化的点的数组
```

### polylineTool
关于折线覆盖物的一些方法
```
方法:
polylineTool.getLength(polyline,map) //获取线路polyline覆盖物的总里程,单位米
    //注意:map尽量填写,如果不填写,请尽量保证覆盖物已经添加到地图
polylineTool.disGetPoiont(polyline,distance,map) //获取到起点distance米的点的坐标
    //distance 为到起点的距离,也可以为字符串百分数
polylineTool.connectPolyline(polylines) //把多个polyline合成一个polyline的方法
    //polylines:poleyline覆盖物的数组. 
    //返回的是一个polyline覆盖物,默认样式和状态为第一个polyline的, 注意:此方法毁掉了原来的polyline数组
```

### toBaiduPoint
把其他坐标转换成百度坐标的方法,使用前请引用文章开头所写的js
```
// 参数
toBaiduPoint(points,fn,opts)
    @params points : 需要转换的坐标数组
    @params fn:   转换完成后的回调函数, 回调参数是转换后的百度坐标数组
    @params opts :{     相关设置参数
        pici:10,			//每次发送多少个转换请求,建议10个
        num:10,				//每个转换请求有多少数据。根据你的key的配置来,我的是最大10个
        from:1,				//数据源类型 原GIS坐标from为1, 其他高德，谷歌等from为3
    }

```

