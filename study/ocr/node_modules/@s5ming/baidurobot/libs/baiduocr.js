
var https = require('https');
var qs = require('querystring');
var extend = require('../tools/extend');
var getToken = require('../tools/getToken');

function imgToText(opts){
    var token = opts.token || '';
    var json = {};
    if(opts.url){
        json.url = opts.url;
    }else if(opts.image){
        json.image = opts.image;
    }
    var success = opts.success || null;
    var data = qs.stringify(json);
    var req = https.request(
        {
            hostname: 'aip.baidubce.com',
            path: '/rest/2.0/ocr/v1/general_basic?access_token=' + token,
            agent: false,
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
                // 'Accept': 'application/json, text/plain, */*',
                // 'Accept-Encoding': 'gzip, deflate, br',
                // 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                // 'Connection': 'keep-alive',
                // 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
            }
        },
        function (res) {
            var data = '';
            res.on('data',function(chat){
                data += chat
            })
            res.on('end',function(){
                success&&success(data)
            })
        }
    );
    req.write(data);
    req.end();
}

module.exports = function(opts2){
    var opts = extend(opts2 || {},{
        id:'',
        secret:'',
        image:'',
        url:'',
        success:null
    })
    if(!(opts.id&&opts.secret)){
        console.error('baiduocr id & secret 不可以为空')
        return;
    }
    getToken(opts,function(token){
        opts.token = token;
        console.log('token: ' + token)
        imgToText(opts)
    })
}


