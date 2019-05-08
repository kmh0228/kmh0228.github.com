# 关于json的一些工具
# 引入
> import {extend} from '@s5ming/json'
>

# 使用说明
## extend
```
var newJson = extend(
    opts 你写入的json参数
    defau 默认的参数,当opt没有此key的时候,将会在defau里找
    config 配置参数{ //可不填写
        exclude:[字段]   此字段强制使用默认的字段
    }
)
```
## parse
```
var json = parse(str)
//将字符串转成json,写它主要是因为JSON.parse不支持key不加引号的情况.这个支持
//但是这有个bug,就是value里有分号或者逗号的时候会出现异常.慎用.这个bug等我想修复的时候在修复吧 ~v~
```