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
    pieTitle: String,
    seriesData: {
      type: Array,
      default: () => []
    },
    labelData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      return {
        title: {
          text: this.pieTitle,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: this.labelData
        },
        series: [
          {
            name: this.$t('achievemRate_AnalySpotInspAchiRate'),
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              fontSize: '15'
            },
            data: this.seriesData,
            itemStyle: {
              color: params => {
                return params.name === this.$t('achievemRate_QuantAchi') ? '#37A2DA' : '#FF4040'
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }

}
</script>
