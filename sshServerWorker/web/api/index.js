;
var proxy = require('./proxy.js');

var app = function(url,req,res,params){
    switch(url){
        case '/api/proxy':
            proxy(res,params);
        break;
        default :
            res.end('无此接口');
        break;
    }
}
module.exports = app;