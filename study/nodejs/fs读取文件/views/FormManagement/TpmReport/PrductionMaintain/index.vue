<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">生产自主保养表</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12" :offset="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-cascader
            v-model="searchForm.factoryCode"
            :options="factoryOptions"
            class="col-department"
            style="width:35%;float:right;"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            @change="$refs.tableList.queryList(true)"
            placeholder="请选择工厂查询"
            clearable></el-cascader>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="100px" label-position="left" v-show="showMoreConditon">
          <el-form-item label="部门" class="el-col el-col-11">
            <el-cascader
            v-model="searchForm.ofCode"
            :options="deptOptions"
            class="col-department"
            style="width:100%"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            placeholder="请选择部门查询"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item label="线别名称" class="el-col el-col-11  el-col-offset-1">
            <mes-select v-model="searchForm.lineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
          </el-form-item>
          <el-form-item label="月份" class="el-col el-col-11 ">
            <el-date-picker
              v-model="searchForm.month"
              style="width:100%"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div>
        <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getAutonomyMaintain" :total="total">
          <div slot="buttonBox">
            <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList()">查询</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-download" :loading="downloadLoading" @click="downloadAutonomyMaintain">下载</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-search" :loading="previewLoading" @click="previewAutonomyMaintain">表单预览</el-button>
          </div>
        </table-list>
      </div>
      <el-dialog :visible.sync="visible" title="预览" class="handle-dialog"  width="1200px">
        <div v-html="previewHtml"></div>
      </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import { tableOption } from './tableOption'
export default {
  components: { TableList },
  data () {
    return {
      factoryOptions: [],
      deptOptions: [],
      downloadLoading: false,
      previewLoading: false,
      visible: false,
      previewHtml: '',
      searchForm: {
        factoryCode: [],
        ofCode: [],
        lineId: '',
        keywords: '',
        month: ''
      },
      timeArr: [],
      tableData: [],
      option: tableOption(this),
      total: 0,
      showMoreConditon: false
    }
  },
  methods: {
    async getAutonomyMaintain (page) {
      let ofCode = this.searchForm.ofCode.length ? this.searchForm.ofCode[this.searchForm.ofCode.length - 1] : ''
      let factoryCode = this.searchForm.factoryCode.length ? this.searchForm.factoryCode[this.searchForm.factoryCode.length - 1] : ''
      let res = await this.$api.getAutonomyMaintain({ ...page, ...this.searchForm, ofCode: ofCode, factoryCode: factoryCode })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async downloadAutonomyMaintain () {
      let selectData = this.$refs.tableList.getSelectData()
      if (selectData.length !== 1) {
        this.$message.warning('选择其中一条数据下载')
        return false
      }
      this.downloadLoading = true
      let res = await this.$api.downloadAutonomyMaintain({ id: selectData[0].tMomChecklistId })
      this.downloadLoading = false
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      // a.download = row.docName
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      window.URL.revokeObjectURL(blob)
    },
    async previewAutonomyMaintain () {
      let selectData = this.$refs.tableList.getSelectData()
      if (selectData.length !== 1) {
        this.$message.warning('选择其中一条数据下载')
        return false
      }
      this.previewLoading = true
      let res = await this.$api.previewAutonomyMaintain({ id: selectData[0].tMomChecklistId })
      this.previewLoading = false
      this.previewHtml = res
      this.visible = true
    },
    refreshPage () {
      this.$global.resetForm(this.searchForm)
      this.$refs.tableList.queryList(true)
    },
    async getFactoryList () {
      const res = await this.$api.getOfficeList({ type: 1 })
      const { code, data } = res
      if (code === '200') {
        this.factoryOptions = Array.isArray(data) ? data : []
      }
    },
    async getOfficeList () {
      const res = await this.$api.getOfficeList({ type: 2 })
      const { code, data } = res
      if (code === '200') {
        this.deptOptions = Array.isArray(data) ? data : []
      }
    }
  },
  created () {
    this.getFactoryList()
    this.getOfficeList()
  }
}

</script>
