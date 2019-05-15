
//把其他坐标转换成坐标工具
import {extend} from '@s5ming/json'
var toBaiduPoint=function(points,fn,opts){
    //检查如果给你空数组的情况	
    var length = points.length;
    if(!length){
        fn&&fn([]);return;
    }
    //默认参数
    var info = extend(opts,{
        pici:10,			//每次发送多少个转换请求
        num:10,				//每个转换请求有多少数据。最大10个
        from:1,				//数据源类型 原GIS坐标from为1, 其他高德，谷歌等from为3
        
    });
    
    var pici=Number(info.pici);
    var num=Number(info.num);
    var from=Number(info.from);
    var convertor = new BMap.Convertor();
    var newPoints=[];
    var speed=pici*num;
    var start=0;
    var limit=length>(start+speed)?start+speed:length;
    var tobaiduPointTimer;
    //转换方法
    var getBaiduPoint=function(){
        limit=length>(start+speed)?start+speed:length;
        var changsum=limit-start;
        var changepici=Math.ceil(changsum/num);
        for(var j=0;j<changepici;j++){
            (function(index){
                convertor.translate(points.slice(start+(index*num),start+(index*num)+num<limit?start+(index*num)+num:limit), from, 5,function(data){
                  if(data.status === 0) {
                      for(var i=0;i<data.points.length;i++){
                          newPoints[start+(index*num)+i]=data.points[i];
                    }
                  }else{
                    alert('坐标转换失败,错误'+data.status+' : '+data.message);
                    return; 
                    }
                });
            })(j);
        }
    };
    //监控转换结果
    clearInterval(tobaiduPointTimer);
    getBaiduPoint();
    tobaiduPointTimer=setInterval(function(){
        var num=0;
        for(var j=start;j<limit;j++){
            if(newPoints[j]){
                num++;
            }
        }
        if(limit-start==num){
            if(limit==length){
                clearInterval(tobaiduPointTimer);
                fn&&fn(newPoints);
            }else{
                start+=speed;
                getBaiduPoint();
            }
        }
    },30);
};


export default toBaiduPoint;