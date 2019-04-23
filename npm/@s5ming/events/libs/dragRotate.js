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
        var dx = 0;
        //以前的方法
        /*
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
        */
       var rx = -opts.rotateX*PIs, ry = -opts.rotateY*PIs, rz = -opts.rotateZ*PIs;     //定义各个方向的旋转角度
       console.log(rx,ry,rz);
       var op = {x:dx,y:dy,z:0};   
       var p = {x:dx,y:dy,z:0};                                                        //定义待旋转的点
       var p2 = {x:dx,y:dy,z:0};                                                       //定义旋转后的点
       //绕z线旋转
       p2.x = p.x * Math.cos(rz) + p.y * Math.sin(rz);
       p2.y = p.y * Math.cos(rz) - p.x * Math.sin(rz);
       p.x = p2.x; p.y = p2.y;
        //绕x轴旋转
        p2.y = p.y * Math.cos(rx) + p.z * Math.sin(rx);
        p2.z = p.z * Math.cos(rx) - p.y * Math.sin(rx);
        p.y = p2.y; p.z = p2.z;
        //绕y轴旋转
        p2.z = p.z * Math.cos(ry) + p.x * Math.sin(ry);
        p2.x = p.x * Math.cos(ry) - p.z * Math.sin(ry);
        p.x = p2.x; p.z = p2.z;

        //添加灵敏度
        opts.rotateX += p2.y  * opts.mouseSen;
        opts.rotateY += p2.x  * opts.mouseSen;
        opts.rotateZ += p2.z  * opts.mouseSen;
        container.style.WebkitTransform='perspective(800px) rotateY('+opts.rotateY+'deg) rotateX('+opts.rotateX+'deg) rotateZ('+opts.rotateZ+'deg)';
    });

}
