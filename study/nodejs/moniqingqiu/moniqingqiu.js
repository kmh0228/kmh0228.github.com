/**模拟请求的服务，使用页面前请把这个打开 */


var http = require('http');
var querystring = require('querystring');

var request = http.request({
    hostname:'111.202.114.53',
    post:'443',
    path:'/v2transapi',
    headers:{
        'Accept':'application/json, text/plain, */*',
        'Accept-Encoding':'gzip, deflate, br',
        'Cookie': 'BAIDUID=6CD65CD3F1710C1FD096E3AC85E8AB8F:FG=1; BIDUPSID=6CD65CD3F1710C1FD096E3AC85E8AB8F; PSTM=1555032384; delPer=0; H_PS_PSSID=1426_21090_28773_28723_28558_28831_28585_28627_28704; PSINO=2; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; locale=zh; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1555032478; Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574=1555032478; to_lang_often=%5B%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%2C%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%5D; REALTIME_TRANS_SWITCH=1; FANYI_WORD_SWITCH=1; HISTORY_SWITCH=1; SOUND_SPD_SWITCH=1; SOUND_PREFER_SWITCH=1; from_lang_often=%5B%7B%22value%22%3A%22zh%22%2C%22text%22%3A%22%u4E2D%u6587%22%7D%2C%7B%22value%22%3A%22en%22%2C%22text%22%3A%22%u82F1%u8BED%22%7D%5D'
// Accept-Language	
// zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
// Connection	
// keep-alive
// Content-Length	
// 424
// Content-Type	
// application/json;charset=utf-8
// Cookie	
// webwxuvid=7ae497687f6996297f69…iNGJc; wxpluginkey=1545380282
// Host	
// wx2.qq.com
// Referer	
// https://wx2.qq.com/?&lang=zh_CN
// User-Agent	
// Mozilla/5.0 (X11; Linux x86_64…) Gecko/20100101 Firefox/60.0
    }
},function(req){
    console.log('请求成功');
    var html = '';
    req.on('data',function(data){html+=data;console.log('body:' + data);});
    req.on('end',function(){
        console.log(html);
        console.log('end');
    })
});

request.write(querystring.stringify({
    from: 'en',
    to: 'zh',
    query: 'hello work',
    transtype: 'enter',
    simple_means_flag: 3,
    sign: 894108.608173,
    token: '647475ea00ebf2d10b0c6fd2fa321255'
}));

request.end();
