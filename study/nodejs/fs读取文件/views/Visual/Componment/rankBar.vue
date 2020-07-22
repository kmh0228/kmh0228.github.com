<template>
  <charts :id="id" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    id: {
      type: String
    },
    // title: {
    //   type: String
    // },
    top: {
      type: Number,
      default: () => { return 5 }
    },
    // abnormalTitle: {
    //   type: String
    // },
    type: {
      type: Array
    },
    data: {
      type: Array
    },
    height: {
      type: String
    },
    isCut: {
      type: Boolean
    },
    rankSum: {
      type: Number
    },
    left: {
      type: String,
      default: '3%'
    }
  },
  computed: {
    maxValue () {
      return Math.max.apply(null, this.data)
    },
    option () {
      const hasData = this.data.length > 0
      if (hasData) {
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: this.left,
            right: '25%',
            top: this.top + '%',
            height: this.height,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            show: false,
            max: this.maxValue + 1 < 10 ? 10 : this.maxValue
          },
          yAxis: {
            type: 'category',
            data: this.type,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              margin: 15,
              textStyle: {
                fontSize: 14,
                color: '#fff'
              },
              formatter: val => {
                if (this.isCut) {
                  if (val.length > 4) {
                    return val.substring(0, 4)
                  } else {
                    return val
                  }
                } else {
                  return val
                }
              }
            },
            axisPointer: {
              label: {
                show: false,
                margin: 30
              }
            }
          },
          series: [{
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              offset: [10, 0],
              color: '#00C3D5',
              fontSize: 12,
              fontWeight: 'bold',
              formatter: params => {
                if (this.rankSum) {
                  var rate = (params.value / this.rankSum * 100).toFixed(1)
                  return params.value + '（' + rate + '%）'
                } else {
                  return params.value
                }
              }
            },
            itemStyle: {
              color: '#00C3D5',
              barBorderRadius: 3
            },
            barWidth: '50%',
            data: this.data
          }]
        }
      } else {
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
    }
  },
  methods: {
  }
}
</script>
