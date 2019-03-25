var webs = require('ws');

var wss = new webs.Server({
    port:8080,
    perMessageDeflate:{

    }
});

wss.on('connection', function connection(ws) {
    console.log('链接成功');
    console.log(ws.port);
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
   var timer = setInterval(function(){
      console.log('发送something');
        ws.send('something');
   },1000);
   ws.on('error', function incoming(message) {
      clearInterval(timer);
      console.log('error',message);
    });
    ws.on('close', function incoming(message) {
      clearInterval(timer);
      console.log('close', message);
  });
});
