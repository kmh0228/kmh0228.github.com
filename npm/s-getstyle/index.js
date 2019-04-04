/**
 * 获取DOM元素样式的方法
 */
const getStyle = function(obj){
    return getComputedStyle?getComputedStyle(obj,false):obj.currentStyle
}
export default getStyle