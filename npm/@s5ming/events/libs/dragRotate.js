/**
 * 拖拽旋转事件
 */
var dragRotate = function(container,fn,opts){
    var opts = opts || {};
    opts.rotateX = opts.rotateX || 0;
    opts.rotateY = opts.rotateY || 0;
    opts.rotateZ = opts.rotateZ || 0;
    opts.mouseSen = opts.mouseSen || 1;
        
    var scale,scale2;
    var PIs=Math.PI/180;
    drag(container,function(){
    },function(dx,dy){
        var dydeg=opts.rotateY%360;
        if(dydeg<0){dydeg+=360;}
        if(dydeg>180){dydeg=360-dydeg;}
        //scale=(90-(dydeg))/90;
        scale=Math.cos(dydeg*PIs);
        var dydeg2=opts.rotateY%360;
        if(dydeg2<0){dydeg2+=360;}
        if(dydeg2>270){dydeg2=540-dydeg2;}else if(dydeg2<90){dydeg2=180-dydeg2;}
        //scale2=(180-dydeg2)/90;	
        scale2=Math.sin(dydeg2*PIs);
        opts.rotateY+=(dx*opts.mouseSen);
        opts.rotateX-=(dy*opts.mouseSen*scale);
        //if(opts.rotateX>45){opts.rotateX=45;}else if(opts.rotateX<-45){opts.rotateX=-45;}
        opts.rotateZ-=(dy*opts.mouseSen*scale2);
        //if(opts.rotateZ>45){opts.rotateZ=45;}else if(opts.rotateZ<-45){opts.rotateZ=-45;}
        container.style.WebkitTransform='perspective(800px) rotateY('+opts.rotateY+'deg) rotateX('+opts.rotateX+'deg) rotateZ('+opts.rotateZ+'deg)';
    });

}
