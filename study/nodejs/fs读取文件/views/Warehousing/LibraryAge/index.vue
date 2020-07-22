<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">库龄预警</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:35%" v-model="searchForm.materialNo" placeholder="请输入料号"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input style="width:40%;float:right;" v-model="searchForm.pkgId" placeholder="请输入PKGID"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getLibraryAgeList">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
          <el-tooltip  effect="dark" content="表格中红色背景表示当前批次的库存时间大于有效期，" placement="right">
            <i class="el-icon-question" style="color:#E6A23C;font-size:16px;margin-left:10px;cursor:pointer"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage" :initData="getLibraryAgeList" :total="total" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border :row-style="tableRowStyle">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="materialNo" label="料号" align="center" sortable></el-table-column>
          <el-table-column prop="materialName" label="品名" align="center" sortable></el-table-column>
          <el-table-column prop="pkgId" label="PKG_ID" align="center" sortable></el-table-column>
          <el-table-column prop="qty" label="数量" align="center" sortable></el-table-column>
          <el-table-column prop="entryListTime" label="入库日期" align="center" sortable></el-table-column>
          <el-table-column prop="validDate" label="有效期" align="center" sortable></el-table-column>
          <el-table-column prop="warehouseName" label="仓库" align="center" sortable></el-table-column>
          <el-table-column prop="warehouseBinCode" label="储位" align="center" sortable></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        materialNo: '',
        pkgId: ''
      },
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
      const { entryListTime, validDate } = row
      const entryTimestamp = this.$dayjs(entryListTime).valueOf()
      const nowTimestamp = this.$dayjs().valueOf()
      const diff = (nowTimestamp - entryTimestamp) / 24 / 60 / 60 / 1000
      if (diff > validDate) {
        return { backgroundColor: '#f56c6c' }
      }
    },
    async getLibraryAgeList () {
      const { page } = this.$refs.mesPage
      const { searchForm } = this
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getDatabaseAgeWarning(params)
      this.$myPrompt.handleMsg(res, data => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    refreshPage () {
      this.$ref.mesPage.resetPage()
      this.$global.resetForm(this.searchForm)
      this.getLibraryAgeList()
    }
  },
  mounted () {
    this.getLibraryAgeList()
  }
}
</script>
