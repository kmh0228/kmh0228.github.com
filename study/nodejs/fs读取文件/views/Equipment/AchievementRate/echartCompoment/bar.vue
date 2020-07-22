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
    barTitle: String,
    reachData: {
      type: Array,
      default: () => []
    },
    notReachData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      return {
        title: {
          text: this.barTitle,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} '
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['点检', '保养'],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '达成数量',
          data: this.reachData,
          type: 'bar',
          barWidth: '30px'
        }, {
          name: '未达成数量',
          data: this.notReachData,
          type: 'bar',
          barWidth: '30px',
          itemStyle: {
            color: '#FF4040'
          }
        }]
      }
    }
  }

}
</script>
