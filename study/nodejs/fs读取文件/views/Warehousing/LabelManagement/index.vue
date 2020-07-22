<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">标签管理</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select size="mini" placeholder="操作类型"  v-model="searchForm.pkgidStatus" clearable filterable style="width:40%" @change="$refs.tableList.queryList(true)">
            <el-option label="创建" value="1"></el-option>
            <el-option label="收货" value="2"></el-option>
            <el-option label="上架" value="3"></el-option>
            <el-option label="拣货" value="4"></el-option>
            <el-option label="出库" value="5"></el-option>
          </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" placeholder="条码号" v-model="searchForm.pkgCode" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="物料编码" class="el-col el-col-11">
            <el-input v-model="searchForm.materlalCode"></el-input>
          </el-form-item>
          <el-form-item label="物料名称" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.materlalName"></el-input>
          </el-form-item>
          <el-form-item label="父条码" class="el-col el-col-11">
            <el-input v-model="searchForm.parentPikCode"></el-input>
          </el-form-item>
          <el-form-item label="关联单号" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.docNo"></el-input>
          </el-form-item>
          <el-form-item label="物料批次号" class="el-col el-col-11">
            <el-input v-model="searchForm.materlalLot"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getLabelList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="$router.push('/Warehousing/LabelManagement/LabelSplit')">标签拆分</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="$router.push('/Warehousing/LabelManagement/LabelMerging')">标签合并</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-bottom" >导出</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button></div>
      </table-list>
    </div>
     <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="条码履历" name="barCodeResume">
            <el-table :data="barCodeResumeList" border size="mini">
              <el-table-column type="index" label="序号" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="mWmsPkgidPkgid" sortable label="条码号" min-width="150" align="center"></el-table-column>
              <el-table-column prop="operateType" sortable label="操作类型" min-width="150" align="center"></el-table-column>
              <el-table-column prop="parentPkgid" sortable label="父条码" min-width="150" align="center"></el-table-column>
              <el-table-column prop="billNo" sortable label="单号" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable label="物料编码" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable label="物料名称" min-width="150" align="center"></el-table-column>
              <el-table-column prop="qty" sortable label="数量" min-width="150" align="center"></el-table-column>
              <el-table-column prop="operateDesc" sortable label="操作原因" min-width="150" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
           <el-tab-pane label="位置信息" name="positionInformation">
            <el-table :data="positionInformationList" border size="mini">
              <el-table-column type="index" label="序号" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="mWmsPkgidPkgid" sortable label="条码号" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable label="物料编码" min-width="150" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable label="物料名称" min-width="150" align="center"></el-table-column>
              <el-table-column prop="qty" sortable label="数量" min-width="150" align="center"></el-table-column>
              <el-table-column prop="uomName" sortable label="单位" min-width="150" align="center"></el-table-column>
              <el-table-column prop="warehouseCode" sortable label="仓库编码" min-width="150" align="center"></el-table-column>
              <el-table-column prop="warehouseName" sortable label="仓库名称" min-width="150" align="center"></el-table-column>
              <el-table-column prop="binCode" sortable label="库位编码" min-width="150" align="center"></el-table-column>
              <el-table-column prop="binName" sortable label="库位名称" min-width="150" align="center"></el-table-column>
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
