<template>
  <div class="app-download-page">
    <div class="app-download-tips" v-show="showTips" @click="showTips = false">
      <img src="static/images/android_browser_tips.png" />
    </div>
    <div class="app-logo">
      <img src="static/images/logo_v4.png" />
    </div>
    <div class="app-introduce">
      <img src="static/images/app-home.png" />
    </div>
    <div class="app-download-btn">
       <p @click="getUserAgent">立 即 下 载</p>
    </div>
    <p class="app-copy">Copyright ©2019 <a href="http://www.maxnerva.com" target="__blank">云智汇科技服务有限公司</a> | 版权所有</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showTips: false
    }
  },
  methods: {
    async getAppDownloadUrl () {
      const data = new FormData()
      data.append('osType', 'android')
      const res = await this.$api.getAppDownloadUrl(data)
      if (res.mappUpdate.downloadUrl) {
        window.open(res.mappUpdate.downloadUrl, '_top')
      }
    },
    getUserAgent () {
      const userAgent = navigator.userAgent.toLowerCase()
      if (/microMessenger/i.test(userAgent)) {
        this.showTips = true
      } else {
        this.getAppDownloadUrl()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-download-page {
  width: 100%;
  height: 100%;
  background: linear-gradient(top, #0b4283, #071633);
  .app-download-tips {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 10;
    img {
      display: block;
      width: 90%;
      height: auto;
      margin: 0 auto;
    }
  }
  .app-logo {
    width: 80%;
    margin: 0 auto;
    padding: 30px 0;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .app-introduce {
    width: 80%;
    height: 60%;
    margin: 0 auto;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .app-download-btn {
    width: 80%;
    margin: 15px auto;
    p {
      background-color: #00b8ff;
      text-align: center;
      color: #fff;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .app-copy {
    position: absolute;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 12px;
    bottom: 10px;
    a {
      color: #fff;
      text-decoration: none;

      &:hover {
        color: #00b8ff;
        text-decoration: underline;
      }
    }
  }
}
</style>
