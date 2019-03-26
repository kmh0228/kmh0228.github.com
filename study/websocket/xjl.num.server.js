var https=require('https');
var ws=require('ws');
var fs=require('fs');
var keypath='/path/to/server.key';
var certpath='/path/to/server.pem';

var options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath),
  passphrase:'123456'//如果秘钥文件有密码的话，用这个属性设置密码
};
 
var server=https.createServer(options, function (req, res) {//要是单纯的https连接的话就会返回这个东西
    res.writeHead(403);//403即可
    res.end("This is a  WebSockets server!\n");
}).listen(8081);
 
 
var wss = new ws.Server( { server: server } );//把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
//同样，如果丢进去的是个http服务的话那么创建出来的还是无加密的ws服务
// wss.on( 'connection', function ( wsConnect ) {
//     wsConnect.on( 'message', function ( message ) {
//         console.log( message );
//     });
    
// });

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
