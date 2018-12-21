var oracledb = require('oracledb');
var config = {
  user:'rays',　　//用户名
  password:'1',　　//密码
  //IP:数据库IP地址，PORT:数据库端口，SCHEMA:数据库名称
  connectString : "10.55.45.51:1521/bigdata"
};
oracledb.getConnection(
  config,
  function(err, connection)
  {
    if (err) {
      console.error(err.message);
      return;
    }
　　//查询某表十条数据测试，注意替换你的表名
    connection.execute("SELECT * FROM DIM_CLYTBH",
      function(err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        //打印返回的表结构
        console.log(result.metaData);
        //打印返回的行数据
        console.log(result.rows);
      });
  });

function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}