import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
