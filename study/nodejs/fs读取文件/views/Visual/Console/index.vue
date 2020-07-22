<template>
  <board bTitle="中控台" >
    <div class="console-board-item">
      <div class="item-content">
          <v-title title="工单达成率"></v-title>
          <div class="item-main">
            <ul style="display:flex;margin-top: 2vh;height:85%">
              <li class="conntent-num">
                <p>
                  工单总数
                </p>
                <p class="num-normal">{{workOrderCompletionRate.totalCount}}</p>
              </li>
              <li class="conntent-num num-border">
                <p>完成数量</p>
                <p class="num-normal">{{workOrderCompletionRate.finishCount}}</p>
              </li>
              <li class="conntent-num num-border">
                <p>达成率</p>
                <p :class="compareRate(workOrderCompletionRate.completionRate)">{{workOrderCompletionRate.completionRate + needSign(workOrderCompletionRate.completionRate)}}</p>
              </li>
            </ul>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="产能分析" @click.native="goAppointMenu('CapacityAnalysis')" style="cursor: pointer;"></v-title>
          <div class="item-main">
            <ul style="display:flex;margin-top: 2vh;height:85%">
              <li class="conntent-num">
                <p>
                  计划数量
                </p>
                <p class="num-normal">{{productivityAnalysis.planCount}}</p>
              </li>
              <li class="conntent-num num-border">
                <p>实际数量</p>
                <p class="num-normal">{{productivityAnalysis.actualCount}}</p>
              </li>
              <li class="conntent-num num-border">
                <p>达成率</p>
                <p v-if="productivityAnalysis.completionRate>=0"  :class="compareRate(productivityAnalysis.completionRate)">{{productivityAnalysis.completionRate + needSign(productivityAnalysis.completionRate)}}</p>
              </li>
            </ul>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="成品出货分析"></v-title>
          <div class="item-main">
            <ul style="display:flex;margin-top: 2vh;height:85%">
              <li class="conntent-num">
                <p>
                  当月计划
                </p>
                <p class="num-normal">{{oqcAnalysis.planCount}}</p>
              </li>
              <li class="conntent-num num-border">
                <p>当月实际</p>
                <p class="num-normal">{{oqcAnalysis.actualCount}}</p>
              </li>
              <li class="conntent-num num-border">
                <p>当月出货率</p>
                <p v-show="oqcAnalysis.completionRate>0" :class="compareRate(oqcAnalysis.completionRate)">{{oqcAnalysis.completionRate +  needSign(oqcAnalysis.completionRate)}}</p>
              </li>
            </ul>
          </div>
      </div>
    </div>
    <div class="console-board-item" style="border-top: 3px solid #0f0c2d">
      <div class="item-content ">
          <v-title title="品质分析" @click.native="goAppointMenu('QualityAnalysis')" style="cursor: pointer;"></v-title>
          <div class="item-main">
            <el-row style="height:100%">
              <!-- <el-col :span="5" style="height:100%;margin-top:2vh">
                <ul style="height:100% ">
                  <li class="quality-num">
                    <p>良品数量</p>
                    <p class="num-normal">{{qualityAnalysis.goodCount}}</p>
                  </li>
                  <li class="quality-num" style="padding-top:5vh">
                    <p>不良品数量</p>
                    <p class="num-error">{{qualityAnalysis.badCount}}</p>
                  </li>
                </ul>
              </el-col> -->
              <el-col :span="8" style="height:100%;margin-top:2vh">
                <echart-title title="产品直通率"></echart-title>
                <rate-pie id="rataPie" :rateData="rateDataList" style="height:100%"></rate-pie>
              </el-col>
              <el-col :span="16" style="height:98% ;margin-top:2vh">
                <echart-title title="当日不良类别TOP5"></echart-title>
                <rank-bar id="rankBar" :type="errorType" :data="errorData" :height="errorHeight" :rankSum="rankSum"></rank-bar>
              </el-col>
            </el-row>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="设备异常分析"  @click.native="goAppointMenu('EauipmentAnalysis')" style="cursor: pointer;"></v-title>
          <div class="item-main">
            <div class="item-left">
              <echart-title title="故障次数TOP" style="margin-top:2vh"></echart-title>
              <device-echart id="errorNum" :dataList="errorCountList" ></device-echart>
            </div>
            <div class="item-right">
              <echart-title title="故障时间TOP" style="margin-top:2vh"></echart-title>
              <device-echart id="errorTime" :dataList="errorTimeList" style="padding-left:5px;"></device-echart>
            </div>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="SPC制程能力分析"  @click.native="goAppointMenu('SPCAnalysis')" style="cursor: pointer;"></v-title>
          <div class="item-main">
            <pie-echart id="spcAnalysis" :pieData="spcPie"></pie-echart>
          </div>
      </div>
    </div>
    <div class="console-board-item" style="border-top:3px solid #0f0c2d">
      <div class="item-content ">
        <v-title title="库存分析"></v-title>
        <div class="item-main">
          <inventory-analysis id="inventoryAnalysis" :lineData="stockAnalysis"></inventory-analysis>
        </div>
      </div>
      <div class="item-content split-line">
          <v-title title="ANDON报警分析"  @click.native="goAppointMenu('AndonAnalysis')" style="cursor: pointer;"></v-title>
          <div class="item-main">
            <andon-analysis id="andonAnalysis" title="报警问题TOP" :barData="andonAlarmAnalysis"></andon-analysis>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="良率趋势"></v-title>
          <div class="item-main">
            <yield-trend id="yieldTrend" :yieldData="yieldTrend"></yield-trend>
          </div>
      </div>
    </div>
  </board>
</template>

<script>
import board from '../board'
import pieEchart from './pieEchart'
import inventoryAnalysis from './InventoryAnalysis'
import ratePie from '../Componment/ratePie'
import rankBar from '../Componment/rankBar'
import andonAnalysis from './andonAnalysis'
import yieldTrend from './yieldTrend'
import deviceEchart from './deviceEchart'

export default {
  data () {
    return {
      errorType: [],
      errorData: [],
      rankSum: 0,
      // 工单达成率
      workOrderCompletionRate: {
        totalCount: '',
        finishCount: '',
        completionRate: ''
      },
      // 产能分析
      productivityAnalysis: {
        planCount: '',
        actualCount: '',
        completionRate: ''
      },
      // 出货品质分析
      oqcAnalysis: {
        planCount: '',
        actualCount: '',
        completionRate: ''
      },
      // 库存分析
      stockAnalysis: [],
      //
      qualityAnalysis: {},
      // 直通率
      rateDataList: [],
      // spc品质分析
      spcAnalysis: [],
      // ANDON报警分析
      andonAlarmAnalysis: [],
      // 良率趋势
      yieldTrend: [],
      spcPie: [],
      errorCountList: [],
      errorTimeList: []
    }
  },
  computed: {
    errorHeight () {
      return (this.errorData.length + 1) / 6 * 89 + '%'
    }
  },
  methods: {
    async getVisualConsole () {
      let date = ''
      if (this.$router.query) {
        if (this.$router.query.time) {
          date = this.$router.query.time
        }
      }
      let res = await this.$api.getVisualConsole({ date })
      if (res.code === '200') {
        this.errorType = []
        this.errorData = []
        for (let i in res.data) {
          this[i] = res.data[i]
        }
        this.rankSum = this.qualityAnalysis.totalCount
        this.qualityAnalysis.defectTypeTop5.sort((a, b) => { return a.count - b.count })
        this.qualityAnalysis.defectTypeTop5.forEach(item => {
          this.errorType.push(item.defectCode)
          this.errorData.push(item.count)
        })
        this.rateDataList = [
          {
            name: '良品数',
            value: this.qualityAnalysis.goodCount
          }, {
            name: '不良品数',
            value: this.qualityAnalysis.badCount
          }
        ]
        this.errorCountList = this.deviceExceptionAnalysis.faultCountTop5
        this.errorTimeList = this.deviceExceptionAnalysis.faultTimeTop5
        this.spcPie = []
        let obj = {}
        this.spcAnalysis.forEach(item => {
          obj = {
            name: item.level,
            value: item.value
          }
          this.spcPie.push(obj)
        })
      }
    },
    compareRate (val) {
      if (val) {
        let num = val.split('%')
        num = Number(num[0])
        return num > 80 ? 'num-normal' : 'num-error'
      } else {
        return 'num-error'
      }
    },
    needSign (data) {
      return data > 0 ? '%' : ''
    },
    // 跳到指定页面
    goAppointMenu (url) {
      this.$router.push(url)
    }

  },
  components: {
    board, andonAnalysis, pieEchart, inventoryAnalysis, ratePie, rankBar, yieldTrend, deviceEchart
  },
  created () {
    this.getVisualConsole()
  }
}
</script>

<style lang="scss" scoped>
.console-board-item {
  display: flex;
  flex-wrap: wrap;
  height: 33%;
  width: 100%;

  .item-content {
    height: 100%;
    width: 33%;
  }

  .split-line {
    border-left: 3px solid #14092d;
  }

  .item-main {
    height: 80%;
    width: 95%;
    margin: 0 auto;
    .item-left {
      width: 50%;
      float: left;
      height: 86%;
    }
    .item-right {
      width: 50%;
      float: right;
      height: 86%;
    }
    .conntent-num {
      flex: 1;
      height: 80%;
      margin-top: 2.5vh;
      p {
        font-size: 1vw;
        color: #c3c4ca;
        height: 4vh;
        text-align: center;
      }
      .num-normal {
        font-size: 2.5vw;
        margin-top: 2vh;
        color: #40fff9;
      }
      .num-error {
        font-size: 2.5vw;
        margin-top: 2vh;
        color: #ff3273;
      }
    }

    .quality-num {
      p {
        font-size: 1vw;
        color: #c3c4ca;
        height: 2vh;
        text-align: center;
      }
      .num-normal {
        font-size: 1.5vw;
        margin-top: 2vh;
        color: #40fff9;
      }
      .num-error {
        font-size: 1.5vw;
        margin-top: 2vh;
        color: #ff3273;
      }
    }
  }
}
</style>
