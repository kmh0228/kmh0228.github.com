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
    pieData: {
      type: Array,
      default: () => []
    },
    legendData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let { pieData, legendData, id } = this
      let obj
      let len = pieData.length
      let seriesData = []
      for (let i = 0; i < len; i++) {
        obj = {
          name: legendData[i],
          value: pieData[i]
        }
        seriesData.push(obj)
      }
      const seriesTitle = id === 'reponseRate' ? '响应时间超时率' : '处理时间超时率'
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
          left: 'left',
          data: pieData
        },
        series: [
          {
            name: seriesTitle,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: seriesData,
            label:
            {
              show: true,
              position: 'inside',
              formatter: '{d}%'
            },
            itemStyle: {
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
