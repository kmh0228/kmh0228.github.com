/**
 * 获取多个点的最大经度,最小经度,最大维度,最小维度
 */
export default function(arr = []){
    var length = arr.length;
    if(length<1)return {
        minLng:0,
        maxLng:0,
        minLat:0,
        maxLat:0
    }
    var first = arr[0]
    var result = {
        minLng:first.lng,
        maxLng:first.lng,
        minLat:first.lat,
        maxLat:first.lat
    }
    for(var i=1;i<length;i++){
        if(result.minLng > arr[i].lng)result.minLng = arr[i].lng 
        if(result.maxLng < arr[i].lng)result.maxLng = arr[i].lng
        if(result.minLat > arr[i].lat)result.minLat = arr[i].lat 
        if(result.maxLat < arr[i].lat)result.maxLat = arr[i].lat
    }
    return result
}
