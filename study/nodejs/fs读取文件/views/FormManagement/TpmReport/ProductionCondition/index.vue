<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('productCondit_RecorProdCond')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-cascader
            v-model="searchForm.mOrgId"
            :options="factoryOptions"
            class="col-department"
            style="width:35%"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            @change="$refs.tableList.queryList(true)"
            :placeholder="$t('productCondit_selecFactForInqu')"
            clearable></el-cascader>
      </el-col>
      <el-col :span="12" >
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('productCondit_inputItemNumbForInqu')" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="100px" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_Department')" class="el-col el-col-11">
            <el-cascader
            v-model="searchForm.officeCode"
            :options="deptOptions"
            class="col-department"
            style="width:100%"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            @change="$refs.tableList.queryList(true)"
            :placeholder="$t('productCondit_selecDepaForInqu')"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11  el-col-offset-1">
            <mes-select v-model="searchForm.productSeries" method="getMachine" labelKey="mComMaterialfamilyName" valueKey="mComMaterialfamilyCode"></mes-select>
          </el-form-item>
          <el-form-item :label="$t('common_time')" class="el-col el-col-11 ">
            <el-date-picker
              v-model="timeArr"
              type="daterange"
              style="width:100%"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-:placeholder="$t('common_StartDate')"
              end-:placeholder="$t('common_EndDate')">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div>
        <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getConditionRecordReport" :total="total">
          <div slot="buttonBox">
            <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList()">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-download" :loading="downloadLoading" @click="downloadConditionRecordReport">{{$t('common_downLoad')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-search" :loading="previewLoading" @click="previewConditionRecordReport">{{$t('productCondit_FormPrev')}}</el-button>
          </div>
        </table-list>
      </div>
      <el-dialog :visible.sync="visible" :title="$t('productCondit_previ')" class="handle-dialog"  width="1200px">
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
        mOrgId: [],
        officeCode: [],
        keywords: '',
        productSeries: ''
      },
      timeArr: [],
      tableData: [],
      option: tableOption(this),
      total: 0,
      showMoreConditon: false
    }
  },
  methods: {
    async getConditionRecordReport (page) {
      let officeCode = this.searchForm.officeCode.length ? this.searchForm.officeCode[this.searchForm.officeCode.length - 1] : ''
      let mOrgId = this.searchForm.mOrgId.length ? this.searchForm.mOrgId[this.searchForm.mOrgId.length - 1] : ''
      let startTime = this.timeArr && this.timeArr.length ? this.timeArr[0] : ''
      let endTime = this.timeArr && this.timeArr.length ? this.timeArr[1] : ''
      let res = await this.$api.getConditionRecordReport({ ...page, ...this.searchForm, officeCode: officeCode, mOrgId: mOrgId, startTime: startTime, endTime: endTime })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async downloadConditionRecordReport () {
      let selectData = this.$refs.tableList.getSelectData()
      if (selectData.length !== 1) {
        this.$message.warning(this.$t('productCondit_SelecOneDataDown'))
        return false
      }
      this.downloadLoading = true
      let res = await this.$api.downloadConditionRecordReport({ id: selectData[0].tMomEqpConditionrecordId })
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
    async previewConditionRecordReport () {
      let selectData = this.$refs.tableList.getSelectData()
      if (selectData.length !== 1) {
        this.$message.warning(this.$t('productCondit_SelecOneDataDown'))
        return false
      }
      this.previewLoading = true
      let res = await this.$api.previewConditionRecordReport({ id: selectData[0].tMomEqpConditionrecordId })
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
