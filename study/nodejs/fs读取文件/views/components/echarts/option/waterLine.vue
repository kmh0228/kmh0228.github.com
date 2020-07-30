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
        legend: {
          bottom: '0',
          data: ['Low', 'Meclum', 'Hight', 'Critcal']
        },
        grid: {
          left: '25%',
          right: '5%',
          top: '5%',
          bottom: '30%'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#F1F1F1'
            }
          },
          axisLabel: {
            color: '#AAA'
          },
          data: ['2019-Q1', '2019-Q2']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#AAA',
            formatter: '{value}.00'
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#F1F1F1'
            }
          }
        },
        series: [{
          name: 'Low',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          color: '#00D1FF',
          data: [3, 2]
        }, {
          name: 'Critcal',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          color: '#00B6E6',
          data: [5, 2]

        }, {
          name: 'Meclum',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          color: '#9FD242',
          data: [20, 2]
        }, {
          name: 'Hight',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          color: '#FFB84C',
          data: [45, 2.5]
        }]
      }
    }
  },
  methods: {
  }
}
</script>
