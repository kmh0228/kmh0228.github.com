
var http = require('http');
var options = { 
    hostname: 'http://74.82.214.56', 
    port: 8080, 
    path: '/api/getVoice?words=哈哈', 
    method: 'POST' 
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

   req.write('data\n'); 
   req.write('data\n'); 
   req.end();