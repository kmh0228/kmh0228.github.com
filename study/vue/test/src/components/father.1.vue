<template>
  <div>
    data
    <div v-for="(item,i) in myFruits" :key="i">
      {{item.color}} -- {{item.sale}}
    </div>
 </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
   return {
     fruits:[ {color:'red',sale:0},
        {color:'yellow',sale:0}
       ]
     //myFruits:[]
   }
  },
  computed:{
    myFruits ( ){
      let result = [...this.fruits]
      result.push({'color':'pink',sale:0})
      return result
    }
  },
  methods:{
    getsale(data){
      let timeout = setTimeout(()=>{
        this.$set(data,'sale',(Math.random()*60+40).toFixed(0))
      },1000)
    }
  },
  created(){
    this.myFruits.forEach(item=>{
      this.getsale(item)
    })
  }
}
</script>
