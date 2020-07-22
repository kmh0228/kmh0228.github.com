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
      if (pieData.length === 0) {
        return {
          title: {
            text: '暂无数据',
            x: 'center',
            y: '30%',
            textStyle: {
              color: '#fff',
              fontSize: 18,
              fontWeight: 600
            }
          }
        }
      }
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
          orient: 'vertical',
          left: '5%',
          data: nameData,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '80%',
            center: [this.left, '45%'],
            data: this.pieData,
            label: {
              show: true,
              position: 'inside',
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
