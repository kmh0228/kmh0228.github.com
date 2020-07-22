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
    title: {
      type: String
    },
    rate: {
      type: Number,
      default: 0
    }
  },
  computed: {
    option () {
      return {
        series: [{
          name: this.title,
          min: 0,
          max: 120,
          type: 'gauge',
          detail: {
            offsetCenter: [0, '80%'],
            fontSize: 20,
            formatter: v => {
              return v + '%'
            }
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.8333, '#34FBD4'],
                [1, '#FF5AFF']
              ]
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            distance: -16,
            formatter: v => {
              switch (v + '') {
                case '0':
                  return '0'
                case '60':
                  return '60'
                case '120':
                  return '120'
              }
            }
          },
          radius: '85%',
          pointer: {
            length: '55%',
            width: 4
          },
          data: [this.rate]
        }]
      }
    }
  },
  methods: {
  }
}
</script>
