var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();													//创建应用
app.use(express.static(path.join(__dirname,'../web/dist')));			//托管页面静态文件

//获取视频列表及视频服务
var pth = path.join(__dirname,'../../../../home/s5ming');
app.use(express.static(pth));											//托管视频文件
app.use('/getList',function(req,res){
    var relist = fs.readdirSync(path.join(pth,'./video'));
    res.send(JSON.stringify({
        list:relist
    }));
});

//获取许愿内容和写入许愿内容服务
var datapth = path.join(__dirname,'./data');							//托管数据文件
app.use(express.static(pth));
var getxyqcontent = require('./libs/getxyqcontent');
app.use('/api/getxyqcontent',getxyqcontent);
var addxyqcontent = require('./libs/addxyqcontent');
app.use('/api/addxyqcontent',addxyqcontent);

//添加行酒令内容服务
var addxingjiulingdata = require('./libs/addxingjiulingdata');
app.use('/api/addxingjiulingdata',addxingjiulingdata);


app.use(function(req,res){
    res.send('404 notFound');
});

app.listen(9999);
//app.listen(80);   //改成80布到服务器上。
