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
    pieData: {
      type: Array,
      default: () => []
    },
    left: {
      type: String,
      default: '50%'
    }
  },
  computed: {
    option () {
      let { pieData } = this
      let nameData = []
      pieData.forEach(item => {
        nameData.push(item.name)
      })
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: nameData,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: [this.left, '50%'],
            data: this.pieData,
            label: {
              show: true,
              position: 'outside',
              formatter: ' {d}%'
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
