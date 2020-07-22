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
      let xData = []
      let seriesData = []
      this.lineData.forEach(item => {
        xData.push(item.name)
        seriesData.push(item.value)
      })
      return {
        title: {
          text: this.lineTitle,
          x: 'center'
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
