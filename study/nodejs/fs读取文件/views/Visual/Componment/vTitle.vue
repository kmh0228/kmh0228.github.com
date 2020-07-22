<template>
  <div class="item-title" :style="{height:titleHight}">
    <p>{{title}}<sub>{{subTitle}}</sub></p>
    <img src="static/images/titile-line.png" class="item-line">
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    titleHight: {
      type: String,
      default: '15%'
    },
    subTitle: {
      type: String,
      default: ''
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.item-title {
  position: relative;
  // height: 20%;
  width: 70%;
  margin: 0 auto;

  p {
    font-size: 1vw;
    font-weight: bold;
    text-align: center;
    color: #fff;
    padding-top: 1vh;
    sub {
      margin-left: 10px;
      font-size: 0.7vw;
    }
  }

  .item-line {
    height: 6%;
    width: 100%;
  }
}
</style>
