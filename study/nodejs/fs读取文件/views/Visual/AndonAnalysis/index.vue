<template>
  <board bTitle="Andon报警分析">
    <div class="andon-analysis-page">
      <el-row class="andon-analysis-content">
        <el-col class="content-item" :span="6">
          <div class="content-item-top">
            <v-title title="响应时间超时率"></v-title>
            <div class="charts-height">
              <time-out-rate-charts id="timeout" name="响应时间超时率" :overtime="responseTime.responseOvertimeCount" :noOvertime="responseTime.responseNoOvertimeCount" />
            </div>
          </div>
          <div class="content-item-bottom">
            <v-title title="处理时间超时率"></v-title>
            <div class="charts-height">
              <time-out-rate-charts id="timeout1" name="处理时间超时率" :overtime="processTime.processOvertimeCount" :noOvertime="processTime.processNoOvertimeCount" />
            </div>
          </div>
        </el-col>
        <el-col class="content-item" :span="9">
          <div class="content-item-top">
            <v-title title="响应平均时间趋势"></v-title>
            <div class="charts-height">
            <response-charts id="response" name="响应平均时间趋势" :date="date" :dataList="responseAverageTimeChart"></response-charts>
            </div>
          </div>
          <div class="content-item-bottom">
            <v-title title="处理平均时间趋势"></v-title>
            <div class="charts-height">
            <response-charts id="response1" name="处理平均时间趋势" :date="date"  :dataList="processAverageTimeChart"></response-charts>
            </div>
          </div>
        </el-col>
        <el-col class="content-item" :span="9">
          <div class="content-item-top">
            <v-title title="报警问题TOP5"></v-title>
            <div class="charts-height">
              <alarm-charts id="alarm" :dataList="alarmProblemTop5"></alarm-charts>
            </div>
          </div>
          <div class="content-item-bottom">
            <v-title title="报警处理时间TOP5"></v-title>
            <div class="charts-height">
              <alarm-charts id="alarm1" :dataList="alarmProcessTimeTop5">></alarm-charts>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </board>
</template>

<script>
import board from '../board'
import selectRadio from '../Componment/selectRadio'
import timeOutRateCharts from './timeOutRateCharts'
import responseCharts from './responseCharts'
import alarmCharts from './alarmCharts'
export default {
  data () {
    return {
      responseTime: {
        responseNoOvertimeCount: 0,
        responseOvertimeCount: 0
      },
      processTime: {
        processNoOvertimeCount: 0,
        processOvertimeCount: 0
      },
      responseAverageTimeChart: [],
      processAverageTimeChart: [],
      alarmProblemTop5: [],
      alarmProcessTimeTop5: [],
      dateType: 1,
      date: null,
      dayList: [
        {
          name: '周',
          value: 'week'
        },
        {
          name: '月',
          value: 'month'
        }
      ]
    }
  },
  methods: {
    async getVisualAndon () {
      if (this.$route.query.date) {
        this.date = this.$route.query.date
      } else {
        this.date = this.$dayjs().format('YYYY-MM-DD')
      }
      const { dateType, date } = this
      const params = { dateType, date }
      const res = await this.$api.getVisualAndon(params)
      const { code, data } = res
      if (code === '200') {
        this.responseTime.responseNoOvertimeCount = data.responseNoOvertimeCount
        this.responseTime.responseOvertimeCount = data.responseOvertimeCount
        this.processTime.processNoOvertimeCount = data.processNoOvertimeCount
        this.processTime.processOvertimeCount = data.processOvertimeCount
        this.responseAverageTimeChart = data.responseAverageTimeChart
        this.processAverageTimeChart = data.processAverageTimeChart
        this.alarmProblemTop5 = data.alarmProblemTop5
        this.alarmProcessTimeTop5 = data.alarmProcessTimeTop5
      } else {
        this.responseTime.responseNoOvertimeCount = 0
        this.responseTime.responseOvertimeCount = 0
        this.processTime.processNoOvertimeCount = 0
        this.processTime.processOvertimeCount = 0
        this.responseAverageTimeChart = []
        this.processAverageTimeChart = []
        this.alarmProblemTop5 = []
        this.alarmProcessTimeTop5 = []
      }
    }
  },
  created () {
    this.getVisualAndon()
  },
  components: { board, selectRadio, timeOutRateCharts, responseCharts, alarmCharts }
}
</script>

<style lang="scss" scoped>
.andon-analysis-page {
  height: 100%;

  .andon-analysis-content {
    height: 100%;

    .content-item {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      height: 100%;
      &:nth-child(-n + 2) {
        border-right: 3px solid rgb(15, 12, 45);
      }

      .content-item-top {
        height: 50%;
        border-bottom: 3px solid rgb(15, 12, 45);

        .charts-height {
          height: 80%;
          margin: 0 1vw;
        }
      }

      .content-item-bottom {
        height: 50%;

        .charts-height {
          height: 80%;
          margin: 0 1vw;
        }
      }
    }
  }
}
</style>
