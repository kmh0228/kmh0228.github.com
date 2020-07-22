<template>
  <charts :id="id" :option="option"  @chartsClick="deletePoint"></charts>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    id: String,
    cData: {
      type: Object,
      default: () => { }
    },
    pointData: {
      type: Array,
      default: () => []
    },
    hiddenButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    option () {
      let { cData, pointData } = this
      let chartTitle = cData.chartType
      let ucl = cData.ucl
      let lcl = cData.lcl
      let cl = cData.cl
      let xAxisData = []
      let valueData = []
      let uclData = []
      let clData = []
      let lclData = []
      let dataList = []
      pointData.forEach(item => {
        if (item.chartType === chartTitle) {
          xAxisData.push(item.measurementDt)
          uclData.push(ucl)
          clData.push(cl)
          lclData.push(lcl)
          let obj = {
            value: item.pointValue,
            itemStyle: {
              color: item.pointValue > Number(ucl) || item.pointValue < Number(lcl) || item.pointStatus === 'Excepion' ? 'red' : '#333'
            }
          }
          valueData.push(obj)
          dataList.push(item.pointValue)
        }
      })
      let maxData = Math.max(...dataList)
      maxData = Number(maxData) > Number(ucl) ? maxData : ucl
      return {
        title: {
          text: chartTitle + '—控制图',
          left: '5%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: 1,
          data: ['value', 'UCL', 'CL', 'LCL']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: [{
          type: 'value',
          max: maxData,
          splitLine: {
            show: false
          }
        }, {
          type: 'value',
          max: maxData,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        }],
        series: [{
          name: 'value',
          data: valueData,
          type: 'line',
          lineStyle: {
            color: '#333',
            width: 3
          },
          itemStyle: {
            color: '#333',
            borderWidth: 4
          }
        }, {
          name: 'UCL',
          data: uclData,
          symbol: 'circle',
          symbolSize: 1,
          yAxisIndex: 1,
          type: 'line',
          hoverAnimation: false,
          label: {
            show: true,
            color: '#333',
            position: 'right',
            formatter: params => {
              if (params.dataIndex === uclData.length - 1) {
                return ucl + '   UCL'
              } else {
                return ''
              }
            }
          },
          lineStyle: {
            color: '#F08080',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 2
          }
        }, {
          name: 'CL',
          data: clData,
          symbol: 'circle',
          symbolSize: 1,
          yAxisIndex: 1,
          type: 'line',
          hoverAnimation: false,
          label: {
            show: true,
            color: '#333',
            position: 'right',
            formatter: params => {
              if (params.dataIndex === clData.length - 1) {
                return cl + '  CL'
              } else {
                return ''
              }
            }
          },
          lineStyle: {
            color: '#F08080',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 2
          }
        }, {
          name: 'LCL',
          data: lclData,
          symbol: 'circle',
          symbolSize: 1,
          yAxisIndex: 1,
          type: 'line',
          hoverAnimation: false,
          label: {
            show: true,
            color: '#333',
            position: 'right',
            formatter: params => {
              if (params.dataIndex === lclData.length - 1) {
                return lcl + '   LCL'
              } else {
                return ''
              }
            }
          },
          lineStyle: {
            color: '#F08080',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 2
          }
        }]
      }
    }
  },
  methods: {
    async deletePoint (params) {
      let { hiddenButton } = this
      if (hiddenButton) {
        if (params.color === 'red') {
          const confirm = await this.$myPrompt.confirm('确定删除当前点中的异常点吗？')
          if (confirm) {
            let { pointData } = this
            const pointId = pointData[params.dataIndex].tSpcControlChartDataId
            const res = await this.$api.delException({ pointId })
            this.$myPrompt.handleMsg(res, () => {
              this.pointData = []
              this.$emit('setDefaultId')
            })
          }
        } else {
          this.$message.warning('该点不是异常点，请勿操作！')
        }
      } else {
        this.$message.warning('当前页面是对比页面，请勿操作！')
      }
    }
  },
  mounted () {
  }
}
</script>
