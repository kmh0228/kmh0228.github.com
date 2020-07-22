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
    unit: String,
    barData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      if (this.barData.length > 0) {
        let xData = []
        let seriesData = []
        this.barData.forEach(item => {
          xData.push(item.name)
          seriesData.push(item.value)
        })
        return {
          title: {
            text: this.barTitle,
            x: 'center'
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'cross' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '0',
            right: '0',
            bottom: '15px',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisLine: {
                lineStyle: {
                  color: '#00B5FF'
                }
              },
              axisLabel: {
                color: '#fff'
              }
            }
          ],
          yAxis: [
            {
              name: this.unit,
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#00B5FF'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#3398DB',
                  type: 'dashed'
                }
              },
              axisLabel: {
                color: '#fff'
              }
            }],
          series: [
            {
              name: '柱形',
              type: 'bar',
              barWidth: '30px',
              data: seriesData,
              itemStyle: {
                color: '#2DC2D0'
              },
              label: {
                show: true,
                position: 'top',
                fontWeight: 'bold',
                fontSize: 16
              }
            }
          ]
        }
      } else {
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
    }
  }

}
</script>
