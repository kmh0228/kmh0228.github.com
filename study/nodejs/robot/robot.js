
//将鼠标移动到屏幕上作为正弦波。
var robot = require(“robotjs”);
 
//加速鼠标。
robot.setMouseDelay(2);
 
var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height =(screenSize.height / 2) -  10;
var width = screenSize.width;
 
for(var x = 0; x <width; x ++)
{
    y =高度* Math.sin((twoPI * x)/宽度)+高度;
    robot.moveMouse(x，y);
}