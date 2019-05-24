
//将鼠标移动到屏幕上作为正弦波。
var robot = require('robotjs');
 
//加速鼠标。
// robot.setMouseDelay(2);
// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height =(screenSize.height / 2) -  10;
// var width = screenSize.width;
// for(var x = 0; x <width; x ++)
// {
//     const y =height* Math.sin((twoPI * x)/width)+height;
//     robot.moveMouse(x,y);
// }

// var str = 'hello';
// var str2 = 'how are you';
// setTimeout(function(){
//     for(var i=0;i<str.length;i++){
//         (function(index){
//             setTimeout(function(){
//                 robot.typeString(str[index]);
//             },index*300)
//         })(i);
//     };
// },5000);

// setTimeout(function(){
//     for(var i=0;i<str2.length;i++){
//         (function(index){
//             setTimeout(function(){
//                 robot.typeString(str2[index]);
//             },index*300)
//         })(i);
//     };
// },12000);

var time = 20;
var writeTime = 50;
var interval;
var tmt = function(time,fn){
    var timeout = setTimeout(function(){
        clearTimeout(timeout);
        fn&&fn()
    },time)
}
tmt(3000,function(){
    
    function oneCZ(){
        robot.keyTap('f3');         //点击f3
        tmt(3000,function(){         //100毫秒后按删除按钮
            robot.keyTap('delete');
            tmt(50,function(){      //40毫秒后按enter按钮
                robot.keyTap('enter');
                tmt(50,function(){  //40毫秒后重复执行操作
                    oneCZ()
                })
            })
        })
    }
    oneCZ()
    // robot.keyToggle('alt','down');
    // setTimeout(function(){
    //     robot.keyTap('tab');
    //     setTimeout(function(){
    //         robot.keyToggle('alt','up');
    //         setTimeout(function(){
    //             robot.typeString('ruguoshuziduoleshibushishijianjiuahuidnajidfiajkrjajirjakjri再来几个中文');
    //         },writeTime);
    //     },time);
    // },time);
    
    
});
