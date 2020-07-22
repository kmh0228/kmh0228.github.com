
import Vue from 'vue'
import I18n from 'vue-i18n'
Vue.use(I18n)
// export default new I18n({
//   locale: 'enUS',
//   message: {
//     'enUS':{'中文':'china'},
//     'zhCN':{'中文':'中文'},
//     'zhTW':{'中文':'中温'}
//   }
// })


// import Vue from 'vue'
// import I18n from 'vue-i18n'
// Vue.use(I18n)
export default new I18n({
  locale:'enUS',
  messages:{
    'enUS':{'中文':'china'},
    'zhCN':{'中文':'中文'},
    'zhTW':{'中文':'中温'}
  }
})

