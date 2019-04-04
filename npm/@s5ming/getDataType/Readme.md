# get-data-type 获取数据类型方法
# 引入
> import getDataType from '@s5ming/get-data-type'
>

# 背景
平时用typeof获取的数据类型精准度不高,object类型涵盖了好多其他的类型,所以写了这个方法.

# 使用
```
let type = getDataType(你的数据);
// type:返回的数据类型,返回的类型种类如下
// 'number' 'string' 'function' 'array' 'json' 'boolean' 'undefined' 'null' 'object'
```
