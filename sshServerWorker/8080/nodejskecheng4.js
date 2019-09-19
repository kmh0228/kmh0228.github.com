/** express */

var express = require('express');
var path = require('path');

var app = express();

app.use(function(req,res,next){
    next();
});

app.use('/getUrl',function(req,res){
    res.end('getsha');
});

app.use(function(req,res){
    res.end('haha');
});

app.listen(8000);
