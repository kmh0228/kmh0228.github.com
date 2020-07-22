<template>
  <board bTitle="来料品质分析" :hasInput="false">
  <div class="incoming-analysis-page">
    <v-title title="来料批退率" titleHight="6%"></v-title>
    <div class="incoming-analysis-header">
      <select-radio v-model="dateType"></select-radio>
    </div>
    <div class="incoming-analysis-content">
      <div class="incoming-content-top">
        <incomeing-charts id="incomeing" :dataList="dataList" :xAxisList="xAxisList"></incomeing-charts>
      </div>
      <div class="incoming-content-bottom">
        <el-table :data="tableData" stripe  class="visual-table" v-if="xAxisList.length>0">
          <el-table-column prop="material" label="料号"></el-table-column>
          <el-table-column v-for="(item,i) in xAxisList" :key="i" :label="item" >
            <template slot-scope="scope">
              <p>{{ getFadeRate(scope.row.tableDate,item) }}%</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  </board>
</template>

<script>
import board from '../board'
import selectRadio from '../Componment/selectRadio'
import incomeingCharts from './incomeingCharts'
export default {
  data () {
    return {
      dateType: 0,
      dataList: [],
      xAxisList: [],
      columnList: [
        {
          prop: 'id',
          label: '料号'
        }
      ],
      tableData: []
    }
  },
  watch: {
    dateType () {
      this.getMaterialAnalyze()
    }
  },
  methods: {
    createXAxisList () {
      const { dateType } = this
      this.xAxisList = []
      if (dateType === 0) {
        for (let i = 0; i < 12; i++) {
          this.xAxisList.push(this.$moment().subtract(11 - i, 'days').format('MM/DD'))
        }
      } else if (dateType === 1) {
        for (let i = 0; i < 12; i++) {
          const num = this.$moment().subtract(11 - i, 'weeks').isoWeek()
          const week = num < 10 ? `0${num}周` : `${num}周`
          this.xAxisList.push(week)
        }
      } else if (dateType === 2) {
        for (let i = 0; i < 12; i++) {
          this.xAxisList.push(this.$moment().subtract(11 - i, 'months').format('YYYY/MM'))
        }
      }
    },
    getFadeRate (list, date) {
      let rate = 0
      list.forEach(item => {
        if (item.date === date) {
          rate = item.rate
        }
      })
      return rate
    },
    async getMaterialAnalyze () {
      const { dateType } = this
      const params = { dateType }
      const res = await this.$api.getMaterialAnalyze(params)
      this.createXAxisList()
      const { code, data } = res
      if (code === '200') {
        this.dataList = data.echartData
        this.tableData = data.tableData
      } else {
        this.dataList = []
        this.tableData = []
      }
    }
  },
  created () {
    this.getMaterialAnalyze()
  },
  components: { board, selectRadio, incomeingCharts }
}
</script>

<style lang="scss">
.incoming-analysis-page {
  height: 100%;
  .incoming-analysis-header {
    padding: 0 2vw;
  }
  .incoming-analysis-content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 89%;
    .incoming-content-top {
      height: 50%;
      border-bottom: 0.3vh solid #0f0c2d;
      margin-bottom: 1vh;
      padding: 0 1vw;
    }
    .incoming-content-bottom {
      height: 50%;
    }
  }
}
</style>
