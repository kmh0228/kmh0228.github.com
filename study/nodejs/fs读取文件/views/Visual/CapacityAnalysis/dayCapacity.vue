<template>
  <charts :id="id" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    id: String,
    capacityData: {
      type: Object,
      default: () => { }
    },
    dateList: {
      type: Array,
      default: () => { }
    }
  },
  computed: {
    option () {
      let { capacityData, dateList } = this
      let planCountList = []
      let actualCountList = []
      let completionRateList = []
      let xData = []
      dateList.forEach((item, i) => {
        xData.push(item)
        planCountList.push(0)
        actualCountList.push(0)
        completionRateList.push(0)
        capacityData.planCountList.forEach(data => {
          if (item === data.name) {
            planCountList[i] = data.value
          }
        })
        capacityData.actualCountList.forEach(data => {
          if (item === data.name) {
            actualCountList[i] = data.value
          }
        })
        capacityData.completionRateList.forEach(data => {
          if (item === data.name) {
            completionRateList[i] = data.value
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
            for (let i in params) {
              if (params[i].seriesName !== '达成率') {
                tip += '<div>' + params[i].marker + params[i].seriesName + ':' + params[i].data + '</div>'
              } else {
                tip += '<div>' + params[i].marker + params[i].seriesName + ':' + params[i].data + '%' + '</div>'
              }
            }
            return tipName + tip
          }
        },
        grid: {
          left: '20px',
          right: '20px',
          bottom: '20px',
          containLabel: true
        },
        legend: {
          textStyle: {
            color: '#fff'
          },
          data: ['目标产量', '实际产量', '达成率']
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
            name: '单位 : %',
            nameTextStyle: {
              color: '#fff'
            },
            min: '0',
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
            name: '目标产量',
            data: planCountList,
            type: 'bar',
            itemStyle: {
              color: '#E25CEE'
            },
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return params.value === 0 ? '' : params.value
              }
            },
            barWidth: '30'
          }, {
            name: '实际产量',
            data: actualCountList,
            type: 'bar',
            itemStyle: {
              color: '#0BF8FC'
            },
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return params.value === 0 ? '' : params.value
              }
            },
            barWidth: '30'
          },
          {
            name: '达成率',
            type: 'line',
            itemStyle: {
              color: '#1EB5A7'
            },
            areaStyle: {
              opacity: 0.2
            },
            yAxisIndex: 1,
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return params.data + '%'
              }
            },
            data: completionRateList
          }
        ]

      }
    }
  },
  methods: {}
}
</script>
