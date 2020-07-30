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
    }
  },
  computed: {
    option () {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            let marker = params[1].marker
            let name = params[1].name
            let value = params[1].value
            return `${marker} ${name}：${value}`
          }
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: '5%'
        },
        xAxis: [{
          type: 'value',
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#F1F1F1'
            }
          },
          axisTick: {
            show: false
          }
        }, {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FFF'
            }
          },
          axisTick: {
            show: false
          }
        }],
        yAxis: [{
          type: 'category',
          data: [this.$t('component_BadQuan'), this.$t('component_ShipmQuan'), this.$t('component_ProduQuan')],
          axisLabel: {
            inside: true,
            padding: [-20, 0, 0, -8]
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F1F1F1'
            }
          },
          axisTick: {
            show: false
          }
        }, {
          type: 'category',
          data: ['2000', '20000', '30000'],
          axisLabel: {
            inside: true,
            padding: [-20, -5, 0, 0]
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            type: 'bar',
            barWidth: '35%',
            data: ['', '', ''],
            color: '#007AC1'
          },
          {
            type: 'bar',
            barWidth: '20%',
            barGap: '35%',
            data: [2000, 20000, 30000],
            color: '#007AC1'
          }
        ]
      }
    }
  },
  methods: {
  }
}
</script>
