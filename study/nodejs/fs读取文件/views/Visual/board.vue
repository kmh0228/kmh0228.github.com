<template>
  <div class="board">
    <div class="baord-header">
      <!-- <div class="header-hanle" v-if="hasInput">
        <el-select class="visual-common-select" v-model="processId" :popper-append-to-body="false" popper-class="select-popper" placeholder="请选择制程" clearable >
          <el-option v-for="(option,i) in processList" :key="i" :label="option.segName" :value="option.mComProcessSegId"></el-option>
        </el-select>
      </div> -->
      <p class="header-title">{{bTitle}}</p>
      <span class="span-time">{{nowTime}}</span>
    </div>
    <div class="board-content">
      <slot></slot>
    </div>
    <div class="back-button" @click="goBack"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nowTime: ''
    }
  },
  watch: {
    processId (val) {
      this.$emit('change', val)
    }
  },
  props: {
    bTitle: {
      type: String,
      default: '123'
    }
  },
  methods: {
    goBack () {
      this.$router.push('Home')
    },
    // 获取制程列表
    async getprocessList () {
      let data = { segCode: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getProcessTree(data)
      if (res.code === '200') {
        this.processList = res.data.processTreeDtos
      } else {
        this.processList = []
      }
    }
  },
  created () {
    if (this.$route.query.date) {
      this.nowTime = '数据日期： ' + this.$route.query.date
    } else {
      let vm = this
      setInterval(() => {
        vm.nowTime = vm.$dayjs().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
// @import "../../styles/visual.scss";
.board {
  background: url("../../assets/images/board-bg.png") no-repeat center;
  background-size: 100% 100%;
  position: relative;
  height: 100%;
  .baord-header {
    position: relative;
    height: 7%;
    .header-hanle {
      position: absolute;
      width: 17%;
      bottom: 10%;
      left: 4%;
      text-align: center;
      z-index: 10;
    }
    .header-title {
      position: absolute;
      text-align: center;
      width: 100%;
      line-height: 6vh;
      color: #fff;
      font-size: 1.4vw;
      font-weight: bold;
      z-index: 9;
    }
    .span-time {
      position: absolute;
      right: 4%;
      bottom: 15%;
      font-size: 1vw;
      font-weight: bold;
      color: #fff;
      letter-spacing: 0.1vw;
    }
  }
  .board-content {
    position: relative;
    height: 89%;
    width: 94%;
    margin: 0 auto;
  }
  .back-button {
    position: absolute;
    background: url("../../assets/images/back.png");
    background-size: 100% 100%;
    width: 3vw;
    height: 3vw;
    bottom: 2%;
    left: 1%;
    cursor: pointer;
  }
}
</style>
