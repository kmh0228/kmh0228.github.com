;
var http = require('http');
var querystring = require('querystring');

var proxy = function(res,params){
    console.log(querystring.stringify(params.reqData));
    var request = http.request({
        hostname:params.hostname,
        post:params.post || 80,
        path:params.path || '/',//+querystring.stringify(params.reqData),
        method:'POST',
        headers:params.headers || {}
    },function(req){
        var html = '';
        req.on('data',function(data){html+=data;});
        req.on('end',function(){
            res.end(html);
        });
        req.on('error',function(){
            res.end('request error : ' + params.hostname);
        })
    });
    
    request.end();
};
module.exports = proxy;