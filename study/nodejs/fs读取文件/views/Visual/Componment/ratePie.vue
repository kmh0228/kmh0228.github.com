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
    rateData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let { rateData } = this
      if (rateData.length === 0) {
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
      let obj1 = {
        color: '#3FECF7'
      }
      let obj2 = {
        color: '#C4C4C4'
      }
      rateData.forEach((item, i) => {
        item.itemStyle = item.name === '良品数' ? obj1 : obj2
      })
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '直通率',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: params => {
                return params.name === '良品数' ? params.percent + '%' : ''
              },
              textStyle: {
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: rateData
          }
        ]
      }
    }
  },
  methods: {}
}
</script>
