
var connectMysql = require('../libs/connectMysql');
var jwt = require('jsonwebtoken');
var secret = 's5ming';

module.exports = function(req,res){
    console.log('login');
    var ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
    console.log(ip);
    var result = '';
    req.on('data',function(chat){
        result += chat;
    });
    req.on('end',function(){
        console.log(result);
        var resultjson = JSON.parse(result);
        var name,mail = name = resultjson.username;
        connectMysql(function(connection){
            connection.query('select name,password from users where name="'+name+'" or email="'+mail+'"',function(error,results,fields){
                if(error){
                    res.send(JSON.stringify({
                        state:'sql error',
                        des:'sql语句错误'
                    }))
                };
                if(results.length == 0){
                    res.send(JSON.stringify({
                        state:'none',
                        des:'无此账号'
                    }));
                    return;
                }else{
                    console.log('results',results);
                    if(resultjson.password == results[0].password){
                        var token = jwt.sign({name:results[0].name},secret,{
                            expiresIn:60*60*24
                        })
                        res.send(JSON.stringify({
                            state:'ok',
                            des:'请求成功',
                            data:{
                                token:token
                            }
                        }));
                    }else{
                        res.send(JSON.stringify({
                            state:'password error',
                            des:'密码错误'
                        }));
                    }
                    
                }
            });
        },function(){
            res.send(JSON.stringify({
                state:'connect error',
                des:'后台与mysql连接错误'
            }))
        });
    });
}