import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        lange:'' // 语言
    },
    mutations:{
        CHANGE_LANGE(state,str){
            state.lange = str
        }
    }
})
