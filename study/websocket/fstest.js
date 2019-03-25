var fs = require('fs');
fs.readFile('xjl.data.js',function(err,data){
    var sourceString = data.toString();
    var sourceString2 = sourceString.split('=')[1];
    sourceString2 = sourceString2.replace(';','');
    var json = JSON.parse(sourceString2);
    for(var name in json){
        json[name] = Number(json[name]||0)+1
    }
    var targetString = JSON.stringify(json);
    var targetString2 = sourceString.split('=')[0]+'='+targetString+';';
    fs.writeFile('xjl.data.js',targetString2,function(data){
        
    });
});
var d = new Date();
console.log(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());

