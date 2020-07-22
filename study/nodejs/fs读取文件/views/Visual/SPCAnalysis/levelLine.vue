<template>
  <charts id="level_line" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    xAxisList: Array
  },
  computed: {
    option () {
      const { dataList, xAxisList } = this
      const getData = () => {
        const arr = []
        xAxisList.forEach(date => {
          arr.push(0)
        })
        return arr
      }
      const series = []
      dataList.forEach(item => {
        if (item.level !== 'total') {
          const data = getData()
          xAxisList.forEach((date, index) => {
            item.list.forEach(list => {
              if (list.date === date) {
                data[index] = list.value
              }
            })
          })
          series.push({
            name: item.level,
            type: 'line',
            label: {
              show: true
            },
            data
          })
        }
      })
      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        grid: {
          left: '30px',
          right: '30px',
          bottom: '15px',
          top: '30px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            fontSize: 14
          },
          data: xAxisList
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          }
        },
        series
      }
    }
  },
  methods: {}
}
</script>
