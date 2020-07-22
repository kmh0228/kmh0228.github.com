<template>
  <div class="hello">
    <div>
      <select v-model="lange" @change="change">
        <option value="enUS">英文</option>
        <option value="zhCN">中文</option>
        <option value="zhTW">甲骨文</option>
      </select>
      <br>
      {{$t(msg)}}
    </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
  name: 'HelloWorld',
  data () {
    return {
      lange:this.$store.state.lange,
      msg: '中文'
    }
  },
  watch:{
    lange(val){
      this.$i18n.locale = val
      console.log(val)
    }
  },
  methods:{
    ...mapMutations([
      'CHANGE_LANGE'
    ]),
    change(){
      this.CHANGE_LANGE(this.lange)
      localStorage.setItem('lange',this.lange)
    }
  },
  mounted(){
    
  }
}
</script>