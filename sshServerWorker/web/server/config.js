
var path = require('path');

var devType = require('./devType');          // local 本地  server 服务

module.exports = {
    // 存放数据的文件目录
    dataUrl:devType=='local'?path.join(__dirname,'./data'):'/home/s5ming/data',
    //服务监控的端口
    serverPost:devType=='local'?9999:80,


};
