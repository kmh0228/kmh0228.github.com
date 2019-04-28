# baidumap 的一些相关工具
使用时请先在public/index.html里添加百度地图的引用,注意要加入你的秘钥
```
<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak=你的秘钥&services=&t=20180102152545"></script>
```
# 引入
> import {mapInit,mapSetStyle} from '@s5ming/baidumap'
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
    html:null                                    //覆盖物的内容
})
方法如下:
overlay.setHTML(html)       //修改覆盖物内容
overlay.setPoint(point)     //修改覆盖物坐标
overlay.show()              //显示覆盖物
overlay.hide()              //隐藏覆盖物

`注意: 此覆盖物与地图其他覆盖物一样,需要map.addOverlay方法添加到地图上`

```
