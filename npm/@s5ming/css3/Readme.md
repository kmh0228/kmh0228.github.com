# css3 样式处理的方法
# 引入
> import {setCss3Style,setTransform} from '@s5ming/events'
>

# 使用说明
### setCss3Style
给某个对象添加css3样式
```
setCss3Style(obj,styleJson)
    // @params obj : 原生对象
    // @params styleJson : 需要添加的样式,格式 : {csskey:cssvalue}
```
### setTransform
给某个对象添加transform样式
```
setTransform(obj,trans)
    // @params obj : 原生对象
    // @params trans : 需要添加的transform对应的数值,格式 : {
            tx: x平移, ty: y平移, tz: z平移,
            rx: x轴旋转, ry: y轴旋转, rz: z轴旋转
        }
```

