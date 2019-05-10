
import overlayFloat from './overlayFloat'
import {extend} from '@s5ming/json'

const overlayImage = function(opt){
    var opt = extend(opt || {},{
        src:null,       //图片地址
        width:10,       //图片宽度
        height:10,      //图片高度
        title:''
    })
    opt.offset = extend(opt.offset || {},{
        x: -parseFloat(opt.width / 2),
        y: -parseFloat(opt.height /2)
    })
    var image = document.createElement('img');
    image.src = opt.src;
    image.style.width = opt.width + 'px'
    image.style.height = opt.height + 'px'
    opt.title && (image.title = opt.title)
    var overlay = overlayFloat({
        point:opt.point,
        offset:opt.offset,
        zIndex:opt.zIndex,
        html:image
    })
    return overlay
}

export default overlayImage
