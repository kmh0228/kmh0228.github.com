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
    lineData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let xData = []
      let seriesData = []
      this.lineData.forEach(item => {
        xData.push(item.name)
        seriesData.push(item.value)
      })
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '40px',
          left: '30px',
          right: '25px',
          height: '70%',
          bottom: '30px'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#00B5FF'
            }
          },
          boundaryGap: false,
          data: xData,
          axisLabel: {
            color: '#fff',
            formatter: params => {
              return this.$dayjs(params).format('MM-DD')
            }
          }
        },
        yAxis: {
          name: '单位 : PCS',
          nameTextStyle: {
            color: '#fff'
          },
          type: 'value',
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
        },
        series: [{
          name: '库存量',
          data: seriesData,
          label: {
            show: true,
            position: 'right'
          },
          itemStyle: {
            color: '#DF6DDF'
          },
          type: 'line',
          areaStyle: {
            opacity: 0.1
          }
        }]
      }
    }
  },
  methods: {}
}
</script>
