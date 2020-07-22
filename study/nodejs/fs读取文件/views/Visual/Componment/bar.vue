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
    barTitle: String,
    barData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      // const seriesDataName = this.id === 'alarmQuestionTop' ? '报警问题' : '报警时间处理'
      let xData = []
      let seriesData = []
      // this.barData.forEach(item => {
      //   xData.push(item.name)
      //   seriesData.push(item.value)
      // })
      return {
        title: {
          text: this.barTitle,
          x: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            }
          }
        ],
        series: [
          {
            name: '柱形',
            type: 'bar',
            barWidth: '30px',
            data: seriesData
          }
        ]
      }
    }
  }

}
</script>
