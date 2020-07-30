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
      const seriesDataName = this.id === 'alarmQuestionTop' ? this.$t('common_AlarmProb') : this.$t('processTime_AlarmTimeProc')
      let xData = []
      let seriesData = []
      this.barData.forEach(item => {
        xData.push(item.title)
        seriesData.push(item.value)
      })
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
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: [
          {
            type: 'category',
            // name: '设备',
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
            name: seriesDataName,
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
