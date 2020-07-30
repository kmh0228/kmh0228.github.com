<template>
  <div :id="id" style="width:100%;height:100%;"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      charts: null
    }
  },
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    },
    chartsClick: {
      type: Function,
      default () {
        return () => { }
      }
    }
  },
  computed: {
    isRefresh () {
      return this.$store.state.refreshCharts
    }
  },
  watch: {
    option: {
      handler (val) {
        this.charts.clear()
        this.charts.setOption(val)
      },
      deep: true
    },
    isRefresh (val) {
      this.charts.resize()
    }
  },
  methods: {
    setOption (option) {
      let ele = document.getElementById(this.id)
      this.charts = echarts.init(ele, 'light')
      this.charts.setOption(option)
    }
  },
  mounted () {
    let vm = this
    vm.setOption(vm.option)
    vm.$nextTick(() => {
      window.addEventListener('resize', () => {
        vm.charts.resize()
      })
    })
    vm.charts.on('click', params => {
      this.$emit('chartsClick', params)
    })
  }
}
</script>
