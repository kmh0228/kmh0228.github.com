var express = require('express');
var path = require('path');
var fs = require('fs');



var app = express();

app.use(express.static(path.join(__dirname,'./test')));

app.use('/getList',function(req,res){
    var relist = fs.readdirSync('./test');
    res.send(JSON.stringify({
        list:relist
    }));
});

app.use(function(req,res){
    res.send('404 notFound');
});

app.listen(9999);
