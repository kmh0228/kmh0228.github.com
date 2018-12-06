var getHref = function(){
    var href=unescape(window.location.href);
    var f=href.indexOf('?');
    if(f == -1){
        return {
            loc:href,
            info:{}
        };
    }else{
        var loc=href.slice(0,f);
        var info=href.slice(f+1);
        var arr=info.split(/[=&]/g);
        var infoJson={};
        var arrLength=arr.length;
        for(var i=0;i<arrLength;i+=2){
            infoJson[arr[i]]=decodeURI(arr[i+1]);
        }
        return {
            loc:loc,
            info:infoJson
        };
    }
}