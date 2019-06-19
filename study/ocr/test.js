
var baiduRobot = require('@s5ming/baidurobot');
var fs = require('fs');
var robot = require('robotjs');

var imagebitmap = robot.screen.capture(0,0,500,500);

var ocr = baiduRobot.baiduocr
ocr({
    id:'LnKXXtRaCxd3pRNfdu93R4tK',                  // API Key
    secret:'0ddKdUr1Xhvv8vfhNnBxsxPGiQHrjuC9',              // secret key
    image:imagebitmap,               //图片,需要 urlencoded,
    success:function(result){
        console.log(result)
    }            //成功的回调函数,参数参照baidu文字识别文档
});
