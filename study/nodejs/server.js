var http = require('http');

var server = http.request({
  host:'www.baidu.com'
},function(req){
  var html = '';
  req.on('data',function(data){html+=data;});
  req.on('end',function(){
    console.log(html);
  })
});

server.end();