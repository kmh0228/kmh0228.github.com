# 基于vue的表格组件
# 引入
> import s-vue-table from 's-vue-table'
>

# 说明
因工作需要表格组件,但是使用的iview组件的表单滚动条使用的是浏览器的滚动条,无法自定义样式,就自己写了个table组件,后续根据功能需求会继续完善此组件.
# 使用说明
```
//引入后在vue的components里添加此组件
components:{...,s-vue-table}
//然后在template里直接利用此组件就可以
<s-vue-table></s-vue-table>
```
# 参数
参数|参数说明
--------|--------
columns|表格首行信息,格式 [{title:'标题名称',key:'对应的关键字',className:'此列的类名'},...]
data|表格内容信息,格式[{关键字:'内容',关键字:'内容'...},...]
height|表格高度,默认600
rowClassName|每行的类名定义,是个回调函数,参数是 rowData:当前行的数据
rollerConfig|{width:...,...}滚动条的配置参数,JSON格式,具体的key和value参照 s-vue-scrollbar参数 其中的rollerHeight,show舍弃

#方法
dataClick
使用:<s-vue-table @dataClick="dataClick"></s-vue-table>
参数说明:
dataClick(rowData,key){
    rowData:你点击行的数据
    key:你点击个那个数据对应的key
}