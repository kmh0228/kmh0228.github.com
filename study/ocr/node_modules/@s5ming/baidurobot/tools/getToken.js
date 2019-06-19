
var qs = require('querystring');
var https = require('https');
module.exports = function(opts,fn){
    var param = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': opts.id,
        'client_secret': opts.secret
    });
    https.get(
        {
            hostname: 'aip.baidubce.com',
            path: '/oauth/2.0/token?' + param,
            agent: false
        },
        function (res) {
            var data = '';
            res.on('data',function(chat){
                data += chat
            })
            res.on('end',function(){
                fn&&fn(JSON.parse(data).access_token)
            })
        }
    );
}
