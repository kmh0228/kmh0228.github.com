<template>
  <charts id="gantt_charts" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    dataList: [Array]
  },
  computed: {
    option () {
      const start = '2019-09-09'
      const end = '2019-09-19'
      const endNext = this.$dayjs(end).add(1, 'days').format('YYYY-MM-DD')
      const differ = (this.$dayjs(endNext).valueOf() - this.$dayjs(start).valueOf()) / (24 * 60 * 60 * 1000)
      const max = differ * 24
      const dateList = []
      for (let i = 0; i < differ; i++) {
        const date = this.$dayjs(start).add(i, 'days').format('MM/DD')
        dateList.push(date)
      }
      const { dataList } = this
      const yAxisList = []
      // const series = []
      dataList.forEach((item, index) => {
        yAxisList.push(item.resourceCode)
      })
      const resourceList = [...new Set(yAxisList)]
      return {
        grid: {
          top: '37px',
          left: 0,
          right: 0,
          bottom: 0
        },
        xAxis: [{
          type: 'value',
          axisLabel: {
            show: false
          },
          position: 'bottom',
          max,
          min: 0,
          splitNumber: differ + 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }, {
          type: 'category',
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: 14
            }
          },
          position: 'top',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          },
          data: dateList
        }],
        yAxis: {
          type: 'category',
          boundaryGap: true,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: resourceList
        },
        series: [
          {
            type: 'bar',
            barWidth: '100%',
            stack: 'stack',
            data: [
              {
                value: 24,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'rgba(0,0,0,0)'
                }
              },
              {
                value: 1.2 * 24,
                label: {
                  show: false
                },
                itemStyle: {
                  color: 'rgba(0,0,0,0)'
                }
              },
              {
                value: 1.8 * 24,
                itemStyle: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            ]
          },
          {
            type: 'bar',
            stack: 'stack',
            data: [
              {
                name: 'LISONG20190909',
                value: 2.2 * 24,
                label: {
                  show: true,
                  formatter: '{b}',
                  color: '#333',
                  fontSize: 14
                },
                itemStyle: {
                  color: '#4d99d1'
                }
              },
              {
                name: 'LISONG20190910',
                value: 1.6 * 24,
                label: {
                  show: true,
                  formatter: '{b}',
                  color: '#333',
                  fontSize: 14
                },
                itemStyle: {
                  color: '#7ed7e0'
                }
              },
              {
                name: 'LISONG20190911',
                value: 2.4 * 24,
                label: {
                  show: true,
                  formatter: '{b}',
                  color: '#333',
                  fontSize: 14
                },
                itemStyle: {
                  color: '#f09877'
                }
              }
            ]
          }
        ]
      }
    }
  },
  methods: {}
}
</script>
