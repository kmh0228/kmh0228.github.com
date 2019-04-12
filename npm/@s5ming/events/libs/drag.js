/**
 * create by s5ming
 * qq 1150123276
 * obj为id或者原生对象
 * 如果只有给了两个参数,则第二个参数默认是fnmove, fndown 不传入的话fnup必须不传入
 */
var drag = function(obj,fndown,fnmove,fnup){
    if(!obj)return;
    var obj = document.getElementById(obj)?document.getElementById(obj):obj;
    if(arguments.length==2){
        var fnmove=fndown;
        fndown=null;
    }
    var mousedown=function(ev){
        var oEvent = ev||event;
        var oldX = oEvent.clientX;
        var oldY = oEvent.clientY;
        fndown&&fndown();
        var mousemove=function(ev){
            var oEvent = ev||event;
            var newX = oEvent.clientX;
            var newY = oEvent.clientY;
            fnmove&&fnmove(newX-oldX,newY-oldY);
            oldX=newX;oldY=newY;
        };
        document.addEventListener('mousemove',mousemove);			
        var mouseup=function(){
            document.removeEventListener('mousemove',mousemove);
            document.removeEventListener('mouseup',mouseup);
            fnup&&fnup();
            obj.releaseCapture&&obj.releaseCapture();
        };
        document.addEventListener('mouseup',mouseup);
        obj.setCapture&&obj.setCapture();
        ev.preventDefault();
    };
    obj.addEventListener('mousedown',mousedown);
};

export default drag;
