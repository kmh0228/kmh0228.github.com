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
  props:{
    // 接受父组件的水果信息，做到三种情况第一种父亲只给字符串，从自己的信息库里找到相应属性
    // 第二种父亲给个json,用type跟自己的信息库相连,需要整合传入的水果信息和自己的信息库
    // 第三种，父亲给个json，但是没有给type或者信息库没有对应的type，此时无需使用信息库信息，直接使用父亲给的信息
    fruits:{
      type: Array,
      default : () => []
    },
  },
  data () {
   return {
     fruitsDeafult:{ // 信息库
      apple:{color:'red',sale:0},
      pear:{color:'yellow',weight:8,price:6},
      banana:{color:'yellow',weight:1.8,price:8},
      modelMark:{},
      noneEnd:{sale:0}
     },
     //myFruits:[]
   }
  },
  computed:{
    myFruits ( ){
      let result = this.fruits.map(element => {
          return typeof element === 'string'?this.fruitsDeafult[element]
          :Object.assign({},this.fruitsDeafult[element.type] ||this.fruitsDeafult.modelMark, element)
       })
       //result.push({sale:0})
       return result
    }
  },
  methods:{
    async getsale(data){
      let timeout = setTimeout(()=>{
        //data.sale = (Math.random()*60+40).toFixed(0)
        this.$set(data,'sale',(Math.random()*60+40).toFixed(0))
      },1000)
    }
  },
  created(){
    // this.myFruits = this.fruits.map(element => {
    //     return typeof element === 'string'?this.fruitsDeafult[element]
    //     :Object.assign({},this.fruitsDeafult[element.type] ||this.fruitsDeafult.modelMark, element)
    //   })
    this.myFruits.forEach(item=>{
      this.getsale(item)
    })
  }
}
</script>
