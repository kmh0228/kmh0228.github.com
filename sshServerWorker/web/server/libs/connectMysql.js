var mysql = require('mysql');
module.exports = function connectMysql(success,fail){
    var connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'idpbg1230.',
        database:'zmq'
    });
    connection.connect(function(error){
        if(error){
            fail&&fail();
        }
        //console.log('connected as id ' + connection.threadId);
    });
    success && success (connection);
    connection.end();
}
