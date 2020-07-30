<template>
  <div class="mes-header">
    <div class="header-logo">
      <i class="fa fa-reorder" @click="$emit('toggleMenu')" :class="rotateClass"></i>
      <img src="static/images/logo_v4.png">
    </div>
    <div class="header-show-menu">
      <span>{{ currentMenuTitle }}</span>
      <i class="el-icon-error" v-show="showClose" @click="$store.dispatch('closeCurrentPage',{title:currentMenuTitle})"></i>
    </div>
    <div class="header-user-info">
      <div class="header-company">
        <mes-icon icon="company" className="header-icon" size="1.2vw" suffix="svg"></mes-icon>
        <span>{{$t('component_CurreEnte')}}</span>
        <span>{{ companyName }}</span>
      </div>
      <div class="header-icons">
        <el-tooltip class="item" effect="dark" :content="$t('component_FullScre')" placement="bottom">
          <mes-icon icon="full-screen" className="header-icon" size="1.2vw" suffix="svg" @click.native="$emit('open-full-screen')"></mes-icon>
        </el-tooltip>
        <!-- 多语言功能 -->
        <language></language>
        <!-- 个人中心 -->
        <el-dropdown placement="bottom" size="medium">
          <mes-icon icon="profile" className="header-icon" size="1.2vw" suffix="svg"></mes-icon>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user-solid">{{$t('common_MyCenter')}}</el-dropdown-item>
            <el-dropdown-item style="border-bottom:1px solid #ccc;margin-bottom:0.5vh;" icon="el-icon-key" @click.native="dialogVisible = true">{{$t('common_ChangePassword')}}</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" @click.native="logout">{{$t('common_LogOff')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-dropdown placement="bottom" size="medium">
          <mes-icon icon="fontSize" className="header-icon" size="1.2vw" suffix="svg"></mes-icon>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="chngeFontSize(1)">小</el-dropdown-item>
            <el-dropdown-item @click.native="chngeFontSize(2)">中等</el-dropdown-item>
            <el-dropdown-item @click.native="chngeFontSize(3)">大</el-dropdown-item>
            <el-dropdown-item @click.native="chngeFontSize(4)">特大</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!-- <mes-icon icon="help" className="header-icon" size="1.2vw" suffix="svg"></mes-icon> -->
      </div>
      <div class="header-info">
        <p>{{ userName }}</p>
      </div>
    </div>
    <el-dialog :title="$t('common_ChangePassword')" :visible.sync="dialogVisible" width="550px">
      <el-form :model="pwdForm" v-if="dialogVisible" ref="pwdForm" :rules="pwdRule" label-width="100px" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('component_OrigiPass')" prop="oldPwd">
          <el-input type="password" v-model.trim="pwdForm.oldPwd" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('component_NewPass')" prop="newPwd">
          <el-input type="password" v-model.trim="pwdForm.newPwd" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('component_ConfiPass')" prop="verifyPwd">
          <el-input type="password" v-model.trim="pwdForm.verifyPwd" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary">{{$t('common_ok')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import language from '@/components/language'
export default {
  name: 'mesHeaer',
  components: { language },
  data () {
    return {
      dialogVisible: false,
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        verifyPwd: ''
      }
    }
  },
  props: ['isCollapse'],
  computed: {
    ...mapState(['currentMenuTitle']),
    pwdRule () {
      const newPwdRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('component_NewPassCannBeEmpt')))
        } else {
          let len = value.length
          if (len < 6) {
            callback(new Error(this.$t('component_NewPassLengLessThan6')))
          } else {
            callback()
          }
        }
      }
      const verifyPwdRule = (rule, value, callback) => {
        let { newPwd } = this.pwdForm
        if (value !== newPwd) {
          callback(new Error(this.$t('component_PasswIncoReen')))
        } else {
          callback()
        }
      }
      return {
        oldPwd: [{ required: true, message: this.$t('component_origiPassCannBeEmpt') }],
        newPwd: [{ required: true, validator: newPwdRule }],
        verifyPwd: [{ required: true, validator: verifyPwdRule }]
      }
    },
    rotateClass () {
      return this.isCollapse ? 'icon-rate' : 'icon-rate-no'
    },
    showClose () {
      return this.currentMenuTitle !== this.$t('component_homep')
    },
    userName () {
      let userName = sessionStorage.userName || ''
      return userName
    },
    companyName () {
      let companyName = sessionStorage.companyName || ''
      return companyName
    }
  },
  methods: {
    async logout () {
      let isLogout = await this.$myPrompt.confirm(this.$t('component_AreYouSureLogOut'))
      if (isLogout) {
        const corpCode = sessionStorage.corpCode || 0
        this.$api.logout().then(() => {
          this.$router.push(`/login?corp=${corpCode}`)
        }).catch(e => {
          this.$router.push(`/login?corp=${corpCode}`)
        })
      }
    },
    chngeFontSize (size) {
      localStorage.setItem('fontSize', size)
      location.reload()
    }
  }
}
</script>
