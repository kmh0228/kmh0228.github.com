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
    }
  },
  computed: {
    option () {
      let xData = []
      let seriesData = []
      let obj
      this.pieData.forEach(item => {
        obj = {
          name: item.failCode,
          value: item.countNumber ? item.countNumber : item.countTime
        }
        seriesData.push(obj)
        xData.push(item.failCode)
      })
      let seriesName = this.id === 'trobleNumber' ? '故障异常次数' : '故障异常时间'
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
          data: xData
        },
        series: [
          {
            name: seriesName,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: seriesData,
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
