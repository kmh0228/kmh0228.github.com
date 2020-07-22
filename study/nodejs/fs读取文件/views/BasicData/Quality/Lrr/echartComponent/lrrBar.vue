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
    xData: {
      type: Array
    },
    barSeiesData: {
      type: Array
    },
    barTitle: {
      type: String
    }
  },
  computed: {
    option () {
      const len = this.barSeiesData.length
      return {
        title: {
          text: this.barTitle,
          x: 'center'
        },
        tooltip: {},
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: len > 10 ? len > 20 ? 25 : 50 : 100
          },
          {
            show: len > 10,
            type: 'slider',
            backgroundColor: 'rgba(47,69,84,0)'
          }
        ],
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.barSeiesData,
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        }]
      }
    }
  },
  methods: {
  }
}
</script>
