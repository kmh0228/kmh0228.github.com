<template>
  <div class="mes-main mes-home-page">
    <div class="mes-custom-tabs">
      <ul>
        <li :class="activeName==='seedy'?'mes-tabs-active':''" @click="tabsClick('seedy')">快捷方式</li>
        <li :class="activeName==='pandect'?'mes-tabs-active':''" @click="tabsClick('pandect')">总览</li>
        <li :class="activeName==='backlog'?'mes-tabs-active':''" @click="tabsClick('backlog')">我的待办</li>
      </ul>
    </div>
    <div class="mes-home-ceontent">
      <el-scrollbar ref="scrollbarHome">
        <el-row class="home-tabs-seedy" ref="seedy" :gutter="20">
          <el-col :span="3" >
            <div class="seedy-content">
              <div class="seedy-icon">
                <mes-icon icon="seedy-order" size="4vw" suffix="svg" @click.native="toPage('/Production/WorkOrder')"></mes-icon>
                <span class="seedy-badge" v-if="orderBadge && orderBadge !== 0">{{  orderBadge }}</span>
              </div>
              <p>工单管理</p>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="seedy-content">
              <div class="seedy-icon">
                <mes-icon icon="seedy-data" size="4vw" suffix="svg" @click.native="toPage('/WorkStation/Login')"></mes-icon>
                <span class="seedy-badge" v-if="dataBadge && dataBadge !== 0">{{  dataBadge }}</span>
              </div>
              <p>数据采集</p>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="seedy-content">
              <div class="seedy-icon">
                <mes-icon icon="seedy-barcode" size="4vw" suffix="svg" @click.native="toPage('')"></mes-icon>
                <span class="seedy-badge" v-if="barcodeBadge && barcodeBadge !== 0">{{  barcodeBadge }}</span>
              </div>
              <p>条码管理</p>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="seedy-content">
              <div class="seedy-icon">
                <mes-icon icon="seedy-pack" size="4vw" suffix="svg" @click.native="toPage('')"></mes-icon>
                <span class="seedy-badge" v-if="packBadge && packBadge !== 0">{{  packBadge }}</span>
              </div>
              <p>包装管理</p>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="seedy-content">
              <div class="seedy-icon">
                <mes-icon icon="seedy-task" size="4vw" suffix="svg" @click.native="toPage('')"></mes-icon>
                <span class="seedy-badge" v-if="taskBadge && taskBadge !== 0">{{  taskBadge }}</span>
              </div>
              <p>任务指派</p>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="seedy-content">
              <div class="seedy-icon">
                <mes-icon icon="seedy-complete" size="4vw" suffix="svg" @click.native="toPage('')"></mes-icon>
                <span class="seedy-badge" v-if="completeBadge && completeBadge !== 0">{{  completeBadge }}</span>
              </div>
              <p>完工确认</p>
            </div>
          </el-col>
        </el-row>
        <p style="padding:1vh 0;font-size:0.7vw;">总览</p>
        <el-row class="home-tabs-pandect" ref="pandect" :gutter="15">
          <el-col :span="5">
            <div class="pandect-wrap">
              <p class="pandect-title">当天工单完成率</p>
              <div class="pandect-charts" style="height:20vh">
                <half-donut id="chart1" :rate="0.867"></half-donut>
              </div>
            </div>
            <div class="pandect-wrap">
              <p class="pandect-title">当天工单总数量</p>
              <p class="pandect-wrap-content">1000</p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="pandect-wrap">
              <p class="pandect-title">当天关键指标</p>
              <div class="pandect-charts" style="height:26vh">
                <kpi-bar id="chart2"></kpi-bar>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="pandect-wrap">
              <p class="pandect-title">当天不良类别TOP5</p>
              <div class="pandect-charts" style="height:32vh">
                <top-pie id="chart3"></top-pie>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="pandect-wrap">
              <p class="pandect-title">库存水位预警</p>
              <div class="pandect-charts" style="height:32vh">
                <water-line id="chart4"></water-line>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="home-tabs-backlog" ref="backlog"></el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'seedy',
      orderBadge: 0,
      dataBadge: 0,
      barcodeBadge: 0,
      packBadge: 0,
      taskBadge: 0,
      completeBadge: 0
    }
  },
  methods: {
    tabsClick (name) {
      this.activeName = name
      let scrollbarHome = this.$refs['scrollbarHome'].$refs.wrap
      this.$nextTick(() => {
        scrollbarHome.scrollTop = 1000
      })
    },
    toPage (url) {
      if (url) {
        this.$router.push(url)
      } else {
        this.$message.warning('功能开发中')
      }
    }
  }
}
</script>
