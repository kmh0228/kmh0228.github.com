// 模块标题
import vTitle from './vTitle.vue'
import echartTitle from './echartTitle.vue'

const components = {
  vTitle,
  echartTitle
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
