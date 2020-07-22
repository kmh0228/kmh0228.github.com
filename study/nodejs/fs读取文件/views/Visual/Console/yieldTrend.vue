<template>
  <charts :id="id" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    id: String,
    yieldData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let { yieldData } = this
      let xData = []
      let seriesData = []
      yieldData.forEach(item => {
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
          data: xData,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#00B5FF'
            }
          },
          axisLabel: {
            color: '#fff',
            formatter: params => {
              return this.$dayjs(params).format('MM-DD')
            }
          }
        },
        yAxis: {
          name: '单位 : %',
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
          name: '良率',
          data: seriesData,
          type: 'line',
          itemStyle: {
            color: '#DF6DDF'
          },
          label: {
            show: true,
            position: 'right'
          },
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
