<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('LabelManagement_LabelManagement')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select size="mini" :placeholder="$t('LabelManagement_OperationType')"  v-model="searchForm.pkgidStatus" clearable filterable style="width:40%" @change="$refs.tableList.queryList(true)">
            <el-option :label="$t('LabelManagement_found')" value="1"></el-option>
            <el-option :label="$t('LabelManagement_DateOfReceipt')" value="2"></el-option>
            <el-option :label="$t('LabelManagement_OnTheShelf')" value="3"></el-option>
            <el-option :label="$t('LabelManagement_picking')" value="4"></el-option>
            <el-option :label="$t('LabelManagement_WarehouseOut')" value="5"></el-option>
          </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('LabelManagement_barcode')" v-model="searchForm.pkgCode" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('LabelManagement_MaterialCode')" class="el-col el-col-11">
            <el-input v-model="searchForm.materlalCode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_MaterialName')" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.materlalName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('LabelManagement_ParentBarcode')" class="el-col el-col-11">
            <el-input v-model="searchForm.parentPikCode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('LabelManagement_AssociatedOrderNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.docNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('LabelManagement_MaterialBatchNumber')" class="el-col el-col-11">
            <el-input v-model="searchForm.materlalLot"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getLabelList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="$router.push('/Warehousing/LabelManagement/LabelSplit')">{{$t('LabelManagement_LabelSplit')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="$router.push('/Warehousing/LabelManagement/LabelMerging')">{{$t('LabelManagement_LabelMerging')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-bottom" >{{$t('common_Export')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button></div>
      </table-list>
    </div>
     <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('LabelManagement_BarCodeResume')" name="barCodeResume">
            <el-table :data="barCodeResumeList" border size="mini">
              <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="mWmsPkgidPkgid" sortable :label="$t('LabelManagement_barcode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="operateType" sortable :label="$t('LabelManagement_OperationType')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="parentPkgid" sortable :label="$t('LabelManagement_ParentBarcode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="billNo" sortable :label="$t('LabelManagement_OddNumbers')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable :label="$t('LabelManagement_MaterialCode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable :label="$t('common_MaterialName')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="qty" sortable :label="$t('LabelManagement_Num')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="operateDesc" sortable :label="$t('LabelManagement_OperationReason')" min-width="150" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
           <el-tab-pane :label="$t('LabelManagement_PositionInformation')" name="positionInformation">
            <el-table :data="positionInformationList" border size="mini">
              <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="mWmsPkgidPkgid" sortable :label="$t('LabelManagement_barcode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable :label="$t('LabelManagement_MaterialCode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable :label="$t('common_MaterialName')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="qty" sortable :label="$t('LabelManagement_Num')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="uomName" sortable :label="$t('LabelManagement_unit')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="warehouseCode" sortable :label="$t('LabelManagement_WarehouseCode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="warehouseName" sortable :label="$t('LabelManagement_WarehouseName')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="binCode" sortable :label="$t('LabelManagement_LocationCode')" min-width="150" align="center"></el-table-column>
              <el-table-column prop="binName" sortable :label="$t('LabelManagement_LocationnName')" min-width="150" align="center"></el-table-column>
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
        pkgidStatus: '',
        pkgCode: '',
        materlalCode: '',
        materlalName: '',
        parentPikCode: '',
        docNo: '',
        materlalLot: ''
      },
      showMoreConditon: false,
      total: 0,
      option: tableOption(this),
      tableData: [],
      showTabs: false,
      mWmsPkgidId: '',
      activeName: 'barCodeResume',
      barCodeResumeList: [],
      positionInformationList: []
    }
  },
  computed: {
  },
  watch: {
    mWmsPkgidId (n) {
      this.gethistoryList(n)
      this.getPositionList(n)
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.searchForm = {
        pkgidStatus: '',
        pkgCode: '',
        materlalCode: '',
        materlalName: '',
        parentPikCode: '',
        docNo: '',
        materlalLot: ''
      }
      this.$refs.tableList.queryList(true)
    },
    async getLabelList (page) {
      let res = await this.$api.getLabelList({ ...page, ...this.searchForm })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async gethistoryList (PkgId) {
      let res = await this.$api.gethistoryList({ PkgId })
      if (res.code === '200') {
        this.barCodeResumeList = res.data || []
      } else {
        this.barCodeResumeList = []
      }
    },
    async getPositionList (PkgId) {
      let res = await this.$api.getPositionList({ PkgId })
      if (res.code === '200') {
        this.positionInformationList = [res.data] || []
      } else {
        this.positionInformationList = []
      }
    }
  },
  components: {
    TableList
  },
  created () {
  }
}
</script>
