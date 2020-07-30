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
    id: {
      type: String
    },
    pieData: {
      type: Array
    },
    echartTitle: {
      type: String
    }
  },
  computed: {
    option () {
      return {
        title: [{
          text: this.echartTitle,
          x: '30%'
        }],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [this.$t('lrr_DirecAcce'), this.$t('lrr_MailMark'), this.$t('lrr_AlliaAdve'), this.$t('lrr_VideoAdve'), this.$t('lrr_SearcEngi')]
        },
        series: [
          {
            name: this.$t('lrr_SourcVisi'),
            type: 'pie',
            radius: '75%',
            center: ['50%', '60%'],
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              formatter: '{b}: {c} ({d}%)'
            }
          }
        ]
      }
    }
  },
  methods: {
  }
}
</script>
