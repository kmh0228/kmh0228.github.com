<template>
  <div class="error-page">
    <div class="content-con">
      <img src="static/images/error-page-404.svg" :alt="code">
      <div class="text-con">
        <h4>{{ code }}</h4>
        <h5>{{ desc }}</h5>
      </div>
      <div class="back-btn-group">
        <el-button size="large" type="text" @click="backHome">返回首页</el-button>
        <el-button size="large" type="text" @click="backPrev">返回上一页({{ second }}s)</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      code: '404',
      desc: 'Oh~~您的页面好像飞走了~',
      second: 5,
      timer: null
    }
  },
  methods: {
    backHome () {
      this.$router.push('/index')
    },
    backPrev () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrev()
      else this.second--
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss">
.error-page {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8f8f9;
  .content-con {
    width: 50vw;
    height: 60vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    .text-con {
      position: absolute;
      left: 0px;
      top: 0px;
      h4 {
        position: absolute;
        left: 0px;
        top: 0px;
        font-size: 80px;
        font-weight: 700;
        color: #348eed;
      }
      h5 {
        position: absolute;
        width: 700px;
        left: 0px;
        top: 100px;
        font-size: 20px;
        font-weight: 700;
        color: #67647d;
      }
    }
    .back-btn-group {
      position: absolute;
      right: 0px;
      bottom: 20px;
    }
  }
}
</style>
