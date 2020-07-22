var express = require('express');
var path = require('path');
var fs = require('fs');

//创建服务
var app = express();
//托管静态页面
app.use(express.static(path.join(__dirname,'./dist')));

//监控端口
app.listen(8888,'0.0.0.0');
console.log('server start and listen '+config.serverPost);