


//于echarts之上，必须先引入echarts和其中的Line和bar配件，才能正常使用

/* opts 参数 {
	names:['名字一'，'名字二'],    //两个数据线的名称
	exps                          //坐标说明
	xData:[],                     //横坐标数据
	y1Data							//纵柱状图数据
	y2Data							//纵点图数据
}*/

//

function BarScatterHis (echarts,id,opts){
	this. chart = echarts.init(document.getElementById(id));
	//初始化
	var opts = this.opts = opts||{};
	this.names = opts.names||['名字一','名字二'];
	this.exps = opts.exps||['数量','日期'];
	this.xData = opts.xData||['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];	
	this.y1Data = opts.y1Data||[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3];
	this.y2Data = opts.y2Data||[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];
	//添加柱状图数据
	this.addData();
}

BarScatterHis.prototype.addData=function(opts){
	var _this = this;
			var option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross',
		            crossStyle: {
		                color: '#999'
		            }
		        }
		    },
		    toolbox: {
		        feature: {
		            dataView: {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore: {show: true},
		            saveAsImage: {show: true}
		        }
		    },
		    legend: {
		        data:[{
		        	name:_this.names[0],
		        },{
		        	name:_this.names[1],
		        }]
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: _this.xData,
		            axisPointer: {
		                type: 'shadow'
		            }
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: _this.exps[0],
		            min: 0,
		            axisLabel: {
		                formatter: '{value}'
		            }
		        },
		        {
		            type: 'value',
		            name: this.exps[1],
		            min: 0,
			        axisLabel: {
		                formatter: function(value,index){
		                	var v = Number(value);
		                	return parseInt(v/60) + ':'+ (v%60);
		                }
		            }
		        }
		    ],
		    series: [
		        {
		            name:_this.names[0],
		            type:'bar',
		            data:_this.y1Data
		        },
		        {
		            name:_this.names[1],
		            type:'line',
		            yAxisIndex: 1,
		            data:this.y2Data,		 
					itemStyle:{
						normal:{
							color:'red',
							borderColor:'red',
							borderWidth:10,
							lineStyle:{
								width:0
							}
						}
					},
					
		        }
		    ]
		};
		this.chart.setOption(option);
}
