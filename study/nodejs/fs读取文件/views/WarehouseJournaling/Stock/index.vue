<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('stock_InvenRepoQuer')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select size="mini" v-model="searchForm.mWmsWarehouseId" :placeholder="$t('common_PleasSeleWare')" @change="selectChange" clearable style="width:40%">
          <el-option v-for="(option,i) in warehouseTypeList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px"  @click="showMoreDetail = ! showMoreDetail">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" v-model.trim="searchForm.materialNo" :placeholder="$t('common_PleasEnteItemNu')" style="width:40%;float:right" @change="selectChange"></el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMoreDetail">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('stock_StoraLoca')" class="el-col el-col-11">
            <el-input v-model="searchForm.mWmsWarehouseBinCode" @change="selectChange" :placeholder="$t('stock_inputStorCode')"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="getStockRemaining">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetForm">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
           layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content" >
        <el-table :data="tableData" border highlight-current-row  size="mini" @cell-click="cellClick">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="materialNo"  sortable :label="$t('common_PorN')" align="center"></el-table-column>
          <el-table-column prop="materialName"  sortable :label="$t('common_MaterialName')" align="center"></el-table-column>
          <el-table-column prop="mWmsWarehouseCode"  sortable :label="$t('common_Wareh')" align="center"></el-table-column>
          <el-table-column prop="mWmsWarehouseBinCode"  sortable :label="$t('common_StoraLoca')" align="center"></el-table-column>
          <el-table-column prop="mWmsStockQty"  sortable :label="$t('stock_InvenQuan')" align="center"></el-table-column>
          <el-table-column prop="mWmsStockHoldqty"  sortable :label="$t('stock_FrozeQuan')" align="center"></el-table-column>
          <el-table-column prop="mWmsStockRestqty"  sortable :label="$t('stock_AvailQuan')" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName" >
        <el-tab-pane :label="$t('stock_InvenDeta')" name="detail">
          <el-row class="mes-table-handle">
            <el-col :span="24">
              <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
              @current-change="handleCurrentChange" @size-change="handleSizeChange">
              </el-pagination>
            </el-col>
          </el-row>
          <el-table :data="detailList" border highlight-current-row size="mini">
            <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
            <el-table-column prop="materialNo"  sortable :label="$t('common_PorN')" align="center"></el-table-column>
            <el-table-column prop="materialName"  sortable :label="$t('common_MaterialName')" align="center"></el-table-column>
            <el-table-column prop="mWmsEntrylistNo"  sortable :label="$t('common_StockInNo')" align="center"></el-table-column>
            <el-table-column prop="mWmsPkgidPkgid"  sortable label="PIKGID" align="center"></el-table-column>
            <el-table-column prop="mWmsWarehouseCode"  sortable :label="$t('common_Wareh')" align="center"></el-table-column>
            <el-table-column prop="mWmsWarehouseBinCode"  sortable :label="$t('common_StoraLoca')" align="center"></el-table-column>
            <el-table-column prop="mWmsStockDetailQty"  sortable :label="$t('stock_InvenQuan')" align="center"></el-table-column>
            <el-table-column prop="mWmsWarehouseBinStatus"  sortable :label="$t('stock_FrozeStat')" align="center" :formatter="formatterData"></el-table-column>
            <el-table-column prop="mWmsStockDetailEntrylisttime" width="150"  sortable :label="$t('stock_StoraTime')" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        mWmsWarehouseId: '',
        materialNo: '',
        mWmsWarehouseBinCode: ''
      },
      showMoreDetail: false,
      tableData: [],
      detailList: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      showTas: false,
      activeName: 'detail',
      pageList: {
        pageSize: 1000,
        pageIndex: 1
      },
      warehouseTypeList: [],
      detailForm: {
        materialId: '',
        mWmsWarehouseId: '',
        mWmsWarehouseBinId: ''
      },
      materialId: ''
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getStockRemaining()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getStockRemaining()
    },
    selectChange () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getStockRemaining()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
      this.getStockRemainingDetail()
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
      this.getStockRemainingDetail()
    },
    indexMethod1 (index) {
      let { pageSize, pageIndex } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatterData (row, column, cellValue, index) {
      return cellValue === '1' ? this.$t('common_Yes') : this.$t('common_No')
    },
    async getStockRemaining () {
      let { searchForm, page } = this
      let params = Object.assign(searchForm, page)
      let res = await this.$api.getStockRemaining(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    // 获取仓库列表
    async getWarehouses () {
      const page = this.pageList
      const keywords = ''
      const params = Object.assign(page, { keywords })
      const res = await this.$api.getWarehouses(params)
      const { code, data } = res
      if (code === '200') {
        this.warehouseTypeList = data.list
      } else {
        this.warehouseTypeList = []
      }
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.getStockRemaining()
    },
    cellClick (row, column, cell, event) {
      this.showTas = true
      this.detailForm.materialId = row.materialId
      this.detailForm.mWmsWarehouseId = row.mWmsWarehouseId
      this.detailForm.mWmsWarehouseBinId = row.mWmsWarehouseBinId
      this.getStockRemainingDetail()
    },
    async getStockRemainingDetail () {
      let { page1, detailForm } = this
      let params = Object.assign(detailForm, page1)
      let res = await this.$api.getStockRemainingDetail(params)
      const { code, data } = res
      if (code === '200') {
        this.detailList = data.list
        this.total1 = data.totalNum
      } else {
        this.detailList = []
        this.total1 = 0
      }
    }
  },
  created () {
    this.getStockRemaining()
    this.getWarehouses()
  }
}
</script>
