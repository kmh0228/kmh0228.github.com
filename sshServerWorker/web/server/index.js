var express = require('express');
var path = require('path');
var fs = require('fs');

var login = require('./user/login');
var getUserInfo = require('./user/getUserInfo');
var regist = require('./user/regist');

//创建服务
var app = express();
//托管静态页面
app.use(express.static(path.join(__dirname,'../dist')));
//获取视频列表及视频服务
var pth = path.join(__dirname,'../../../../../home/s5ming');
app.use(express.static(pth));											//托管视频文件
app.use('/getList',function(req,res){
    var relist = fs.readdirSync(path.join(pth,'./video'));
    res.send(JSON.stringify({
        list:relist
    }));
});

//获取许愿内容和写入许愿内容服务
var pth = path.join(__dirname,'../../../../home/s5ming');						//托管数据文件
app.use(express.static(pth));
var getxyqcontent = require('./api/getxyqcontent');
app.use('/api/getxyqcontent',getxyqcontent);
var addxyqcontent = require('./api/addxyqcontent');
app.use('/api/addxyqcontent',addxyqcontent);

//添加行酒令内容服务
var addxingjiulingdata = require('./api/addxingjiulingdata');
app.use('/api/addxingjiulingdata',addxingjiulingdata);

//登录请求
app.use('/api/user/login',login);
//获取个人信息
app.use('/api/user/getUserInfo',getUserInfo);
//注册账号
app.use('/api/user/regist',regist);

//找不到请求时
app.use(function(req,res){
    res.send('404 notFound');
});

//监控端口
app.listen(80);
console.log('server start and listen 80');