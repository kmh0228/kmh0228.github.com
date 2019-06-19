/**
 *  create by s5ming 2019.3.25
 *  qq:1150123276
 *  @param opts 你写入的json参数
 *  @param defau 默认的参数,当opt没有此key的时候,将会在defau里找
 *  @param config 配置参数{
 *      exclude:[字段]   此字段强制使用默认的字段
 * }
 */
var extend = function(opts,defau,config){
    var config = config || {};
    var exclude = config.exclude || []; 
    var excludeLength = exclude.length;
    var result = {};
    for(var name in opts){
        result[name] = opts[name];
    }
    for(var name in defau){
        var find = false;
        for(var i=0;i<excludeLength;i++){
            if(exclude[i] == name)find = true;
            break;
        }
        if(find)continue;
        if(typeof result[name] == 'undefined'){
            result[name] = defau[name];
        }else if(result[name] && result[name].constructor == Object && result[name].toString() == '[object Object]'){				
            result[name] = extend(result[name],defau[name]);				
        }   
    }
    return result;
};

export default extend;