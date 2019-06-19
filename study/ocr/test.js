
var baiduRobot = require('@s5ming/baidurobot');
var fs = require('fs');
var robot = require('robotjs');
var bmp = require('binary-bmp');

var imagebitmap = robot.screen.capture(0,205,380,90);
// var rgbdata = [];
// var imagebitmapdata = imagebitmap.image;
// var length = imagebitmapdata.length;
// for(var i = 0;i<length;i+=4){
//     rgbdata.push(imagebitmapdata[i]);
//     rgbdata.push(imagebitmapdata[i+1]);
//     rgbdata.push(imagebitmapdata[i+2]);
// };
var rgbbitmap = new bmp(32,{
    width:imagebitmap.width,
    height:imagebitmap.height,
    data:imagebitmap.image
});
var imagebase64 = rgbbitmap.bgr().getBase64().substring(22);
console.log(rgbbitmap);
console.log(imagebase64);
var ocr = baiduRobot.baiduocr
ocr({
    id:'LnKXXtRaCxd3pRNfdu93R4tK',                  // API Key
    secret:'0ddKdUr1Xhvv8vfhNnBxsxPGiQHrjuC9',              // secret key
    image:imagebase64,               //图片,需要 urlencoded,
    success:function(result){
        console.log(result)
    }            //成功的回调函数,参数参照baidu文字识别文档
});
