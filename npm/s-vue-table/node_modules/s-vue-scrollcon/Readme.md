# s-vue-scrollcon 基于vue的带滚动条的容器组件
# 引入
> import vue-scrollcon from 's-vue-scrollcon'
>


# 使用说明
```
//引入后在vue的components里添加此组件
components:{...,vue-scrollcon}
//然后在template里直接利用此组件就可以
<vue-scrollcon>slot内容</vue-scrollcon>
```
# 参数
参数|参数说明
--------|--------
height|容器高度,可以给固定的数值,不给的话就默认100%
rollerConfig|{width:...,...}滚动条的配置参数,JSON格式,具体的key和value参照 [s-vue-scrollbar参数](https://www.npmjs.com/package/s-vue-scrollbar) 其中的rollerHeight,show舍弃

`想出现滚动条,用这个组件包住就可以了`