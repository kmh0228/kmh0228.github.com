<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('prodectMaint_ProduIndeChec')}}</h3>
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
            :placeholder="$t('prodectMaint_selecFactForInqu')"
            clearable></el-cascader>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="100px" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_Department')" class="el-col el-col-11">
            <el-cascader
            v-model="searchForm.ofCode"
            :options="deptOptions"
            class="col-department"
            style="width:100%"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            :placeholder="$t('prodectMaint_selecDepaForInqu')"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11 el-col-offset-1">
            <mes-select v-model="searchForm.productSeries" method="getMachine" labelKey="mComMaterialfamilyName" valueKey="mComMaterialfamilyCode"></mes-select>
          </el-form-item>
          <el-form-item :label="$t('common_ProduPartNumb')" class="el-col el-col-11">
            <el-input v-model="searchForm.productNumber" :placeholder="$t('prodectMaint_inputProdPartNumb')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_LineName')" class="el-col el-col-11  el-col-offset-1">
            <mes-select v-model="searchForm.lineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
          </el-form-item>
          <el-form-item :label="$t('common_EquipName')" class="el-col el-col-11">
            <el-input v-model="searchForm.eqpName" :placeholder="$t('common_EquipName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_time')" class="el-col el-col-11 el-col-offset-1">
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
        <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getAutonomyCheck" :total="total">
          <div slot="buttonBox">
            <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList()">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-download" :loading="downloadLoading" @click="downloadAutonomyCheck">{{$t('common_downLoad')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-search" :loading="previewLoading" @click="previewAutonomyCheck">{{$t('prodectMaint_FormPrev')}}</el-button>
          </div>
        </table-list>
      </div>
      <el-dialog :visible.sync="visible" :title="$t('prodectMaint_previ')" class="handle-dialog"  width="1200px">
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
        productSeries: '',
        productNumber: '',
        eqpName: '',
        startTime: '',
        endTime: '',
        keywords: ''
      },
      timeArr: [],
      tableData: [],
      option: tableOption(this),
      total: 0,
      showMoreConditon: false
    }
  },
  methods: {
    async getAutonomyCheck (page) {
      let ofCode = this.searchForm.ofCode.length ? this.searchForm.ofCode[this.searchForm.ofCode.length - 1] : ''
      let factoryCode = this.searchForm.factoryCode.length ? this.searchForm.factoryCode[this.searchForm.factoryCode.length - 1] : ''
      this.searchForm.startTime = this.timeArr && this.timeArr.length ? this.timeArr[0] : ''
      this.searchForm.endTime = this.timeArr && this.timeArr.length ? this.timeArr[1] : ''
      let res = await this.$api.getAutonomyCheck({ ...page, ...this.searchForm, ofCode: ofCode, factoryCode: factoryCode })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async downloadAutonomyCheck () {
      let selectData = this.$refs.tableList.getSelectData()
      if (selectData.length !== 1) {
        this.$message.warning(this.$t('prodectMaint_SelecOneDataDown'))
        return false
      }
      this.downloadLoading = true
      let res = await this.$api.downloadAutonomyCheck({ id: selectData[0].tMomAutonomyCheckId })
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
    async previewAutonomyCheck () {
      let selectData = this.$refs.tableList.getSelectData()
      if (selectData.length !== 1) {
        this.$message.warning(this.$t('prodectMaint_SelecOneDataDown'))
        return false
      }
      this.previewLoading = true
      let res = await this.$api.previewAutonomyCheck({ id: selectData[0].tMomAutonomyCheckId })
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
