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
    name: String,
    date: String,
    dataList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      const { name, dataList, date } = this
      if (dataList.length === 0) {
        return {
          title: {
            text: '暂无数据',
            x: 'center',
            y: '40%',
            textStyle: {
              color: '#fff',
              fontSize: 18,
              fontWeight: 600
            }
          }
        }
      }
      const xAxisList = []
      const data = []
      for (let i = 0; i < 7; i++) {
        const dateTime = this.$dayjs(date).subtract(i, 'days').format('YYYY-MM-DD')
        xAxisList.unshift(dateTime)
        data.push(0)
      }
      xAxisList.forEach((date, index) => {
        dataList.forEach(item => {
          if (date === item.name) {
            data[index] = item.value
          }
        })
      })
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: '35px',
          left: 0,
          right: '15px',
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
            textStyle: {
              color: '#fff'
            },
            formatter: value => {
              return this.$dayjs(value).format('MM/DD')
            }
          },
          data: xAxisList
        },
        yAxis: {
          name: '单位 min',
          nameTextStyle: {
            color: '#fff',
            padding: [0, 0, 0, 30]
          },
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#00B5FF'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#3398DB',
              type: 'dashed'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: {
          name: name,
          type: 'line',
          color: '#2094F0',
          data
        }
      }
    }
  },
  methods: {}
}
</script>
