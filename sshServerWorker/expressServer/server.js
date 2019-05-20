//引入express模块
var express = require('express');
//创建一个app对象，类似一个web 应用（网站）
var app = express();
//托管静态文件
app.use(express.static('web/dist'))
//接受指定路径的请求，指定回调函数
app.listen(8888, () => console.log('Example app listening on port 8888!'))
