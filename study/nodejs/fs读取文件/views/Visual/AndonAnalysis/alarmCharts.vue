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
    }
  },
  computed: {
    option () {
      const { dataList } = this
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
      const yAxisList = []
      const data = []
      dataList.forEach(item => {
        yAxisList.push(item.name)
        data.push(item.value)
      })

      return {
        title: {
          text: ''
        },
        grid: {
          left: 100,
          right: 80,
          top: 10,
          bottom: 10
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            data: yAxisList,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            }
          },
          {
            type: 'category',
            inverse: true,
            data,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#02E8FF',
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            position: 'right'
          }
        ],
        series: [
          {
            type: 'pictorialBar',
            symbol: 'rect',
            symbolRepeat: true,
            symbolClip: true,
            symbolSize: [5, 22],
            symbolMargin: 2,
            symbolOffset: [20, 0],
            data,
            color: '#02E8FF',
            label: {
              show: false,
              position: 'right',
              fontWeight: 'bold',
              fontSize: 16
            }
          }
        ]
      }
    }
  },
  methods: {}
}
</script>
