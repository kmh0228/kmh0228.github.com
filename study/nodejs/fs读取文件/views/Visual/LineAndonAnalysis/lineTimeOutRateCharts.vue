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
    name: String,
    datas: Object,
    overtime: [Number, String],
    noOvertime: [Number, String]
  },
  computed: {
    option () {
      const { name, overtime, noOvertime } = this
      if (overtime === 0 && noOvertime === 0) {
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
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: name,
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: [
              { value: noOvertime, name: '未超时数量' },
              { value: overtime, name: '超时数量' }
            ],
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
              formatter: params => {
                const { percent } = params
                return percent > 0 ? `${percent}%` : ''
              }
            }
          }
        ]
      }
    }
  }
}
</script>
