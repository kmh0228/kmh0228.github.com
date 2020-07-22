<template>
  <board bTitle="单线设备分析">
    <div class="line-eauipment-analysis-board-item">
      <div class="item-content">
        <v-title title="设备异常次数By日期"></v-title>
        <div class="charts-height">
            <exception-bar :id="'exceptionTimesByDate'" :unit="'单位 次'" :barData="exceptionTimesByDate" :title="'设备异常次数By日期'"></exception-bar>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="设备异常时间By日期"></v-title>
          <div class="charts-height">
            <exception-bar :id="'exceptionTimeByDate'" :unit="'单位 分'" :barData="exceptionTimeByDate" :title="'设备异常时间By日期'"></exception-bar>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="点检情况"></v-title>
          <div class="item-header">
            <select-radio :typeList="dayList" @radio-change="radiochange"></select-radio>
          </div>
          <div class="charts-height" style="margin-top: 10%">
            <spot-check :id="'spotCheck'" :complete="spotCheck.complete" :incomplete="spotCheck.incomplete"></spot-check>
          </div>
      </div>
    </div>
    <div class="line-eauipment-analysis-board-item" style="border-top: 0.4vh solid #0f0c2d">
      <div class="item-content">
          <v-title title="故障异常次数TOP5"></v-title>
          <div class="charts-height">
            <top-charts id="exceptionTimesTop5" :pieData="exceptionTimesTop5" :title="'故障异常次数TOP5'"></top-charts>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="故障异常时间TOP5"></v-title>
          <div class="charts-height">
            <top-charts id="exceptionTimeTop5" :pieData="exceptionTimeTop5" :title="'故障异常时间TOP5'"></top-charts>
          </div>
      </div>
      <div class="item-content split-line">
          <v-title title="点检达成率"></v-title>
          <div class="charts-height">
            <rate-pie id="spotCheckRate" :rateData="spotCheckRate" style="height:100%"></rate-pie>
          </div>
      </div>
    </div>
  </board>
</template>

<script>
import board from '../board'
import ratePie from './ratePie'
import selectRadio from '../Componment/selectRadio'
import topCharts from './topCharts'
import exceptionBar from './exceptionBar'
import spotCheck from './spotCheck'

export default {
  data () {
    return {
      line: '',
      dateType: 0,
      dayList: [
        {
          name: '周',
          value: 0
        },
        {
          name: '月',
          value: 1
        }],
      // 设备异常次数By日期
      exceptionTimesByDate: [],
      // 设备异常时间By日期
      exceptionTimeByDate: [],
      // 故障异常次数TOP5
      exceptionTimesTop5: [],
      // 故障异常时间TOP5
      exceptionTimeTop5: [],
      dateList: [],
      // 直通率
      spotCheckRate: [],
      spotCheck: {
        complete: 0,
        incomplete: 0
      }
    }
  },
  computed: {
  },
  methods: {
    radiochange (val) {
      this.dateType = val
      this.getLineEauipment()
    },
    // 补上一个时间的数组
    async createDateList () {
      let { dateType } = this
      this.dateList = []
      if (dateType === 0) {
        for (let i = 0; i < 7; i++) {
          this.dateList.unshift(this.$moment().subtract(i, 'days').format('YYYY-MM-DD'))
        }
      } else if (dateType === 1) {
        for (let i = 0; i < 4; i++) {
          const num = this.$moment().subtract(3 - i, 'weeks').isoWeek()
          const week = num < 10 ? `0${num}周` : `${num}周`
          this.dateList.push(week)
        }
      }
    },
    async getLineEauipment () {
      if (this.$route.query.date) {
        this.date = this.$route.query.date
      } else {
        this.date = this.$dayjs().format('YYYY-MM-DD')
      }
      const lineId = this.$route.query.line ? this.$route.query.line : ''
      const { dateType, date } = this
      const params = { dateType, date, lineId }
      let res = await this.$api.getLineEauipment(params)
      const { data, code } = res
      if (code === '200') {
        this.dateList = []
        await this.createDateList()
        let exceptionTimesByDate = []
        this.dateList.forEach((date, i) => {
          exceptionTimesByDate.push({ name: date, value: 0 })
          data.chartList.brokenNumber.forEach(item => {
            if (item.date && item.countNumber && item.date === date) {
              exceptionTimesByDate[i] = { name: item.date, value: item.countNumber }
            }
          })
        })
        this.exceptionTimesByDate = exceptionTimesByDate
        let exceptionTimeByDate = []
        this.dateList.forEach((date, i) => {
          exceptionTimeByDate.push({ name: date, value: 0 })
          data.chartList.brokenTime.forEach(item => {
            if (item.date && item.countTime && item.date === date) {
              exceptionTimeByDate[i] = { name: item.date, value: item.countTime }
            }
          })
        })
        this.exceptionTimeByDate = exceptionTimeByDate
        let exceptionTimesTop5 = []
        if (data.chartList.downNumber) {
          data.chartList.downNumber.forEach(item => {
            if (item.failCode && item.countNumber) {
              exceptionTimesTop5.push({ name: item.failCode, value: item.countNumber })
            }
          })
        }
        let exceptionTimeTop5 = []
        if (data.chartList.downTime) {
          data.chartList.downTime.forEach(item => {
            if (item.failCode && item.countTime) {
              exceptionTimeTop5.push({ name: item.failCode, value: item.countTime })
            }
          })
        }
        this.exceptionTimeTop5 = exceptionTimeTop5
        this.exceptionTimesTop5 = exceptionTimesTop5
        if (data.tableData) {
          const spotCheckSum = data.tableData.complete + data.tableData.incomplete
          this.spotCheckRate = [
            {
              name: '达成数',
              value: data.tableData.complete,
              completionRate: spotCheckSum === 0 ? 0 : (data.tableData.complete / spotCheckSum * 100).toFixed(2)
            },
            {
              name: '未达成数',
              value: data.tableData.incomplete
            }
          ]
          this.spotCheck.complete = data.tableData.complete
          this.spotCheck.incomplete = data.tableData.incomplete
        }
      } else {
        // 设备异常次数By日期
        this.exceptionTimesByDate = []
        // 设备异常时间By日期
        this.exceptionTimeByDate = []
        // 故障异常次数TOP5
        this.exceptionTimesTop5 = []
        // 故障异常时间TOP5
        this.exceptionTimeTop5 = []
        // 直通率
        this.spotCheckRate = []
        this.dateList = []
        this.spotCheck = {
          complete: 0,
          incomplete: 0
        }
      }
    }
  },
  components: {
    board, selectRadio, ratePie, topCharts, exceptionBar, spotCheck
  },
  created () {
    this.getLineEauipment()
  }
}
</script>

<style lang="scss" scoped>
.line-eauipment-analysis-board-item {
  display: flex;
  flex-wrap: wrap;
  height: 50%;
  width: 100%;

  .item-content {
    height: 100%;
    width: 33%;
  }

  .split-line {
    border-left: 0.15vw solid #14092d;
  }

  .item-main {
    height: 85%;
    width: 95%;
    margin: 0 auto;
  }
}
.item-header {
  float: right;
}
.charts-height {
  height: 80%;
  margin: 0 1vw;
}
</style>
