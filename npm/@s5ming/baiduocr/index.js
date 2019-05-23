/**
 * baiduocr 封装
 */
import {extend} from '@s5ming/json'
var baiduocr = function(opts){
    var opts = extend(opts||{},{
        key:'',
        src:'',
        success:null,   //识别成功
        error:null      //识别失败
    })

}

export default baiduocr
