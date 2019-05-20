<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
<style lang="less">
  .home{
    width:100%; height:100%;
    img{
      width:100%; height:100%;
      filter:blur(65px);
      //opacity:0.6;
    }
  }
</style>

