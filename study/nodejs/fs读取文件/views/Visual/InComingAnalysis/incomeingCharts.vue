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
    dataList: {
      type: Array,
      default: () => []
    },
    xAxisList: Array
  },
  computed: {
    option () {
      const { xAxisList, dataList } = this
      const qtyList = []
      const rateList = []
      xAxisList.forEach((date, index) => {
        qtyList.push(0)
        rateList.push(0)
        dataList.forEach(item => {
          if (item.date === date) {
            qtyList[index] = item.qty
            rateList[index] = item.rate
          }
        })
      })
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          itemWidth: 18,
          itemHeight: 14,
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        grid: {
          top: '45px',
          left: 0,
          right: 0,
          bottom: '15px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#00B5FF'
            }
          },
          axisLabel: {
            color: '#fff'
          },
          data: xAxisList
        },
        yAxis: [
          {
            type: 'value',
            name: '批退量',
            nameTextStyle: {
              color: '#fff'
              // padding: [0, -40, 0, 0]
            },
            axisLine: {
              lineStyle: {
                color: '#00B5FF'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#3398DB',
                type: 'dashed'
              }
            },
            axisLabel: {
              color: '#fff'
            }
          },
          {
            type: 'value',
            name: '批退率',
            nameTextStyle: {
              color: '#fff',
              padding: [0, -40, 0, 0]
            },
            axisLine: {
              lineStyle: {
                color: '#00B5FF'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}%',
              color: '#fff'
            }
          }
        ],
        series: [
          {
            name: '批退量',
            type: 'bar',
            barWidth: '25px',
            color: '#5DDFDF',
            label: {
              show: true,
              position: 'top',
              fontWeight: 'bold',
              fontSize: 16,
              formatter: '{c}%'
            },
            data: qtyList
          },
          {
            name: '批退率',
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            color: '#E25CEE',
            yAxisIndex: 1,
            label: {
              show: true,
              position: 'top',
              fontWeight: 'bold',
              fontSize: 16,
              offset: [0, 10],
              formatter: '{c}%'
            },
            data: rateList
          }
        ]
      }
    }
  },
  methods: {}
}
</script>
