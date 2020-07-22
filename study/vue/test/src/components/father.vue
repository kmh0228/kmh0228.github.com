<template>
  <div>
    <p v-for="(inner,i) in mlist" :key="i">
      {{inner}}
    </p>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
   return {
     list:[{zhcn:'三个字'},{zhcn:'五个字字字'},{zhcn:'四个字字'},{zhcn:'俩字'},{zhcn:'字'},{zhcn:'六个字字字字'}]
   }
  },
  computed:{
    mlist(){
      return this.list.filter(item=>item.zhcn.length!==4).sort((a,b)=>a.zhcn.length>b.zhcn.length).slice(0,5)
    }
  },
  methods:{
    btnClick(){
      axios.get('https://fanyi.baidu.com/#zh/en/'+this.text).then(result => {
        console.log(result)
        this.resultText = result.data
      })
    }
  },
  created(){

  }
}
</script>
