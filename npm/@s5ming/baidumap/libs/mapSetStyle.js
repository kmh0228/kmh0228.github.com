/**
 * 给百度地图添加样式的方法,
*/
//			   默认地图样式   清新蓝风格   黑夜风格     红色警戒风格          精简风格               自然绿风格          午夜蓝风格      浪漫粉风格      青春绿风格     清新蓝绿风格     高端灰风格          强边界风格
var styles = ['normal','light','dark','redalert','googlelite','grassgreen','midnight','pink','darkgreen','bluish','grayscale','hardedge'];
var stylesLength = styles.length;

var mapSetStyle = function(map,style){
    var style = style || 0;
    var oS;
    if(typeof style == 'number'){
        oS = styles[style%stylesLength];
    }else{
        oS = style;
    }

    if(typeof oS!='string'){
        map.setMapStyle({styleJson:oS});
    }else{
        map.setMapStyle({style:oS});
    }
}
export default mapSetStyle
