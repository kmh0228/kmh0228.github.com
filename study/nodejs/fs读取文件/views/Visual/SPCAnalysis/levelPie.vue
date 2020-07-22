<template>
  <charts id="level_pie" :option="option"></charts>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      const { dataList } = this
      const data = []
      dataList.forEach(item => {
        data.push({
          name: item.level,
          value: item.value
        })
      })
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: '30px',
          x: 'center',
          textStyle: {
            fontSize: 14,
            color: '#fff'
          }
        },
        series: {
          name: '级别分布',
          type: 'pie',
          radius: '60%',
          center: ['50%', '45%'],
          label: {
            fontSize: 14,
            formatter: '{b} : {c}'
          },
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      }
    }
  },
  methods: {}
}
</script>
