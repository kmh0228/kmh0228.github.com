/**
 * create by zhaomq 2019.4.29
 */
import {extend} from '@s5ming/json'
import {forEach} from '@s5ming/array'
var Driving = function(map,opts){
    var opts = extend(opts,{
        searchEnd:function(){console.log('searchend')},                 //搜索结束事件
        setMarkerStyle:function(line){console.log('marker',line)},      //起点终点设置结束事件
        setlineStyle:function(line){console.log('line',line)},          //线设置结束事件
        autoViewport:true,                                              //检索结束后是否自动调整地图视野
        policy:'BMAP_DRIVING_POLICY_LEAST_TIME'
    })
    console.log(opts.policy)
    this._driving = new BMap.DrivingRoute(map, {
        renderOptions:{map: map, autoViewport: opts.autoViewport},
        policy:opts.policy,
        onSearchComplete:function(DrivingRouteResult){
            opts.searchEnd(DrivingRouteResult)
        },
        onPolylinesSet:function(lines){
            var arr = [];
            forEach(lines,function(item){
                arr.push(item.getPolyline())
            })
            opts.setlineStyle(arr)
        },
        onMarkersSet:function(marker){
            map.removeOverlay(marker[0].marker)
            map.removeOverlay(marker[1].marker)
            opts.setMarkerStyle(marker[0].point,marker[1].point)
        }
    }); 
}
Driving.prototype.search = function(start,end){
    var start = start || new BMap.Point(116.301934,39.977552)
    var end = end || new BMap.Point(116.508328,39.919141)
    this._driving.search(start,end)
}

var driving  = function(map,opts){
    return new Driving(map,opts)
}

export default driving
