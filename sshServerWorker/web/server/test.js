
var jwt = require('jsonwebtoken');

var data = {name:'name',password:'password'};
var secret = 'idpbg1230.';

var token = jwt.sign(data,secret,{
    expiresIn:800
});

console.log('token',token);

var token2 = jwt.sign(data,secret,{
    expiresIn:800
});

console.log('token2',token2);

var retoken = jwt.verify(token,secret);
console.log('retoken',retoken);
var retoken2 = jwt.verify(token2,secret);
console.log('retoken2',retoken2);

var timeout = setTimeout(function(){
    clearTimeout(timeout);
    var retoken2 = jwt.verify(token,secret,function(error){
        //console.log(error);
    })
    console.log(retoken2||'')
},12000);
