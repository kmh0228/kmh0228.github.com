var express = require('express');
var path = require('path');
var fs = require('fs');
// var history = require('connect-history-api-fallback');


var app = express();
var pth = path.join(__dirname,'../../../../home/s5ming/video');
app.use(express.static(pth));
app.use(express.static(path.join(__dirname,'../web/dist')));
app.use('/getList',function(req,res){
    var relist = fs.readdirSync(pth);
    res.send(JSON.stringify({
        list:relist
    }));
});
// app.use(history({
//     index:path.join(__dirname,'../web/dist/index.html'),
//     rewrites:[
//         {from:'/',to:'/index.html'}
//     ]
// }));
app.use(function(req,res){
    res.send('404 notFound');
});

app.listen(80);
