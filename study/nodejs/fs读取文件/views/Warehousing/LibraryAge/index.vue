<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('LibraryAge_EarlyWarning')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:35%" v-model="searchForm.materialNo" :placeholder="$t('LibraryAge_PleaseEnterThePN')"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input style="width:40%;float:right;" v-model="searchForm.pkgId" :placeholder="$t('LibraryAge_PleaseEnterPKGID')"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getLibraryAgeList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          <el-tooltip  effect="dark" :content="$t('LibraryAge_redBackground')" placement="right">
            <i class="el-icon-question" style="color:#E6A23C;font-size:16px;margin-left:10px;cursor:pointer"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage" :initData="getLibraryAgeList" :total="total" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border :row-style="tableRowStyle">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="materialNo" :label="$t('LibraryAge_PN')" align="center" sortable></el-table-column>
          <el-table-column prop="materialName" :label="$t('LibraryAge_Production')" align="center" sortable></el-table-column>
          <el-table-column prop="pkgId" :label="$t('LibraryAge_PKG_ID')" align="center" sortable></el-table-column>
          <el-table-column prop="qty" :label="$t('LibraryAge_Num')" align="center" sortable></el-table-column>
          <el-table-column prop="entryListTime" :label="$t('LibraryAge_WarehousingDate')" align="center" sortable></el-table-column>
          <el-table-column prop="validDate" :label="$t('LibraryAge_ExpirationDate')" align="center" sortable></el-table-column>
          <el-table-column prop="warehouseName" :label="$t('LibraryAge_Warehouse')" align="center" sortable></el-table-column>
          <el-table-column prop="warehouseBinCode" :label="$t('LibraryAge_StorageLocation')" align="center" sortable></el-table-column>
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
