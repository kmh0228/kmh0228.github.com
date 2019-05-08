/**
 * 自定义 固定宽高覆盖物
 */
;import {extend} from '@s5ming/json' 
;var OverlayFloat = function (opt){
    this.opt = extend(opt||{},{
        point:new BMap.Point(116.404, 39.915),
        offset:{x:10,y:10},
        zIndex:0,
        html:null           //覆盖物标签
    })
    this._div = document.createElement("div");
}
OverlayFloat.prototype = new BMap.Overlay();
OverlayFloat.prototype.initialize = function(map){
    this._map = map;
    var div = this._div;
    div.style.position = "absolute";
    div.style.zIndex = this.opt.zIndex || BMap.Overlay.getZIndex(this.opt.point.lat);
    this.setHTML(this.opt.html);
    this._map.getPanes().floatPane.appendChild(div);
    this.draw();
    return div;
}
OverlayFloat.prototype.draw = function(){
    var point = this.opt.point;
    var map = this._map;
    var overlayWidth=parseInt(this._div.offsetWidth);
    var overlayHeight=parseInt(this._div.offsetHeight);
    var cli=map.getSize();
    var cliWidth=parseInt(cli.width);
    var cliHeight=parseInt(cli.height);
    var pos=map.pointToPixel(point);
    var left=pos.x;
    var top=pos.y;
    var dx=this.opt.offset.x,dy=this.opt.offset.y;
    if(left+dx+overlayWidth>cliWidth){
        dx=-dx-overlayWidth; 
    }
    if(top+dy+overlayHeight>cliHeight){
        dy=cliHeight-overlayHeight-4;
    }
    var pixel = map.pointToOverlayPixel(point);
    this._div.style.left = pixel.x +dx + "px";
    this._div.style.top  = pixel.y +dy + "px";
}
  
OverlayFloat.prototype.setHTML=function(html){
    this.opt.html = html;
    var inner;
    if(typeof html == 'function'){
        inner = html()
    }else{
        inner = html;
    }
    if(typeof inner == 'string'){
        this._div.innerHTML = inner
    }else{
        this._div.appendChild(inner)
    }
}

OverlayFloat.prototype.setPoint=function(point){
    this.opt.point=point;
    this.draw();
}

OverlayFloat.prototype.show = function(){
    this._div.style.display = 'block'
}

OverlayFloat.prototype.hide = function(){
    this._div.style.display = 'none'
}


export default function (){
    return new OverlayFloat(...arguments)
}
