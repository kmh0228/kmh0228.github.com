import {
    imitateSelect
} from '../index'
import $ from 'jquery'

//imitateSelect
var data=[
    {name:'张三',id:'12岁'},
    {name:'李四',id:'8岁'},
    {name:'王五',id:'6岁'},
    {name:'赵六',id:'6岁'}
],
fnBack=function(result){
        console.log(result.name+' '+result.id);
};
imitateSelect($('#imitateSelect'),data,fnBack,
    {
        dataName:'name',//option的html
        dataId:'id',//option的value						
        fontSize:'14',//字体大小
        optionFontSize:'14',//下拉框字体大小
        textIndent:4,//字体缩进						
        color:'#000',//输入框字体颜色
        optionColor:'#000',//下拉框字体颜色
        arrowColor:'green',//箭头颜色
        backgroundColor:'#eee',//背景色颜色
        borderColor:'green',//边线颜色
        hoverColor:'green',//下拉框HOVER颜色	
        borderWidth:1,//边线宽度
        arrowBorderWidth:0,//箭头左侧分割线宽度。如果为0则不显示
        borderRadius:5,//边线圆角						
        placeholder:'请输入文字',//默认提示
        defalut:'firstData',//默认显示内容。如果是'firstData',则默认显示第一个
        allowInput:true,//是否允许输入						
        width:130,//宽
        height:26,//高
        optionMaxHeight:500//下拉框最大高度
    });

