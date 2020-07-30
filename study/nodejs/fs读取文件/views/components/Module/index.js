// 全局注册响应式echarts中间件
// 常用组件

// ICO
import mesIcon from '@/components/Icon/icon'

// 字典下拉框
import dictSelect from './dictSelect'
// 表格操作按钮
import handleButton from './handleButton'
// 获取工厂
import cascaderSelect from './cascaderSelect'

// 分页
import mesPage from './pagination'

// Select 下拉框
import mesSelect from './Select/select'

import helpTips from './helpTips/helpTips'

const components = {
  dictSelect,
  handleButton,
  cascaderSelect,
  mesIcon,
  mesPage,
  mesSelect,
  helpTips
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
