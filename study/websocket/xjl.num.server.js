var webs = require('ws');
var fs = require('fs');

var wss = new webs.Server({
    port:8081,
    perMessageDeflate:{

    }
});

wss.on('connection', function connection(ws) {
    console.log('链接成功');
    console.log(ws.port);
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
  
var d = new Date();
var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  fs.readFile('xjl.data.js',function(err,data){
      var sourceString = data.toString();
      var sourceString2 = sourceString.split('=')[1];
      sourceString2 = sourceString2.replace(';','');
      var json = JSON.parse(sourceString2);
      json[date] = (json[date]||0)+1;
      var targetString = JSON.stringify(json);
      var targetString2 = sourceString.split('=')[0]+'='+targetString+';';
      fs.writeFile('xjl.data.js',targetString2,function(data){
          
      });
  });
    
   ws.on('error', function incoming(message) {
      //clearInterval(timer);
      console.log('error',message);
    });
    ws.on('close', function incoming(message) {
      //clearInterval(timer);
      console.log('close', message);
  });
});
