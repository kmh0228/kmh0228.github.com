<template>
  <charts :id="id" :option="option" ></charts>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    id: String,
    barTitle: String,
    barData: {
      type: Array,
      default: () => []
    }
    // seriesData: {
    //   type: Array,
    //   default: () => []
    // }
  },
  computed: {
    option () {
      let xData = []
      let seriesData = []
      this.barData.forEach(item => {
        for (let i in item) {
          if (i === 'resourceCode') {
            xData.push(item[i])
          } else if (i === 'countNumber') {
            seriesData.push(item[i])
          } else if (i === 'countTime') {
            seriesData.push(item[i])
          }
        }
      })
      let ydata = this.id === 'deviceTrobleNumber' ? '单位/次' : '单位/分钟'
      return {
        title: {
          text: this.barTitle,
          x: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // name: '设备',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: ydata,
            nameTextStyle: {
              color: '#F56C6C',
              fontStyle: 'bold',
              fontSize: 15
            },
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            }
          }
        ],
        series: [
          {
            name: ydata,
            type: 'bar',
            barWidth: '30px',
            animationDelay: (idx) => idx * 10,
            data: seriesData
          }
        ]
      }
    }
  }

}
</script>
