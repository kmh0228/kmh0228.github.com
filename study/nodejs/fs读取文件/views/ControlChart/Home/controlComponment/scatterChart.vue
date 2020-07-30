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
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      let keyList = []
      let len = 0
      let sampleList = []
      let measureList = []
      let data = []
      if (this.tableData.length > 0) {
        keyList = Object.keys(this.tableData[0])
        len = keyList.length - 2
        sampleList = keyList.slice(0, len)
        this.tableData.forEach((e, index) => {
          let value = []
          let measure = []
          for (let i in e) {
            value.push(e[i])
          }
          measure = value.slice(0, len)
          measureList.push(measure)
        })
        for (let index = 0; index < len; index++) {
          measureList.forEach(e => {
            data.push([sampleList[index], e[index]])
          })
        }
      }
      return {
        title: {
          text: 'Point—' + this.$t('common_ContrChar'),
          left: '5%'
        },
        tooltip: {
          // trigger: 'axis'
          formatter: params => {
            return [
              this.$t('common_Number') + ': ' + params.value[0],
              this.$t('conChartHome_MeasuValu') + ': ' + params.value[1]
              // '采样时间: ' + params.value[2],
              // 'MDI: ' + params.value[3]
            ].join('<br/>')
          }
        },
        xAxis: {
          type: 'category',
          scale: true,
          splitLine: false
        },
        yAxis: {
          type: 'value',
          scale: true,
          splitLine: false
        },
        series: [
          {
            type: 'scatter',
            data: data
          }
        ]
      }
    }
  }
}
</script>
