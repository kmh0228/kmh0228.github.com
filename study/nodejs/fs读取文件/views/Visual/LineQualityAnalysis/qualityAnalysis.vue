<template>
  <charts :id="id" :option="option"></charts>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {}
  },
  props: {
    id: String,
    analysisList: {
      type: Array,
      default: () => []
    },
    dateList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let { analysisList, dateList } = this
      let actualPassRate = []
      let targetPassRate = []
      let passNumList = []
      let xData = []
      dateList.forEach((item, i) => {
        targetPassRate.push(80)
        xData.push(item)
        actualPassRate.push(0)
        passNumList.push(0)
        analysisList.forEach(option => {
          if (option.time === item) {
            actualPassRate[i] = option.passRate
            passNumList[i] = option.passNum
          }
        })
      })
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: params => {
            let tipName = params[0].axisValueLabel
            let tip = ''
            let marker = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#01FFFC;"></span>'
            for (let i in params) {
              if (params[i].seriesName === '良品数') {
                tip += '<div>' + marker + params[i].seriesName + ':' + params[i].data + '</div>'
              } else {
                tip += '<div>' + params[i].marker + params[i].seriesName + ':' + params[i].data + '%' + '</div>'
              }
            }
            return tipName + tip
          }
        },
        grid: {
          left: '50px',
          right: '20px',
          bottom: '20px',
          containLabel: true
        },
        legend: {
          textStyle: {
            color: '#fff'
          },
          data: ['目标直通率', '实际直通率', '良品数']
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#00B5FF'
              }
            },
            axisLabel: {
              color: '#fff'
            },
            data: xData
          }
        ],
        yAxis: [
          {
            name: '单位 : PCS',
            type: 'value',
            nameTextStyle: {
              color: '#fff'
            },
            axisLine: {
              lineStyle: {
                color: '#00B5FF'
              }
            },
            axisLabel: {
              color: '#fff'
            },
            splitLine: {
              lineStyle: {
                color: '#3398DB',
                type: 'dashed'
              }
            }
          }, {
            type: 'value',
            min: '0',
            name: '单位 : %',
            nameTextStyle: {
              color: '#fff'
            },
            axisLine: {
              lineStyle: {
                color: '#00B5FF'
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#fff'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '目标直通率',
            data: targetPassRate,
            type: 'line',
            yAxisIndex: 1,
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return params.data + '%'
              }
            },
            itemStyle: {
              color: '#EF3591'
            },
            lineStyle: {
              type: 'dashed'
            }
          }, {
            name: '实际直通率',
            data: actualPassRate,
            type: 'line',
            yAxisIndex: 1,
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return params.data + '%'
              }
            },
            itemStyle: {
              color: '#F9F9A1'
            }
          },
          {
            name: '良品数',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0.8, color: '#01FFFC' },
                  { offset: 1, color: '#12327B' }
                ]
              )
            },
            label: {
              show: true,
              color: '#fff',
              position: 'top'
            },
            barWidth: '30',
            data: passNumList
          }
        ]
      }
    }
  }
}
</script>
