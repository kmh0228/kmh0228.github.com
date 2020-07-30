<template>
  <el-container class="mes-layout" >
    <el-header height="5.6vh" v-show="!isFullScreen">
      <mes-header @toggleMenu="toggleMenu" @open-full-screen="openFullScreen" :isCollapse="menuIsCollapse"></mes-header>
    </el-header>
    <el-container>
      <el-aside :width="asideWidth" class="aside-menu-first"  v-show="!isFullScreen">
        <mes-first-menu :isCollapse="menuIsCollapse" @get-next-menus="getNextMenus" ref="firstMenu"></mes-first-menu>
      </el-aside>
      <el-aside :width="secondAsideWith" class="aside-menu-second" v-if="showSecondMenu && showSecondMenu !=='false'"  v-show="!isFullScreen">
        <mes-second-menu ref="secondMenu" :secondMenuList="secondMenuList" :secondNavTitle="secondNavTitle"></mes-second-menu>
      </el-aside>
      <el-aside width="0" class="aside-menu-toggle" v-if="showSecondMenu && showSecondMenu !=='false'"  v-show="!isFullScreen">
        <div class="aside-menu-toggle-icon aside-collapse-left" v-if="secondCollapse">
          <mes-icon icon="collapse-left" size="12px" suffix="png" @click.native="asideMenuToggle"></mes-icon>
        </div>
        <div class="aside-menu-toggle-icon aside-collapse-right" v-else>
          <mes-icon icon="collapse-right" size="12px" suffix="png" @click.native="asideMenuToggle"></mes-icon>
        </div>
      </el-aside>
      <el-main ref="content">
        <transition>
          <template v-if="isIframe">
            <iframe :src="$route.meta.src" style="width:100%;height:100%"></iframe>
          </template>
          <template v-else>
            <el-scrollbar style="height:100%;" v-if="isShowScroll">
              <keep-alive>
                <router-view v-if="iskeepAlive"/>
              </keep-alive>
              <router-view v-if="!iskeepAlive"/>
            </el-scrollbar>
            <router-view v-else/>
          </template>
        </transition>
      </el-main>
    </el-container>
    <el-footer height="30px" class="layout-footer"  v-show="!isFullScreen">
      <el-scrollbar ref="footerScrollbar">
        <span @click="$router.push('/index')">{{$t('component_homep')}}</span>
        <span v-for="(tab,i) in tagList" :key="i" :class="tab.title===currentMenuTitle?'mes-tab-active':''"  @contextmenu.prevent="openContextMenu(tab)" @click="$router.push(tab.fullPath)">
          {{ tab.title }}
          <i class="el-icon-error" v-show="tab.title!==$t('component_homep')" @click.stop="closeCurrentPage({title: tab.title})"></i>
        </span>
      </el-scrollbar>
      <context-menu id="context-menu" ref="ctxMenu">
        <li @click="closeCurrentTag">{{$t('component_CloseCurrTab')}}</li>
        <li @click="closeOtherTags">{{$t('component_CloseOtheTabs')}}</li>
        <li @click="closeAllTags">{{$t('component_closeAllTabs')}}</li>
      </context-menu>
    </el-footer>
    <el-dialog :visible.sync="dialogVisible" :title="$t('component_logIn')" width="500px" :rules="rules" class="handle-dialog login-form" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-form :model="dialogForm"  ref="dialogForm" class="el-row mes-form-rule" :rules="rules" size="mini">
        <el-form-item  prop="username" class="el-col el-col-24">
          <el-input :disabled="true" v-model.trim="dialogForm.username"  autofocus :placeholder="$t('component_JobNMemN8ID')"></el-input>
        </el-form-item>
        <el-form-item  prop="password" class="el-col el-col-24">
          <el-input v-model.trim="dialogForm.password" type="password" :placeholder="$t('component_enterLogiPass')" show-password></el-input>
        </el-form-item>
        <el-form-item  class="el-col el-col-24" >
           <el-button style="float:right;" type="primary" :loading="loading" @click="login">{{$t('component_SignIn')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mesHeader from '@/components/Header/header'
import mesFirstMenu from '@/components/Aside/firstMenu'
import mesSecondMenu from '@/components/Aside/secondMenu'
import contextMenu from 'vue-context-menu'
import Cookies from 'js-cookie'

export default {
  name: 'layout',
  data () {
    return {
      menuIsCollapse: false,
      secondNavTitle: '',
      showSecondMenu: false,
      secondMenuList: [],
      secondCollapse: true,
      activeTag: '',
      contextTags: {},
      isFullScreen: false,
      dialogForm: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [{ required: true, message: this.$t('common_PleasEnte') + ' ' + this.$t('component_JobNMemN8ID') }],
        password: [{ required: true, message: this.$t('component_inputAPass') }]
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapState(['menuList', 'tagList', 'currentMenuTitle', 'isNeedLogin']),
    asideWidth () {
      return this.menuIsCollapse ? '65px' : '12%'
    },
    secondAsideWith () {
      return this.secondCollapse ? '180px' : '0px'
    },
    tagNameArr () {
      let arr = []
      let tagList = this.tagList
      tagList.forEach(tab => {
        arr.push(tab.title)
      })
      return arr
    },
    isIframe () {
      return this.$route.meta.isIframe
    },
    isShowScroll () {
      return this.$route.meta.showScroll
    },
    iskeepAlive () {
      return this.$route.meta.keepAlive
    }
  },
  watch: {
    '$route' (to, from) {
      this.getRouerInfo(to, from)
      this.getActiveMenuId()
    },
    'isNeedLogin' (val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        this.dialogForm.username = atob(Cookies.get('username')) || ''
        this.dialogForm.password = atob(Cookies.get('password')) || ''
      }
    }
  },
  methods: {
    ...mapActions(['changeRefreshCharts', 'setHeaderMenuTitle', 'addMenuTags', 'closeCurrentPage', 'setTagList', 'changeLoginState']),
    async login () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            let res = await this.$api.login(this.dialogForm)
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
                  this.changeLoginState(false)
                  this.$message.success(this.$t('component_SucceLand'))
                  this.loading = false
                  await this.$store.dispatch('getMenuList')
                  this.getActiveMenuId()
                } else {
                  this.loading = false
                  this.$message.warning(this.$t('component_AccouErroContAdmi'), 'error')
                }
              }
            } else {
              this.loading = false
              this.$message.error(msg)
            }
          } catch (error) {
            this.loading = false
          }
        }
      })
    },
    // 开启全屏
    openFullScreen () {
      const ele = document.body
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else {
        if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen()
        } else {
          if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen()
          } else {
            if (ele.webkitRequestFullScreen) {
              ele.webkitRequestFullScreen()
            }
          }
        }
      }
    },
    // 获取是否全屏
    getFullScreen () {
      this.isFullScreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    },
    toggleMenu () {
      this.menuIsCollapse = !this.menuIsCollapse
      setTimeout(() => {
        this.changeRefreshCharts()
      }, 300)
    },
    asideMenuToggle () {
      this.secondCollapse = !this.secondCollapse
      setTimeout(() => {
        this.changeRefreshCharts()
      }, 300)
    },
    /**
     * 获取当前路由信息，并设置header标题
     */
    getRouerInfo (to, from) {
      let routerInfo = to || this.$route
      let routerFrom = from || ''
      let { meta, path, fullPath } = routerInfo
      let { addTags, title } = meta
      let keepAlive = routerFrom ? routerFrom.meta.keepAlive : routerFrom
      const menu = { title, path, fullPath, keepAlive }
      this.setHeaderMenuTitle(title)
      if (addTags) {
        this.addMenuTags(menu)
        this.$nextTick(() => {
          let scrollbarLogs = this.$refs['footerScrollbar'].$refs.wrap
          const { scrollWidth } = scrollbarLogs
          const { tagList } = this
          const len = tagList.length
          let activeIndex = ''
          tagList.forEach((item, index) => {
            if (item.title === title) {
              activeIndex = index + 1
            }
          })
          if (activeIndex >= 10) {
            scrollbarLogs.scrollLeft = activeIndex / len * scrollWidth
          } else {
            scrollbarLogs.scrollLeft = 0
          }
        })
      } else {
        if (this.$refs['footerScrollbar']) {
          let scrollbarLogs = this.$refs['footerScrollbar'].$refs.wrap
          scrollbarLogs.scrollLeft = 0
        }
      }
    },

    getActiveMenuId () {
      const { menuList } = this
      const currentRouterPath = this.$route.path
      let firstMenuObj = {}
      let secondActiveIndex = ''
      let firstMenuActiveId = ''
      const len1 = menuList.length
      for (let i = 0; i < len1; i++) {
        if (menuList[i].url) {
          if (menuList[i].url === currentRouterPath) {
            firstMenuActiveId = menuList[i].id
            firstMenuObj = menuList[i]
            this.secondMenuList = menuList[i].children || []
          }
        } else {
          const secondMenuList = menuList[i].children || []
          const len2 = secondMenuList.length
          for (let j = 0; j < len2; j++) {
            if (secondMenuList[j].url) {
              if (secondMenuList[j].url === currentRouterPath) {
                firstMenuObj = menuList[i]
                firstMenuActiveId = menuList[i].id
                this.secondMenuList = menuList[i].children
                secondActiveIndex = secondMenuList[j].id
              }
            } else {
              const thirdMenuList = secondMenuList[j].children || []
              const len3 = thirdMenuList.length
              for (let k = 0; k < len3; k++) {
                if (thirdMenuList[k].url === currentRouterPath) {
                  firstMenuObj = menuList[i]
                  firstMenuActiveId = menuList[i].id
                  this.secondMenuList = menuList[i].children
                  secondActiveIndex = thirdMenuList[k].id
                }
              }
            }
          }
        }
      }
      this.$nextTick(async () => {
        if (firstMenuActiveId) {
          await this.$refs.firstMenu.selectMenu(firstMenuActiveId)
          await this.$refs.firstMenu.choiceMenu(firstMenuObj)
          if (this.showSecondMenu) {
            await this.$refs.secondMenu.selectMenu(secondActiveIndex)
          }
        }
      })
    },
    // 获取下一级菜单
    getNextMenus (menu) {
      if (menu.url) {
        this.showSecondMenu = false
        this.$router.push(menu.url)
      } else {
        this.secondNavTitle = menu.title
        this.secondMenuList = menu.children
        this.secondCollapse = true
        this.showSecondMenu = true
      }
      this.changeRefreshCharts()
    },
    // 右键打开菜单
    openContextMenu (tab) {
      if (tab.title !== this.$t('component_homep')) {
        this.contextTags = tab
        this.$refs.ctxMenu.open()
      }
    },
    // 关闭当前选项卡
    closeCurrentTag () {
      let { title } = this.contextTags
      this.closeCurrentPage({ title })
    },
    // 关闭其他选项卡
    closeOtherTags () {
      let { fullPath } = this.$route
      let contextTags = this.tagList.filter(item => {
        return item.fullPath === fullPath
      })[0]
      this.setTagList(contextTags)
    },
    // 关闭所有选项卡
    closeAllTags () {
      this.setTagList()
      this.$router.push('/index')
    }
  },
  components: {
    mesHeader, mesFirstMenu, mesSecondMenu, contextMenu
  },
  async created () {
    await this.$store.dispatch('getMenuList')
    await this.getRouerInfo()
    await this.getActiveMenuId()
  },
  mounted () {
    this.getFullScreen()
    window.addEventListener('resize', () => {
      this.getFullScreen()
    })
  }
}
</script>

<style lang="scss">
@import "../../styles/layout.scss";
.login-form {
  .el-dialog__body {
    padding: 20px 20px 5px;
  }
  .btn {
    background-color: #3b6f9a;
    text-align: center;
    color: #fff;
    font-size: 1vw;
    border-radius: 2px;
    line-height: 32px;
    height: 32px;
    width: 72px;
    float: right;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
.layout-footer {
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }
}
</style>
