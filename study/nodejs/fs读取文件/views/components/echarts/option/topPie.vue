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
          trigger: 'item'
        },
        legend: {
          x: 'right',
          y: 'bottom',
          data: ['Top1', 'Top2', 'Top3', 'Top4', 'Top5']
        },
        gird: {
          bottom: '15%'
        },
        series: [
          {
            name: this.$t('component_DefecCateDay') + ' Top5',
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '24',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#00B6E6', '#9FD242', '#FFB84C', '#00D1FF', '#DCDCDC'],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 300, name: 'Top1' },
              { value: 280, name: 'Top2' },
              { value: 50, name: 'Top3' },
              { value: 30, name: 'Top4' },
              { value: 0, name: 'Top5' }
            ]
          }
        ]
      }
    }
  },
  methods: {
  }
}
</script>
