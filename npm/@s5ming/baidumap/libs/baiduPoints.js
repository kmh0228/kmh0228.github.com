/**
 * 定义坐标点
 * 因为lng和lon经常弄混,所以写了这么个方法.参数是json数组,[{lng:lng,lat:lat}...], 坐标点如果没有lng,会找寻lon,也可以是个长度为2的数组,会默认把第一个当lng,第二个当lat
 */
export default function(points = []){
    var pointsResult = [];
    var length = points.length;
    for(var i = 0; i < length; i++){
        var e = points[i]
        if(e.length == 2){
            e={lng:e[0],lat:e[1]};
        }
        pointsResult.push(new BMap.Point(Number(e.lng||e.lon),Number(e.lat)));
    }
    return pointsResult;
}
