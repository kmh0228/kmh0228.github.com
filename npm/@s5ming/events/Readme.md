# 事件处理的方法
# 引入
> import {on,off,drag,keydown} from '@s5ming/events'
>

# 使用说明
### on
```
on(element, event, handler)         //绑定事件
```
### off
```
off(element, event, handler)        //解绑事件
```
### drag
```
drag(obj,fndown,fnmove,fnup)        //拖拽事件
    // @params obj : 原生对象或者id
    // @params fndown : 鼠标按下触发调用的方法 无参数 可不填,但不填的时候fnup也不可填
    // @params fnmove : 鼠标移动触发调用的方法 参数dx,dy(移动距离,相对于上次触发移动事件时的位子)
    // @params fnup : 鼠标按下触发调用的方法 无参数 可不填
```
### keydown
```
keydown(obj,keyarr,fn)
    // @params obj : 原生对象,可不填,不填则默认document
    // @params keyarr : 按键数组,内容支持 'Shift,'Ctrl','Alt'和字母, 最多支持三个键,最多只能有一个是字母
    // @params fn : 按键数组里的键都按下的时候触发的事件
```
### wheel
```
wheel(obj,fn)
    // @params obj : 原生对像
    // @params fn : 滚动鼠标时触发的事件,参数为滚动方向向下/向上 ture/fase
```
### inputchange
```
inputchange(obj,fn)
    // @params obj : 原生对像
    // @params fn : 表单内容更改时触发的事件,参数新的内容
```