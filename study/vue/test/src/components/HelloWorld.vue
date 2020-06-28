<template>
  <div class="hello">
    <button @click="data=null">data=null</button>
    <button @click="data={a:1}">data={a:1}</button>
    <button @click="data={b:2}">data={b:2}</button>
    CHILD:<child :data="data"></child>
 </div>
</template>

<script>
import child from './child.vue'
export default {
  name: 'HelloWorld',
  components:{
    child
  },
  data () {
    return {
      data: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
