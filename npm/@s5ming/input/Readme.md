# 关于表单的一些方法
# 引入
> import { imitateSelect } from '@s5ming/input'
>
此插件是我早些时间发布在jq22上的,现转到此 [jq22实例](http://www.jq22.com/yanshi14788)

# 使用说明

## imitateSelect
创建一个模拟下拉框
```
//创建 & 参数
var select = imitateSelect(obj,data,fn,opts)
    @params obj : jquery对象,注意是`jquery`对象
    @params data : 下拉框里的数据(数据)，数组里可以是值，也可以是json，如果是json有对应的dataName和dataId
    @params fn  :  回掉函数 参数为 {name:name,id:id}//name是输入框内容  id是隐藏value
    @params opts : {        //配置参数,具体如下
        dataName:'name',    //数据的的name字段
        dataId:'id',        //数据的value字段					
        fontSize:'14',      //字体大小
        optionFontSize:'14',//下拉框字体大小
        textIndent:4,//字体缩进						
        color:'#000',//输入框字体颜色
        optionColor:'#000',//下拉框字体颜色
        arrowColor:'green',//箭头颜色
        backgroundColor:'#ccc',//背景色颜色
        borderColor:'green',//边线颜色
        hoverColor:'green',//下拉框HOVER颜色						
        borderWidth:1,//边线宽度
        arrowBorderWidth:0,//箭头左侧分割线宽度。如果为0则不显示
        borderRadius:5,//边线圆角						
        placeholder:'请输入文字',//默认提示
        defalut:'firstData',//默认显示内容。如果是'firstData',则默认显示第一个
        placeId:''	,//输入不是下拉框内容的值时返回的id
        retur:false,//是否阻止在建立数据后调用回掉函数
        allowInput:true,//是否允许输入						
        width:130,//宽
        height:26,//高
        optionMaxHeight:500//下拉框最大高度
        iwidth:height//右侧下拉按钮的宽度,默认跟高度一样
    }
//方法
select.changeList(data,opts) 改变数据,data为数据，opts为参数{retur:false;//是否阻止在建立数据后调用回掉函数}
select.changeFnBack(fn)  改变回掉函数
select.getResult()       获取当前选择项	
select.close()           隐藏下拉框
select.setValue(name)		设置框内的值
```
