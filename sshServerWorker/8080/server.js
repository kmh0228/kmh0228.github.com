var https=require('https');
var n = 0;
var server=https.createServer(options, function (req, res) {//要是单纯的https连接的话就会返回这个东西
    n++;
    console.log('收到一个请求,' + n);
    res.end("请求成功.152.136.79.68:8080");
});
server.listen(8080);
