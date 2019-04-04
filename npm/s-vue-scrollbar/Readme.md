# vue-scrollbar 基于vue的滚动条组件
# 引入
> import vue-scrollbar from 's-vue-scrollbar'
>

# 背景
之前写过一个滚动条组件,配置参数有什么起点,终点,当前显示的范围等等,感觉好麻烦.后来改动成只用一个0-1的小数代表此滚动条表达的值.样式利用calc计算,完全不用关注滚动条容器的大小变化等因素. 目前工作需要, 就用vue实现了一个

# 使用说明
```
//引入后在vue的components里添加此组件
components:{...,vue-scrollbar}
//然后在template里直接利用此组件就可以
<vue-scrollbar></vue-scrollbar>
```
# 参数
参数|参数说明
--------|--------
width|滚动条宽度,默认3
containerColor|滚轮槽颜色,默认#006
rollerBorder|滚动条边线样式 默认 '1px solid green'
rollerColor|滚动条颜色 默认 #fff
defalutScale|默认滚动状态,默认0,取值: 0-1
rollerHeight|滚动条高度，默认 20
rollerSen|滚动的灵敏度 默认 0.01
show|是否显示,默认 true

# 事件
scroll : 拖拽滚动条或者滚轮触发滚动条的时候触发的事件.参数是一个 0-1 的状态数值

# 其他说明
1. 此滚动条目前不提供设置高度的方法,默认高度是父级的高度
2. 如果想在别的dom上滚动触发此滚动条的滚动效果,请手动调用此方法的wheel方法,并将dom的wheel方法的参数作为调用参数给此组件的wheel方法.例如
```
<template>
    <div  @wheel.prevent="wheel" style="height:100px">
        <div></div>
        <regoinRoller ref="regoinRoller" style="position:absolute;top:0;right:0;" @scroll="scroll"></regoinRoller>
    </div>
</template>
<script>
import regoinRoller from './regoinRoller'
export default {
    components:{
        regoinRoller
    },
    methods:{
        scroll(pre){
            console.log(pre)
        },
        wheel(arg){
            this.$refs.regoinRoller.wheel(arg)
        }
    }
}
```