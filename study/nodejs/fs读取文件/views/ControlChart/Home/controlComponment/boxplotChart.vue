<template>
  <charts :id="id" :option="option"></charts>
</template>

<script>
import echarts from '@/components/echarts'
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
      let measureValue = []
      let measureData = []
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
            measureValue.push(e[index])
          })
        }
        for (var i = 0; i < measureValue.length; i += 3) {
          measureData.push(measureValue.slice(i, i + 3))
        }
      }
      echarts.dataTool = require('echarts/extension/dataTool')
      let data = echarts.dataTool.prepareBoxplotData(measureData)
      return {
        title: {
          text: 'Box—' + this.$t('common_ContrChar'),
          left: '5%'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: sampleList,
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitArea: {
            show: true
          }
        },
        series: [
          {
            type: 'boxplot',
            data: data.boxData,
            itemStyle: {
              lineColor: '#333'
            },
            tooltip: {
              formatter: function (param) {
                return [
                  this.$t('common_Number') + ': ' + param.name,
                  this.$t('conChartHome_Maxim') + ': ' + param.data[5],
                  'Q3: ' + param.data[4],
                  this.$t('conChartHome_averaValu') + ': ' + param.data[3],
                  'Q1: ' + param.data[2],
                  this.$t('conChartHome_minimValu') + ': ' + param.data[1]
                ].join('<br/>')
              }
            }
          }
        ]
      }
    }
  }
}
</script>
