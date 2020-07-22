<template>
  <charts :id="id" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    id: String,
    title: String,
    pieData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      if (this.pieData.length > 0) {
        const { title } = this
        return {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: title,
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              data: this.pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                show: true,
                position: 'inside',
                formatter: '{d}%'
              }
            }
          ]
        }
      } else {
        return {
          title: {
            text: '暂无数据',
            x: 'center',
            y: '40%',
            textStyle: {
              color: '#fff',
              fontSize: 18,
              fontWeight: 600
            }
          }
        }
      }
    }
  }
}
</script>
