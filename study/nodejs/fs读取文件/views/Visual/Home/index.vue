<template>
  <div class="visual-content">
    <div class="visual-title"></div>
    <div class="visual-main">
      <div
        class="visual-menu"
        :class="
          isHome ? 'visual-menu-active' : 'visual-menu-noactive'">
        <ul>
          <li v-for="(option, i) in menuList" :key="i" @click="showMoreMenu(i,activeIndex)" :class="activeIndex === i? 'li-active':''">
            {{ option.name }}
          </li>
        </ul>
      </div>
      <transition mode="out-in" name="zoom">
      <div class="visual-child-menu" v-if="activeIndex >= 0">
          <ul>
            <li v-for="(option, i) in menuList[activeIndex].children" :key="i" @click="goMenu(option.url)">
              {{ option.name }}
            </li>
          </ul>
      </div>
      </transition>
    </div>
      <el-dialog :visible.sync="dialogVisible"  class="maxvisual-dialog" width="603px" >
        <slot name="title">
            <span class="maxvisual-dialog__title">{{ title }}</span>
        </slot>
         <el-form :model="formData"  label-position="left"  label-width="100px" class="visual-form">
          <!-- <el-form-item  label="工厂" prop="officeName" class="visual-form-item" style="margin-top:30px">
            <el-select v-model="formData.officeName" style="width:100%"></el-select>
          </el-form-item> -->
          <el-form-item  label="线别" prop="line" class="visual-form-item" style="margin-top:30px" v-if="activeIndex===2">
            <el-select v-model="formData.line" size="mini" clearable placeholder="请选择线别" style="width:100%">
              <el-option v-for="(option,i) in lineList" :key="i" :value="option.mPomLineId" :label="option.lineName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="时间" prop="date" class="visual-form-item" v-if="activeIndex!==0">
            <el-date-picker  v-model="formData.date" type="date"  placeholder="选择日期"  style="width:100%" :picker-options="pickerOptions"  value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item class="visual-form-item" label-width="0">
            <div class="dialog-button" @click="gopage"><span>进入</span></div>
          </el-form-item>
        </el-form>
      </el-dialog>
    <div class="visual-footer">
      <div class="menu-botton">
        <p @click="handleClose">主页</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: -1,
      menuList: [
        {
          name: '决策层',
          children: [
            {
              id: '',
              name: '中控台',
              url: 'Console',
              isVisit: true
            }
          ]
        },
        {
          name: '管理层',
          children: [
            {
              id: '',
              name: '制程产能分析',
              url: 'CapacityAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: '制程品质分析',
              url: 'QualityAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: '制程设备分析',
              url: 'EauipmentAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: 'SPC能力分析',
              url: 'SPCAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: 'ANDON报警分析',
              url: 'AndonAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: '来料品质分析',
              url: 'InComingAnalysis',
              isVisit: true
            }
          ]
        },
        {
          name: '执行层',
          children: [
            {
              id: '',
              name: '线别产能分析',
              url: 'LineCapacityAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: '线别品质分析',
              url: 'LineQualityAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: '线别设备管理',
              url: 'LineEauipmentAnalysis',
              isVisit: true
            },
            {
              id: '',
              name: '线别Andon分析',
              url: 'LineAndonAnalysis',
              isVisit: true
            }
          ]
        }
      ],
      dialogVisible: false,
      title: '请选择',
      formData: {
        officeName: '',
        date: this.$dayjs().format('YYYY-MM-DD'),
        line: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      url: '',
      lineList: [],
      isHome: false
    }
  },
  methods: {
    showMoreMenu (index, activeIndex) {
      if (activeIndex !== index) {
        this.activeIndex = -1
        this.isHome = true
        setTimeout(() => {
          this.activeIndex = index
        }, 300)
      }
    },
    handleClose () {
      this.activeIndex = -1
      this.isHome = false
    },
    goMenu (url) {
      let { activeIndex } = this
      this.url = url
      activeIndex === 0 ? this.gopage() : this.dialogVisible = true
    },
    gopage () {
      let { url, formData } = this
      if (this.$dayjs(formData.date).unix() < this.$dayjs(this.$dayjs().format('YYYY-MM-DD')).unix()) {
        url += '?date=' + formData.date
        if (this.activeIndex === 2) {
          url += '&line=' + formData.line
        }
      } else {
        if (this.activeIndex === 2) {
          url += '?line=' + formData.line
        }
      }
      if (this.activeIndex === 2) {
        if (formData.line) {
          this.$router.push(url)
          this.$store.dispatch('changeVisualMenu', this.activeIndex)
        } else {
          this.$message.warning('请选择线别')
        }
      } else {
        this.$router.push(url)
        this.$store.dispatch('changeVisualMenu', this.activeIndex)
      }

      // } else {
      //   this.$message.warning('请选择工厂')
      // }
    },
    // 获取所有线别
    async getAllLine () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      } else {
        this.lineList = []
      }
    }
  },
  created () {
    if (this.$store.state.choiceMenu >= 0) {
      this.activeIndex = this.$store.state.choiceMenu
      if (this.activeIndex >= 0) {
        this.isHome = true
      }
    }
    this.getAllLine()
  },
  components: {
  }
}
</script>

<style lang="scss">
.visual-content {
  height: 100%;
  background: url("../../../assets/images/mian-bg.png") no-repeat center;
  background-size: 100% 100%;
  .visual-title {
    position: relative;
    height: 20%;
    width: 30vw;
    margin: 0 auto;
  }

  .visual-main {
    position: relative;
    width: 80%;
    height: 70%;
    margin: 0 auto;
    .visual-menu-active {
      top: 20%;
    }
    .visual-menu-noactive {
      top: 30%;
    }
    .visual-menu {
      position: relative;
      text-align: center;
      height: 20%;
      ul {
        position: absolute;
        width: 100%;
        top: 28%;
        display: flex;
        justify-content: space-between;
        font-size: 1.5vw;
        font-weight: 600;
        transition: all 0.5s;
        li {
          background: url("../../../assets/images/menu-bg.png") no-repeat center;
          background-size: 100% 100%;
          width: 12vw;
          color: #ffffff;
          padding: 1.5vh 0;
          margin: 0 3.5vw;
          cursor: pointer;
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
          -webkit-transform-origin: center;
          transform-origin: center;
          &:hover {
            transform: scale(1.1);
            background: url("../../../assets/images/menu-bg-active.png")
              no-repeat center;
            background-size: 100% 100%;
          }
        }
        .li-active {
          transform: scale(1.1);
          background: url("../../../assets/images/menu-bg-active.png") no-repeat
            center;
          background-size: 100% 100%;
        }
      }
    }
    .visual-child-menu {
      position: relative;
      text-align: center;
      width: 100%;
      height: 50%;
      top: 25%;
      transition: all 0.5s;
      ul {
        li {
          float: left;
          text-align: center;
          width: 19%;
          margin: 0 3.5% 2vh 2.5%;
          padding: 1.5vh 0;
          background: url("../../../assets/images/menu-bg.png") no-repeat center;
          background-size: 100% 100%;
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
          -webkit-transform-origin: center;
          transform-origin: center;
          cursor: pointer;
          color: #ffffff;
          &:hover {
            transform: scale(1.1);
            background: url("../../../assets/images/menu-bg-active.png")
              no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .visual-footer {
    position: relative;
    height: 10%;
    width: 100%;
    .menu-botton {
      font-size: 1.5vw;
      font-weight: bold;
      text-align: center;
      position: relative;
      top: -80%;
      color: #ffffff;
      p {
        cursor: pointer;
        width: 8%;
        margin: 0 auto;
      }
    }
  }
}

.maxvisual-dialog {
  .el-dialog {
    height: 407px;
    background: url("../../../assets/images/dialog.png") no-repeat center;
    background-size: 100%;
    margin-top: 25vh !important;
    .el-dialog__close {
      color: #ffffff;
    }
    .el-dialog__body {
      text-align: center;
      .maxvisual-dialog__title {
        color: #fff;
        font-size: 18px;
      }
    }
  }
}

.visual-form {
  width: 70%;
  margin: 0 auto;
  margin-top: 60px;
  .visual-form-item {
    .el-form-item__label {
      color: #ffffff;
    }
    .dialog-button {
      margin-top: 20px;
      cursor: pointer;
      text-align: center;
      color: #ffffff;
      background: url("../../../assets/images/select-btn.png") no-repeat center;
    }
  }
}
</style>
