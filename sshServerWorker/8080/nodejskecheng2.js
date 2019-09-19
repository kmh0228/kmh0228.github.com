/**静态服务器 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');


function staticRoot(staticPath,req,res){
    var pathObj = url.parse(req.url,true);
    if(pathObj.pathname == '/')pathObj.pathname+='index.html';
    var filePath = path.join(staticPath,pathObj.pathname);
    //var fileContent = fs.readFileSync(filePath,'binary');   找不到文件容易报错
    fs.readFile(filePath,'binary',function(err,fileContent){
        if(err){
            res.writeHead(404,'not found');
            res.write('404 not found');
        }else{
            res.write(fileContent,'binary');
        }
        res.end();
    });
    
}

var server = http.createServer(function(req,res){
    var staticPath = path.join(__dirname,'../web/dist');
    staticRoot(staticPath,req,res);
});

server.listen(8080);