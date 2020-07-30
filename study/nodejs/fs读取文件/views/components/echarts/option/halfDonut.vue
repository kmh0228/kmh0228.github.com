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
    },
    rate: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  computed: {
    option () {
      let { rate } = this
      return {
        series: [{
          type: 'gauge',
          radius: '120%',
          max: 100,
          center: ['50%', '75%'],
          startAngle: 180,
          endAngle: 0,
          splitNumber: 1,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [rate, '#00B297'],
                [1, '#DCDCDC']
              ]
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#333333',
            fontSize: 16,
            distance: -30,
            padding: [30, 0, 0, 5]
          },
          pointer: {
            show: false
          },
          detail: {
            offsetCenter: [0, '-10'],
            formatter: value => {
              return (value * 100).toFixed(1) + '%'
            },
            color: '#2F78BE',
            fontSize: 24
          },
          data: [rate]
        }]
      }
    }
  },
  methods: {
  }
}
</script>
