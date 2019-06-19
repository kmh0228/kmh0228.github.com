
var https = require('https');
var extend = require('../tools/extend');
var getToken = require('../tools/getToken');

function getBackSay(opts){
    var json = extend(opts || {},{
        'log_id': 'UNITTEST_10000',
        'service_id': 'S18930',
        'say':'这里是说话的地方',
        'user_id': '88888'
    });
    var token = json.token;
    var success = opts.success || null;
    var data = JSON.stringify({
        'log_id': json.log_id,
        'version': '2.0',
        'service_id': json.service_id,
        'session_id': '',
        'request': {
            'query': json.say,
            'user_id': json.userid
        },
        'dialog_state': {
            'contexts': {
                'SYS_REMEMBERED_SKILLS': ['1057']
            }
        }
    });
    var req = https.request(
        {
            hostname: 'aip.baidubce.com',
            path: '/rpc/2.0/unit/service/chat?access_token=' + token,
            agent: false,
            method:'POST',
            headers:{
                'Content-Type':'application/json',
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
        getBackSay(opts)
    })
}


