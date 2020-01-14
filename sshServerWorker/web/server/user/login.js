
var connectMysql = require('../libs/connectMysql');
var jwt = require('jsonwebtoken');

module.exports = function(req,res){
    console.log('login');
    var result = '';
    req.on('data',function(chat){
        result += chat;
    });
    req.on('end',function(){
        console.log(result);
        var resultjson = JSON.parse(result);
        var name,mail = name = resultjson.username;
        connectMysql(function(connection){
            connection.query('select token,password from users where name="'+name+'" or email="'+mail+'"',function(error,results,fields){
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
                    if(resultjson.password == results[0].password){
                        
                        var token = jwt.sign({name:results[0].name},results[0].password,{
                            expiresIn:60*60*24
                        })


                        res.send(JSON.stringify({
                            state:'ok',
                            des:'请求成功',
                            data:{
                                token:results[0].token
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