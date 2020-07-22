//引入express模块
var express = require('express');
var clipboardy = require('clipboardy');
 
//创建一个app对象，类似一个web 应用（网站）
var app = express();
app.get('',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.end(clipboardy.readSync());
})
//接受指定路径的请求，指定回调函数
app.listen(8910, () => console.log('get clipboardy  in port 8910!'))