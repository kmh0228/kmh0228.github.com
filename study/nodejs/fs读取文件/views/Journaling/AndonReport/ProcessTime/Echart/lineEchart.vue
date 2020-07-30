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
    lineTitle: String,
    lineData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      const seriesName = this.id === 'reponseNoOvertimeCount' ? this.$t('processTime_RespoAverTimeTren') : this.$t('processTime_TrendAverProcTime')
      let xData = []
      let seriesData = []
      this.lineData.forEach(item => {
        xData.push(item.title)
        seriesData.push(item.value)
      })
      return {
        title: {
          text: seriesName,
          x: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'

        },
        xAxis: {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: '40'
          }
        },
        yAxis: {
          type: 'value'
          // splitLine: {
          //   show: false
          // }
        },
        series: [{
          data: seriesData,
          type: 'line'
        }]
      }
    }
  }

}
</script>
