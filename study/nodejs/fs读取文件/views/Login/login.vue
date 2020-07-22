<template>
  <el-row class="mes-login">
    <!-- <div class="mes-login-icon" @click="showVideo = true">
      <div class="video-icon">
        <mes-icon icon="video" size="2.6vw" ></mes-icon>
      </div>
      <span>视频介绍</span>
    </div> -->
    <div style="position:absolute; top:25px; right:25px;">
      <language :showLabel="true" :icon="'earth'"></language>
    </div>
    <ul class="affix-group">
      <li class="affix-item">
        <div class="affix-item-icon" style="background-color:#00B8FF" @click="showVideo = true">
          <mes-icon icon="video_1" size="1.2vw" suffix="png"></mes-icon>
        </div>
        <span class="affix-item-text" style="background-color:#00B8FF">视频介绍</span>
      </li>
      <li class="affix-item">
        <div class="affix-item-icon" style="background-color:#7ED321" @click="toMaxvaisual">
          <mes-icon icon="maxvisual" size="1.2vw" suffix="png"></mes-icon>
        </div>
        <span class="affix-item-text" style="background-color:#7ED321">可视化系统</span>
      </li>
      <li class="affix-item">
        <el-popover placement="left" trigger="click">
          <div>
            <p style="text-align:center;">扫一扫，下载App</p>
            <vue-qr :value="downloadUrl" cls="app-qrcode"></vue-qr>
            <p style="text-align:center;">（目前仅支持安卓手机）</p>
          </div>
          <div class="affix-item-icon" slot="reference" style="background-color:#F5A623">
            <mes-icon icon="app-store" size="1.2vw" suffix="png"></mes-icon>
          </div>
        </el-popover>
        <span class="affix-item-text" style="background-color:#F5A623">下载App</span>
      </li>
      <li class="affix-item">
        <el-popover placement="left" trigger="click">
          <div>
            <p style="text-align:center;">扫一扫，绑定App</p>
            <vue-qr :value="userInfo.corpCode" cls="app-qrcode"></vue-qr>
          </div>
          <div class="affix-item-icon" slot="reference" style="background-color:#F56C6C">
            <mes-icon icon="scan" size="1.2vw" suffix="png"></mes-icon>
          </div>
         </el-popover>
        <span class="affix-item-text" style="background-color:#F56C6C">绑定App</span>
      </li>
      <!-- <li class="affix-item">
        <div class="affix-item-icon" style="background-color:#7ED321">
          <mes-icon icon="contact" size="1.2vw" suffix="png"></mes-icon>
        </div>
        <span class="affix-item-text" style="background-color:#7ED321">联系我们</span>
      </li> -->
    </ul>
    <transition name="login-video">
      <div class="mes-login-video" v-if="showVideo">
        <span class="video-close" @click="showVideo = false">关闭</span>
        <video controls="controls" autoplay="autoplay" style="width: 100%;height: 100%;">
          <source src="https://cloudmes.maxnerva.com/static/video/introduction_v3.mp4" type="video/mp4" />请更换支持H5主流浏览器
        </video>
      </div>
    </transition>

    <!-- <div class="mes-app-qrcode">
      <vue-qr text="Hello world!" qid="testid"></vue-qr>
    </div> -->

    <el-col :span="4" :offset="1" class="mes-login-logo">
      <img src="static/images/company-logo.png" />
    </el-col>
    <el-col :span="6" :offset="2" class="mes-login-center">
      <!-- <img src="static/images/mes-icon.png" /> -->
      <!-- <img src="static/images/mes-text.png" /> -->
      <img src="static/images/mes-logo.png" class="mes-logo"/>
    </el-col>
     <el-col :span="7" :offset="2" class="mes-login-form el-row" @keydown.enter.native="login" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.7)">
       <el-col :span="24">
        <div class="login-form-haed">
          <h3>密码登录</h3>
          <img src="static/images/qr_code.png" class="qr-code-icon"/>
        </div>
       </el-col>
       <el-col :span="24">
         <el-input v-model.trim="userInfo.username" size="large" autofocus placeholder="工号/会员名/8位ID"></el-input>
       </el-col>
        <el-col :span="24">
          <el-input v-model.trim="userInfo.password" type="password" size="large" placeholder="请输入登录密码" show-password></el-input>
       </el-col>
       <el-col :span="24">
          <p class="login-form-btn" @click="login">登 录</p>
       </el-col>
       <el-col :span="24">
          <p class="login-form-remember">
            <span>记住登录状态</span>
            <i class="fa" :class="rememberIconClass" @click="isRemember = !isRemember"></i>
          </p>
       </el-col>
       <!-- <el-col :span="24">
          <ul class="login-form-foot">
            <li>忘记密码</li>
            <li>忘记账号</li>
            <li>注册账号</li>
          </ul>
       </el-col> -->
    </el-col>
    <p class="mes-login-copy">Copyright ©2019 <a href="http://www.maxnerva.com" target="__blank">云智汇科技服务有限公司</a> | 版权所有</p>
  </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import vueQr from 'v-qrcode'
import language from '@/components/language'
export default {
  data () {
    return {
      userInfo: {
        username: '',
        password: '',
        corpCode: ''
      },
      isRemember: false,
      loading: false,
      showVideo: false,
      qrCode: 'SGVsbG8gV29ybGQh'
    }
  },
  computed: {
    rememberIconClass () {
      return this.isRemember ? 'fa-dot-circle-o active' : 'fa-circle-o no-active'
    },
    downloadUrl () {
      const url = '/AppDownload'
      return location.protocol + '//' + location.host + '#' + url
    }
  },
  watch: {
    isRemember (val) {
      if (!val) {
        Cookies.remove('username')
        Cookies.remove('password')
      }
    }
  },
  methods: {
    toMaxvaisual () {
      window.open('/MaxVisual/#/login')
    },
    loginPrompt (message, type = 'warning', title = '提示') {
      this.$notify({
        type,
        title,
        message,
        position: 'bottom-right'
      })
    },
    validateUserInfo (username, password) {
      this.$notify.closeAll()
      if (!username) {
        this.loginPrompt('请输入登录账号！')
        return false
      }
      if (!password) {
        this.loginPrompt('请输入登录密码！')
        return false
      }
      return true
    },
    // 获取cookies并填充到输入框上
    getCookies () {
      if (Cookies.get('username') && Cookies.get('password')) {
        this.isRemember = true
        this.userInfo.username = atob(Cookies.get('username'))
        this.userInfo.password = atob(Cookies.get('password'))
      }
    },
    async login () {
      // sessionStorage.setItem('sid', 'be4d71419b3840d48f5c3b508d350958')
      let { username, password } = this.userInfo
      Cookies.set('username', btoa(username), { expires: 7 })
      if (this.isRemember) {
        Cookies.set('password', btoa(password), { expires: 7 })
      }
      let validatResult = this.validateUserInfo(username, password)
      if (validatResult) {
        this.loading = true
        try {
          let res = await this.$api.login(this.userInfo)
          let { code, msg } = res
          if (code === '200') {
            let data = JSON.parse(res.data)
            if (data.result === 'true') {
              let { sessionid, user } = data
              if (user.userType === 'employee') {
                sessionStorage.sid = sessionid
                sessionStorage.userName = user.userName
                sessionStorage.companyName = user.corpName_
                sessionStorage.corpCode = user.corpCode_
                setTimeout(() => {
                  this.$router.push('/index')
                }, 2000)
              } else {
                this.loading = false
                this.loginPrompt('账号有误，请联系管理员！', 'error')
              }
            }
          } else {
            this.loading = false
            this.loginPrompt(msg, 'error')
          }
        } catch (error) {
          this.loading = false
        }
      }
    }
  },
  created () {
    // this.getAppDownloadUrl()
    this.userInfo.corpCode = this.$route.query.corp || '0'
    this.$store.dispatch('setTagList')
    this.getCookies()
  },
  components: { vueQr, language }
}
</script>
<style lang="scss">
@import "../../styles/login.scss";
.login-video-enter-active {
  animation: login-video 1s;
}
.login-video-leave-active {
  animation: login-video 1s reverse;
}

@keyframes login-video {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}
</style>
