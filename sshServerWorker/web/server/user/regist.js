

var connectMysql = require('../libs/connectMysql');

module.exports = function(req,res){
    console.log('regist');
    var result = '';
    req.on('data',function(chat){
        result += chat;
    });
    req.on('end',function(){
        var rs = JSON.parse(result);
        //检查是否有此账号

        connectMysql(function(connection){
            connection.query('select * from users where name="'+rs.username+'" or email="'+rs.mail+'"',function(error,results,fields){
                if(error){
                    res.send(JSON.stringify({
                        state:'sql error',
                        des:'sql语句错误'
                    }))
                };
                if(results.length == 0){
                    regit();
                    return;
                }else{
                    res.send(JSON.stringify({
                        state:'error',
                        des:'当前账户名或邮箱已经使用'
                    })); 
                }
            });
        },function(){
            res.send(JSON.stringify({
                state:'connect error',
                des:'后台与mysql连接错误'
            }))
        });

        //注册
        function regit(){
            connectMysql(function(connection){
                var sql = 'insert into users (name,password,email,createdate,token) values ("'+rs.username+'","'+rs.password+'","'+rs.mail+'",now(),"")';
                console.log(sql);
                connection.query(sql,function(error,results,fields){
                    if(error){
                        res.send(JSON.stringify({
                            state:'sql error',
                            des:'sql语句错误'
                        }))
                        return;
                     };
                    res.send(JSON.stringify({
                        state:'success',
                        des:'注册成功'
                    }));
                });
            },function(){
                res.send(JSON.stringify({
                    state:'connect error',
                    des:'后台与mysql连接错误'
                }))
            });
        }
        
    });
}