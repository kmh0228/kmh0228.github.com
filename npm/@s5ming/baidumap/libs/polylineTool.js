/**
 * 关于Polygoin的一些方法
 */
/*获取一个polyline的总里程,单位米
    map:尽量填写,该方法给此polyline加了两个属性,dis:折线上每个点到上个点的距离,disSum:折线上每个点到起点的距离
*/
import {binaryPlus} from '@s5ming/array'
import forEach from '@s5ming/array/libs/forEachChildren';
var getLength = function(polyline,map){
    if(polyline.disSum){
        return polyline.disSum[polyline.disSum.length - 1]
    }
    var map = map || polyline.getMap() || new BMap.Map()
    var path = polyline.getPath()
    var length = path.length;
    var dis = []
    var disSum = []
    var sumDistance = 0;
    for(var i = 0; i < length; i++){
        if(!i){
            dis.push(0)
            disSum.push(0)
        }else{
            var distance = map.getDistance(path[i-1],path[i])
            dis.push(distance)
            sumDistance += distance
            disSum.push(sumDistance)
        }
    }
    polyline.dis = dis
    polyline.disSum = disSum
    return sumDistance
}

/**
 * 通过距离起点的距离,获取当前的坐标点
 * 参数distance可以是百分数
 */
var disGetPoiont = function(polyline,distance,map){
    var sumDis = getLength(polyline,map)
    var strLength = distance.length
    if(distance[strLength - 1] == '%'){
        distance = Number(distance.substring(0,strLength - 1)) / 100 *  sumDis
    }
    var disSum = polyline.disSum
    var dis = polyline.dis
    var path = polyline.getPath()
    var i = binaryPlus(disSum,distance)
    var diss = disSum[i]
    var disP = (diss - distance) / dis[i]
    var pi = path[i]
    var ppi = path[i-1]
    var lng = pi.lng + (ppi.lng - pi.lng) * disP
    var lat = pi.lat + (ppi.lat - pi.lat) * disP
    return new BMap.Point(lng,lat)
}

/**
 * 把多个polyline拼接到一起的方法,默认样式为第一个polyline的样式,注意:此方法毁掉了原来的polyline数组
 */
var connectPolyline = function(polylines = []){
    var path = []
    forEach(polylines,function(line){
        path = path.concat(line.getPath())
    })
    forEach(polylines,function(line2,index){
        if(index){
            line2.getMap()&&line2.getMap().removeOverlay(line2)
        }else{
            line2.setPath(path)
        }
    })
    return polylines[0]
}


export default {
    getLength:getLength,
    disGetPoiont:disGetPoiont,
    connectPolyline:connectPolyline
}
