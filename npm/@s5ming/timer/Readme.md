# 关于计时器的一些工具
# 引入
> import {interval} from '@s5ming/timer'
>

# 使用说明
## interval
```
    //定义
    var inter = interval({
        start: 起始数值
        end: 终止数值
        speed: 速度 (每30毫秒增加的数值): speed 与 time 只填写一个就可以了,因为他们之间是换算关系,如果填了两个则无视time
        time:  动作总用时 单位毫秒
        cb:     数值改变时的回调函数,参数是当时数值
        endfn:    结束的时候的回调函数,参数是当前值
        loop:      是否循环
    });
    //方法:
    inter.start()  开始
    inter.end()     结束
```