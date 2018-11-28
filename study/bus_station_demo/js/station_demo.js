function station_demo (dir,data,colors,circleMaxR,circleMinR) {
    require.config({
        paths: {
			echarts: "echarts",
		},
    });

    require(
    [
        "echarts",
        "echarts/chart/main",
		"echarts/chart/map",
		"echarts/chart/bar",
		"echarts/chart/scatter"
    ],
    function (echarts, BMapExtension) {
    	console.log(echarts);
    	console.log(BMapExtension);
        // 初始化地图
        var BMapExt = new BMapExtension($('#container_map')[0], BMap, echarts,{
            enableMapClick: false
        });
        var map = BMapExt.getMap();
        var container = BMapExt.getEchartsContainer();
        var startPoint = {
            x: 116.404, //北京 
            y: 39.915
        };

        var point = new BMap.Point(startPoint.x, startPoint.y);
        map.centerAndZoom(point, 12);
        map.enableScrollWheelZoom(true);
		setStyleKuHei(map);
		// 加载地图事件
		var loaded=false;
		map.addEventListener("tilesloaded",maploaded);
		function maploaded(){
			if(loaded)return;
			loaded=true;
			//添加地图级别控件
			var navigation=new BMap.NavigationControl(map);
			map.addControl(navigation);
			navigation.setOffset(new BMap.Size(0,160));
			var busTool = new Bustool(map);
			//画图
			drawOd();
			function drawOd(){		
			//把所有数据拿出来
				var points={};
				var lineto={};
				var od = data.od;
				var length = od.length;
				var mx=0;
				for(var i=0;i<length;i++){
					points[od[i].name]=new BMap.Point(od[i].lon,od[i].lat);
					var count = Number(od[i].count);
					lineto[od[i].name]=count;
					if(mx<count)mx=count;
				}
				var Sname = data.station.name;
				points[Sname]=new BMap.Point(data.station.lon,data.station.lat);
			//坐标转换成百度坐标
				//busTool.jsonToBaiduPoint(points,draw);
				draw(points);
				function draw(json){
					//配置所有点信息
					var geoCoord={};
						for(var name in json){
							geoCoord[name]=[json[name].lng,json[name].lat];
						}
					
					//配置各线参数
					var series=[];
					var marklinedata=[];
					for(var i=0; i<length;i++){
						var name = od[i].name;
						var value =Number(od[i].count);
						if(dir==1){
							var onedata=[{name:name},{name:Sname,value:value}];
						}else{
							var onedata=[{name:Sname},{name:name,value:value}];
						}
						marklinedata.push(onedata);
					}
					var markline={
						tooltip : {
							trigger: 'item',
							formatter: function (v) {
								var arr=v[1].replace(' ','').split(/[:>]/);
								if(dir==1){
									 return arr[0]+' > '+arr[1]+' : '+ lineto[arr[0].replace(' ','')];
								}else{
									return arr[0]+' > '+arr[1]+' : '+ lineto[arr[1].replace(' ','')];
								}
							}
						},
						//large:true,
						smooth:true,
						effect : {
							show: true,
							scaleSize: 1,
							period: 30,
							color: '#bbb',
							shadowBlur: 10
						},
						itemStyle : {
							normal: {
								borderWidth:2,
								lineStyle: {
									type: 'solid',
									shadowBlur: 10
								},
								label:{show:true,
									textStyle:{
										color:'#fff'
									}
								}
							}
						},
						data : marklinedata
					};
						
					var markPointdata=[];
					for(var name in lineto){
						var onedata={name:name,value:lineto[name]};
						markPointdata.push(onedata);
					}
					var markPoint={
						symbol:'emptyCircle',
						//改变光圈大小
						symbolSize : function (v){
							return circleMinR + v/mx*(circleMaxR - circleMinR);
						},
						effect : {
							show: true,
							shadowBlur : 0
						},
						itemStyle:{
							normal:{
								label:{show:true}
							},
							emphasis:{
								label:{show:true}
							}
						},
						data : markPointdata
					}
						
					var onelist={
						name:name,
						type:'map',
						mapType:'none',
						data:[],
						markLine:markline,
						markPoint:markPoint
					};
					series.push(onelist);
						
					//把各点加入到参数中
					series[0].geoCoord=geoCoord;
					
					//$('#container_map').html(JSON.stringify(series));
					var option = {
						//color: ['gold','aqua','lime'],
						tooltip : {
							trigger: 'item',
							formatter: function (v) {
								//var arr=v[1].split(' > ');
								return v[1].replace(':', ' > ');
							}
						},
						dataRange: {
							min : 0,
							max : mx,
							y: '400',
							calculable : true,
							color: colors,
							show:true
						},
						series : series  
					};
					console.log(option);
					var myChart = BMapExt.initECharts(container);
					window.onresize = myChart.onresize;
					BMapExt.setOption(option);
					
				}
				
			};
			
		}
	});
}