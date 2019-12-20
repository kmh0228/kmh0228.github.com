

var connectMysql = require('../libs/connectMysql');

module.exports = function(req,res){
    console.log('getUserInfo');
    var result = '';
    req.on('data',function(chat){
        result += chat;
    });
    req.on('end',function(){
        var resultjson = JSON.parse(result);
        var token = resultjson.token;
        connectMysql(function(connection){
            connection.query('select * from users where token="'+token+'"',function(error,results,fields){
                if(error){
                    res.send(JSON.stringify({
                        state:'sql error',
                        des:'sql语句错误'
                    }))
                };
                if(results.length == 0){
                    res.send(JSON.stringify({
                        state:'none',
                        des:'无此token'
                    }));
                    return;
                }else{
                    results[0].password = '';
                    res.send(JSON.stringify({
                        state:'ok',
                        des:'请求成功',
                        data:results[0]
                    }));
                }
                console.log(results);
            });
        },function(){
            res.send(JSON.stringify({
                state:'connect error',
                des:'后台与mysql连接错误'
            }))
        });
    });
}