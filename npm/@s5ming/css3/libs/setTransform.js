
import {forEach} from '@s5ming/array'
const isBe = function(data){
    return typeof data != 'undefined'
}
const setTransform = function(obj,trans){

    //设置样式
    var transformstyle='';
    transformstyle+=isBe(trans.tx)?'translateX('+trans.tx+'px) ':'';
    transformstyle+=isBe(trans.ty)?'translateY('+trans.ty+'px) ':'';
    transformstyle+=isBe(trans.tz)?'translateZ('+trans.tz+'px) ':'';
    transformstyle+=isBe(trans.rx)?'rotateX('+trans.rx+'deg) ':'';
    transformstyle+=isBe(trans.ry)?'rotateY('+trans.ry+'deg) ':'';
    transformstyle+=isBe(trans.rz)?'rotateZ('+trans.rz+'deg) ':'';
    
    forEach([
        'WebkitTransform',		// chrome，safari 内核
        'MozTransform',			// firefox 内核
        'MsTransform',			// ie 内核
        'OTransform',			// opera 内核
        'transform',			// 默认
    ],function(s){
        
        obj.style[s]=transformstyle;
        
    });
}
export default setTransform
