
var http = require('http');
var querystring = require('querystring');
var options = { 
    hostname: 'https://meipin365.cn', 
//  port: 80, 
    path: '/erector/index.php?act=gree_vote&op=get_wx_config', 
    method: 'POST',
    headers:{

    }
}; 
 
var req = http.request(options, function(res) {
    res.setEncoding('utf8'); 
    res.on('data', function (chunk) { 
        console.log('BODY: ' + chunk); 
   }); 
});
req.on('error', function(e) { 
    console.log('problem with request: ' + e.message); 
}); 

   var data = querystring.stringify({
      act:'gree_vote',
      op:'get_wx_config'

   })
   req.write(data); 
   req.end();