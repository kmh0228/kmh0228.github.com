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
          data: [this.$t('achievemRate_SpotChec'), this.$t('achievemRate_maint')],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: this.$t('achievemRate_QuantAchiNum'),
          data: this.reachData,
          type: 'bar',
          barWidth: '30px'
        }, {
          name: this.$t('achievemRate_QuantNotReac'),
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
