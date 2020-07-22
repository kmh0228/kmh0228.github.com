<template>
  <charts :id="id" :option="option" ></charts>
</template>

<script>
export default {
  data () {
    return {
    }
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
      let { lineData } = this
      let xData = []
      let seriesData = []
      lineData.forEach(item => {
        xData.push(item.name)
        seriesData.push(item.value)
      })
      return {
        grid: {
          top: '40px',
          left: '40px',
          right: '50px',
          height: '70%',
          bottom: '10px'
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const tipName = params[0].name
            let tip = '<div>' + params[0].marker + params[0].seriesName + ' : ' + params[0].value + ' % ' + '</div > '
            return tipName + tip
          }
        },
        xAxis: {
          name: '日期',
          nameTextStyle: {
            color: '#fff'
          },
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#00B5FF'
            }
          },
          boundaryGap: false,
          axisLabel: {
            color: '#fff',
            formatter: params => {
              return this.$dayjs(params).format('MM-DD')
            }
          },
          data: xData
        },
        yAxis: {
          name: '单位 : %',
          nameTextStyle: {
            color: '#fff'
          },
          type: 'value',
          min: '0',
          max: '100',
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
            lineStyle: {
              color: '#3398DB',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: '达成率',
          data: seriesData,
          type: 'line',
          itemStyle: {
            color: '#DF6DDF'
          },
          label: {
            show: true,
            formatter: '{c}%'
          }
        }]

      }
    }

  },
  methods: {}
}

</script>
