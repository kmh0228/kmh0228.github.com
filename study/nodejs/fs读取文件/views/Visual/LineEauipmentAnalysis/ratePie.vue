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
    rateData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    option () {
      const { rateData } = this
      if (rateData.length > 0) {
        if (rateData[0].value === 0 && rateData[1].value === 0) {
          return {
            title: {
              text: '暫無數據',
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
        let obj1 = {
          color: '#3FECF7'
        }
        let obj2 = {
          color: '#C4C4C4'
        }
        rateData.forEach((item, i) => {
          item.itemStyle = item.name === '达成数' ? obj1 : obj2
        })
        return {
          title: [
            {
              text: '达成率',
              x: 'center',
              y: '35%',
              textStyle: {
                color: '#fff',
                fontSize: 18,
                fontWeight: 600
              }
            },
            {
              text: rateData[0].completionRate + '%',
              x: 'center',
              y: '50%',
              textStyle: {
                color: '#fff',
                fontSize: 26,
                fontWeight: 600
              }
            }
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: ['55%', '75%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: true,
              label: {
                show: false
              },
              data: rateData
            }
          ]
        }
      } else {
        return {
          title: {
            text: '暫無數據',
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
  },
  methods: {}
}
</script>
