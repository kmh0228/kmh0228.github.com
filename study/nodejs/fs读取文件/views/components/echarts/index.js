// 全局注册响应式echarts中间件
import charts from './echarts'
// 当天工单完成率
import halfDonut from './option/halfDonut'
// 当天关键指标
import kpiBar from './option/kpiBar'
// 当天不良类别TOP5
import topPie from './option/topPie'
// 库存水位预警
import waterLine from './option/waterLine'

const components = {
  charts,
  halfDonut,
  kpiBar,
  topPie,
  waterLine
}

const plugin = Vue => {
  if (plugin.installed) {
    return false
  }
  let eleName = Object.keys(components)
  eleName.forEach(ele => {
    Vue.component(ele, components[ele])
  })
}

export default plugin
