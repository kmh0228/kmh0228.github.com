<template>
  <div class="hello">
    child接受到的数据:</br>
    {{content}}
 </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props:['data'],
  data () {
    return {
      content:'初始状态'
    }
  },
  watch:{
    data:{
      handler(newval){
        this.content = '监控到了数据：' + JSON.stringify(newval);
      },
      deep:true
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
