
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
setTimeout(function(){
    //robot.keyTap('enter');
    robot.keyToggle('alt','down');
    setTimeout(function(){
        robot.keyTap('tab');
        setTimeout(function(){
            robot.keyToggle('alt','up');
            setTimeout(function(){
                robot.typeString('ruguoshuziduoleshibushishijianjiuahuidnajidfiajkrjajirjakjri再来几个中文');
            },writeTime);
        },time);
    },time);
    
    
},3000);
