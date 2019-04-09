;
var httpProxy = require('http-proxy');
var proxyserver = httpProxy.createProxyServer({});
proxyserver.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    res.end('can not link server :'+params.url);
});

var proxy = function(req,res,params){
    proxyserver.on('proxyReq', function(proxyReq, req, res, options) {
        proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
    });
    //转发请求
    try{
        proxyserver.web(req, res, {
            target: params.url
        });
    }catch(e){
        res.end('can not link server :'+params.url);
    }
};
module.exports = proxy;