<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('StocksForewarn_InventoryWarning')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:35%" v-model="materialNo" :placeholder="$t('StocksForewarn_PleaseEnterThe')"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getWarningList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage" :initData="getWarningList" :total="total" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border :row-style="tableRowStyle">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="materialNo" :label="$t('StocksForewarn_PN')" align="center" sortable></el-table-column>
          <el-table-column prop="materialName" :label="$t('StocksForewarn_Name')" align="center" sortable></el-table-column>
          <el-table-column prop="warningType" :label="$t('StocksForewarn_AlarmType')" align="center" :formatter="warningTypeFormatter" sortable></el-table-column>
          <el-table-column prop="qty" :label="$t('StocksForewarn_CurrentInventory')" align="center" sortable></el-table-column>
          <el-table-column prop="lowerQuantity" :label="$t('StocksForewarn_MinimumWaterLevel')" align="center" sortable></el-table-column>
          <el-table-column prop="upperQuantity" :label="$t('StocksForewarn_MaximumWaterLevel')" align="center" sortable></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      materialNo: '',
      total: 0,
      tableData: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.$refs.mesPage.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableRowStyle ({ row, rowIndex }) {
      const { qty, lowerQuantity, upperQuantity } = row
      if (qty < lowerQuantity) {
        return { backgroundColor: '#f56c6c' }
      }
      if (qty > upperQuantity) {
        return { backgroundColor: '#e6a23c' }
      }
    },
    warningTypeFormatter (row, column, cellValue, index) {
      const { qty, lowerQuantity, upperQuantity } = row
      if (qty < lowerQuantity) {
        return this.$t('StocksForewarn_InsufficientStock')
      }
      if (qty > upperQuantity) {
        return this.$t('StocksForewarn_Overstocking')
      }
    },
    async getWarningList () {
      const { page } = this.$refs.mesPage
      const materialNo = this.materialNo
      const params = Object.assign({ materialNo }, page)
      const res = await this.$api.getStockWarning(params)
      this.$myPrompt.handleMsg(res, data => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    refreshPage () {
      this.$ref.mesPage.resetPage()
    }
  },
  mounted () {
    this.getWarningList()
  }
}
</script>
