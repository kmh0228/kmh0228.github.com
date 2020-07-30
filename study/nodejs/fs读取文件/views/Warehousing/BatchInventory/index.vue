<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('BatchInventory_BatchInventoryTable')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select v-model="searchForm.warehouseCode" filterable clearable  style="width:40%"  @change="$refs.tableList.queryList(true)">
          <el-option v-for="(option,i) in warehouseList" :key="i" :label="option.mWmsWarehouseName" :value="option.mWmsWarehouseCode"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('BatchInventory_Location')" v-model="searchForm.areaCode" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_MaterCode')" class="el-col el-col-11">
            <el-input size="mini" v-model="searchForm.materlalCode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_MaterialName')" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('BatchInventory_Barcode')" class="el-col el-col-11">
            <el-input size="mini" v-model="searchForm.pkgCode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('BatchInventory_MaterialLotNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.stockLotCode"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getBatchStockList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <!-- <el-button size="mini" icon="el-icon-download">{{$t('common_Export')}}</el-button>
          <span class="split-line">|</span> -->
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </div>
      </table-list>
    </div>
     <div class="mes-main-tabs mes-table" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('BatchInventory_InventoryDetails')" name="inventoryDetails">
            <el-table :data="detailList" border size="mini" style="margin-top:10px">
              <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="pkgCode" sortable :label="$t('BatchInventory_BarcodeNo')" min-width="180" align="center"></el-table-column>
              <el-table-column prop="materialLot" sortable :label="$t('BatchInventory_MaterialLotNo')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materlalCode" sortable :label="$t('common_MaterCode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materlalName" sortable :label="$t('common_MaterialName')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="parentPkgCode" sortable :label="$t('BatchInventory_ParentBarcode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="pkgQty" sortable :label="$t('common_numbe')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="unitCode" sortable :label="$t('BatchInventory_PrimaryUnit')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="receiveDate" sortable :label="$t('common_dateManu')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="invalidDate" sortable :label="$t('BatchInventory_ExpirationDate')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="warehouseCode" sortable :label="$t('BatchInventory_WarehouseCode')" min-width="180" align="center"></el-table-column>
              <el-table-column prop="areaCode" sortable :label="$t('BatchInventory_LocationCode')" min-width="180" align="center"></el-table-column>
              <el-table-column prop="scrapped" sortable :label="$t('BatchInventory_Scrap')" min-width="150" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      searchForm: {
        warehouseCode: '',
        areaCode: '',
        materlalName: '',
        materlalCode: '',
        pkgCode: '',
        stockLotCode: ''
      },
      warehouseList: [],
      showMoreConditon: false,
      total: 0,
      option: tableOption(this),
      tableData: [],
      showTabs: false,
      stockLotId: '',
      activeName: 'inventoryDetails',
      detailList: []
    }
  },
  computed: {
  },
  watch: {
    stockLotId (n) {
      this.getBatchStockDetailed()
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.searchForm = {
        warehouseCode: '',
        areaCode: '',
        materlalName: '',
        materlalCode: '',
        pkgCode: '',
        stockLotCode: ''
      }
      this.$refs.tableList.queryList(true)
    },
    async getBatchStockList (page) {
      let res = await this.$api.getBatchStockList({ ...page, ...this.searchForm })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async getBatchStockDetailed () {
      let { stockLotCode, binId } = this.tableData.find(item => item.stockLotId === this.stockLotId)
      let res = await this.$api.getBatchStockDetailed({ stockLotCode, binId })
      if (res.code === '200') {
        this.detailList = res.data && res.data.list ? res.data.list : []
      } else {
        this.detailList = []
      }
    },
    // 获取仓库列表
    async getWarehouses () {
      let res = await this.$api.getWarehouses({ keywords: '', pageSize: 10000, pageIndex: 1 })
      // 获取仓库列表
      this.warehouseList = res.data.list ? res.data.list.filter(item => item.invalid) : []
    }
  },
  components: {
    TableList
  },
  created () {
    this.getWarehouses()
  }
}
</script>
