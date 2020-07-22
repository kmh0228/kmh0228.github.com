<template>
  <board  bTitle="线别品质分析">
    <el-row class="quality-analysis">
      <el-col :span="10" class="quality-num">
        <ul>
          <li>
            <p>生产总数</p>
            <p class="num-normal">{{totalNum}}</p>
          </li>
          <li class="num-border">
            <p>良品数</p>
            <p class="num-normal">{{passNum}}</p>
          </li>
          <li class="num-border">
            <p>良率</p>
            <p :class="passRate>80?'num-normal':'num-error'" v-if="passRate">{{passRate+'%'}}</p>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="pass-rate split-line">
        <echart-title title="直通率" style="height:20%"></echart-title>
        <rate-pie id="rataPieLine" style="height:85%" :rateData="rateDataList"></rate-pie>
      </el-col>
      <el-col :span="8" class="trouble-type split-line">
        <echart-title title="不良类别占比" style="height:20%" ></echart-title>
        <pie-echart id="pieEchartLine" :pieData="pieList" style="height:85%" left="60%"></pie-echart>
      </el-col>
        <el-col :span="16" class="pass-analysis">
          <v-title title="直通率分析" titleHight="10%"></v-title>
          <select-radio  v-model="dateType" @change="radiochange" :typeList="typeList"  style="margin-left:20px"></select-radio>
          <quality-analysis id="qualityAnalysisLine" style="height:85%" :analysisList="analysisList" :dateList="dateList"></quality-analysis>
        </el-col>
        <el-col :span="8" class="bad-ranking split-line">
          <v-title title="不良排名TOP10" titleHight="10%" :subTitle="subTitle"></v-title>
          <rank-bar id="rankBarLine" :type="errorType" :data="errorData" :height="errorHeight" :rankSum="rankSum" style="height:90%" left="10%"></rank-bar>
        </el-col>
    </el-row>

  </board>
</template>

<script>
import board from '../board'
import ratePie from '../Componment/ratePie'
import selectRadio from '../Componment/selectRadio'
import rankBar from '../Componment/rankBar'
import pieEchart from '../Componment/pie'
import qualityAnalysis from './qualityAnalysis'

export default {
  data () {
    return {
      typeList: [{
        name: '周',
        value: 0
      },
      {
        name: '月',
        value: 1
      }],
      errorType: [],
      errorData: [],
      dateType: 0,
      passNum: '',
      passRate: '',
      totalNum: '',
      unPassNum: '',
      analysisList: [],
      rateDataList: [],
      pieList: [],
      badRate: {},
      rankSum: 0,
      badRateList: [],
      lineId: '',
      dateList: [],
      date: '',
      subTitle: ''
    }
  },
  computed: {
    errorHeight () {
      return (this.errorData.length + 1) / 11 * 90 + '%'
    }
  },
  methods: {
    radiochange () {
      this.getQualityAllData()
      this.setSubTitle()
    },
    // 补上一个时间的数组
    createDateList () {
      let { dateType, date } = this
      this.dateList = []
      if (dateType === 0) {
        for (let i = 0; i < 12; i++) {
          this.dateList.unshift(this.$moment(date).subtract(i, 'days').format('YYYY-MM-DD'))
        }
      } else if (dateType === 1) {
        for (let i = 0; i < 12; i++) {
          const num = this.$moment(date).subtract(11 - i, 'weeks').isoWeek()
          const week = num < 10 ? `0${num}周` : `${num}周`
          this.dateList.push(week)
        }
      } else if (dateType === 2) {
        for (let i = 0; i < 12; i++) {
          this.dateList.unshift(this.$moment(date).subtract(i, 'months').format('YYYY/MM'))
        }
      }
    },
    // 获取当日的
    async getQualityData () {
      let { lineId, date } = this
      let data = date ? Object.assign({ lineId, date }) : Object.assign({ lineId })
      let res = await this.$api.getQualityData(data)
      if (res.code === '200') {
        for (let i in res.data) {
          if (i === 'badRate') {
            this.badRateList = res.data[i]
          } else {
            this[i] = res.data[i]
          }
        }
        this.rateDataList = [
          {
            name: '良品数',
            value: this.passNum
          }, {
            name: '不良品数',
            value: this.unPassNum
          }
        ]
        let obj
        this.pieList = []
        this.badRateList.forEach(item => {
          obj = {
            name: item.badName,
            value: item.badNum
          }
          this.pieList.push(obj)
        })
      }
    },
    // 获取分析
    async getQualityAllData () {
      let { dateType, date, lineId } = this
      const data = Object.assign({ dateType, date, lineId })
      let res = await this.$api.getQualityAllData(data)
      this.createDateList()
      if (res.code === '200') {
        this.analysisList = res.data.dataDtoList
        this.rankSum = res.data.totalNum
        res.data.badDtoList.sort(function (a, b) {
          return a.badNum - b.badNum
        })
        this.errorType = []
        this.errorData = []
        res.data.badDtoList.forEach(item => {
          this.errorType.push(item.badName)
          this.errorData.push(item.badNum)
        })
      } else {
        this.analysisList = []
        this.badDtoList = []
        this.rankSum = 0
        this.errorType = []
        this.errorData = []
      }
    },
    // 设置日期
    setSubTitle () {
      let { date, dateType } = this
      let sDate = ''
      let eDate = ''
      if (dateType === 0) {
        eDate = this.$moment(date).format('MM-DD')
        sDate = this.$moment(date).subtract(11, 'days').format('MM-DD')
      } else if (dateType === 1) {
        let eNum = this.$moment(date).isoWeek()
        eDate = eNum < 10 ? `0${eNum}周` : `${eNum}周`
        let sNum = this.$moment(date).subtract(11, 'weeks').isoWeek()
        sDate = sNum < 10 ? `0${sNum}周` : `${sNum}周`
      }
      this.subTitle = `( ${sDate}-${eDate} )`
    }
  },
  components: {
    board, ratePie, selectRadio, rankBar, pieEchart, qualityAnalysis
  },
  created () {
    this.lineId = this.$route.query.line
    this.date = '' || this.$route.query.date
    this.setSubTitle()
    this.getQualityData()
    this.getQualityAllData()
  }
}
</script>

<style lang="scss" scoped>
.quality-analysis {
  height: 100%;
  width: 100%;
  .quality-num {
    height: 35%;
    ul {
      height: 65%;
      display: flex;
      margin-top: 5vh;
      li {
        flex: 1;
        p {
          font-size: 1.3vw;
          color: #c3c4ca;
          line-height: 5vh;
          text-align: center;
        }

        .num-normal {
          font-size: 2.5vw;
          margin-top: 3vh;
          color: #40fff9;
        }

        .num-error {
          font-size: 2.5vw;
          margin-top: 3vh;
          color: #ff3273;
        }
      }
      .num-border {
        border-left: 1px solid #000;
      }
    }
  }
  .split-line {
    border-left: 0.15vw solid #14092d;
  }
  .pass-rate {
    height: 35%;
    padding-top: 4vh;
  }
  .trouble-type {
    height: 35%;
    padding-top: 4vh;
  }

  .pass-analysis {
    height: 65%;
    border-top: 0.4vh solid #0f0c2d;
  }

  .bad-ranking {
    height: 65%;
    border-top: 0.4vh solid #0f0c2d;
  }
}
</style>
