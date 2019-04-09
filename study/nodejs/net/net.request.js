var net = require('net');
var netSocket = new net.Socket();
var client = netSocket.connect({
    host:'localhost',
    port: 8080
}, function() {
   console.log('连接到服务器！');  
});
client.on('data', function(data) {
    console.log('写入数据');
   console.log(data.toString());
   client.end();
});
client.on('end', function() { 
   console.log('断开与服务器的连接');
});
client.on('error',function(error){
    console.log('链接错误');
    console.log(error);
});
console.log('执行完毕');