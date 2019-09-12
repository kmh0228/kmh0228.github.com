const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
const apiProxy = proxy('',{
    target:'www.baidu.com',changeOrigin:true
});

app.use('**',apiProxy);
app.listen('3000',function(res){
    console.log('listen at 3000');
    console.log(res);
});