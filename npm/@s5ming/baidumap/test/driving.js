import {mapInit,driving} from '../index'
window.mapInit = mapInit
window.driving = driving

//添加 执行按钮方法
const createRun = function(btn,textarea){
    (new Function(textarea.value))()
    btn.onclick = function(){
        (new Function(textarea.value))()
    }
}
createRun(document.getElementById('btn1'),document.getElementById('textarea1'))
