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
    title: {
      type: String,
      default: ''
    },
    barData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let { barData } = this
      let xData = []
      let seriesData = []
      barData.forEach(item => {
        xData.push(item.name)
        seriesData.push(item.value)
      })
      return {
        // title: {
        //   text: title,
        //   textStyle: {
        //     color: '#c3c4ca',
        //     fontSize: 16
        //   },
        //   left: 'center',
        //   top: '20'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '10px',
          right: '15px',
          top: '40px',
          bottom: '30px',
          height: '80%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#00B5FF'
              }
            },
            axisLabel: {
              color: '#fff'
            }
          }
        ],
        yAxis: [
          {
            name: '单位 : 个',
            type: 'value',
            nameTextStyle: {
              color: '#fff'
            },
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
          }
        ],
        series: [
          {
            name: '报警数',
            type: 'bar',
            barWidth: '30px',
            data: seriesData,
            itemStyle: {
              color: '#2DC2D0'
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
    }
  }

}
</script>
