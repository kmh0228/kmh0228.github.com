<template>
  <div class="echart-title">{{title}}</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: '暂无内容'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.echart-title {
  font-size: 1vw;
  color: #c3c4ca;
  height: 2vh;
  text-align: center;
}
</style>
