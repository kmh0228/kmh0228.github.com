<template>
  <board bTitle="SPC制程能力分析" :hasInput="false">
    <div class="spc-analysis-page">
      <div class="spc-analysis-top">
        <v-title title="级别分布" titleHight="10%"></v-title>
        <div style="height:90%;">
          <div style="width:30%;height:100%;float:left;">
            <level-pie :dataList="pieData"></level-pie>
          </div>
          <div style="width:70%;height:100%;float:left;">
            <level-line :dataList="lineData" :xAxisList="xAxisList"></level-line>
          </div>
        </div>
      </div>
      <div class="spc-analysis-bottom">
        <el-table :data="tableData" stripe class="visual-table" style="margin-top:2vh;">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="level" label="等级"></el-table-column>
          <el-table-column v-for="(item,i) in xAxisList" :key="i" :label="item" >
            <template slot-scope="scope">
              <p>{{ getSpcValue(scope.row.list,item) }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </board>
</template>

<script>
import board from '../board'
import levelPie from './levelPie'
import levelLine from './levelLine'
export default {
  data () {
    return {
      pieData: [],
      lineData: [],
      tableData: [],
      xAxisList: []
    }
  },
  methods: {
    createXAxisList () {
      this.xAxisList = []
      for (let i = 0; i < 6; i++) {
        const date = this.$moment().subtract(5 - i, 'months').format('YYYY-MM')
        this.xAxisList.push(date)
      }
    },
    getSpcValue (list, date) {
      let value = 0
      list.forEach(item => {
        if (item.date === date) {
          value = item.value
        }
      })
      return value
    },
    async getSpcAbility () {
      const res = await this.$api.getSpcAbility()
      this.createXAxisList()
      const { code, data } = res
      if (code === '200') {
        this.pieData = data.flatChartData
        this.lineData = data.curveChartData
        this.tableData = data.curveChartData.reverse()
      } else {
        this.pieData = []
        this.lineData = []
        this.tableData = []
      }
    }
  },
  components: {
    board, levelPie, levelLine
  },
  created () {
    this.getSpcAbility()
  }
}
</script>

<style lang="scss" scoped>
.spc-analysis-page {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  .spc-analysis-top {
    flex: 1;
    border-bottom: 3px solid #0f0c2d;
  }
  .spc-analysis-bottom {
    height: 42%;
  }
}
</style>
