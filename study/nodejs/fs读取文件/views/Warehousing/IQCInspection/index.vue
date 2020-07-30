<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('IQCInspection_IQCInspection')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input v-model="searchForm.materialNo" style="width:40%" :placeholder="$t('common_PorN')" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('IQCInspection_BatchNumber')" v-model="searchForm.lotCode" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('IQCInspection_DateRange')" class="el-col el-col-11">
            <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              :range-separator="$t('common_')"
              start-:placeholder="$t('common_StartDate')"
              end-:placeholder="$t('common_dDate')"  format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common_InspeOrdeNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.iqcNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_StockInNo')" class="el-col el-col-11">
            <el-input v-model="searchForm.entrylistNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('IQCInspection_InspectionStatus')" class="el-col el-col-11 el-col-offset-1">
            <el-select size="mini" :placeholder="$t('IQCInspection_InspectionStatus')"  v-model="searchForm.checkStatus" style="width:100%">
              <el-option :label="$t('IQCInspection_NotInspected')" value="0"></el-option>
              <el-option :label="$t('IQCInspection_Inspected')" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('IQCInspection_ProcessingResult')" class="el-col el-col-11">
            <el-select size="mini" :placeholder="$t('IQCInspection_ProcessingResult')"  v-model="searchForm.handleResult" style="width:100%">
              <el-option :label="$t('common_SpeciColl')" value="0"></el-option>
              <el-option :label="$t('common_choos')" value="1"></el-option>
              <el-option :label="$t('IQCInspection_Scrap')" value="2"></el-option>
              <el-option :label="$t('IQCInspection_Return')" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getIQCCheckList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" @click="auditClick">{{$t('IQCInspection_InspectionReview')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </div>
      </table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      showMoreConditon: false,
      searchForm: {
        time: [],
        materialNo: '',
        lotCode: '',
        iqcNo: '',
        entrylistNo: '',
        checkStatus: '',
        handleResult: ''
      },
      total: 0,
      option: tableOption(this),
      tableData: []
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.searchForm = {
        time: [],
        materialNo: '',
        lotCode: '',
        iqcNo: '',
        entrylistNo: '',
        checkStatus: '',
        handleResult: ''
      }
      this.$refs.tableList.queryList(true)
    },
    async getIQCCheckList (page) {
      let data = { ...this.searchForm }
      data.startTime = this.searchForm.time && this.searchForm.time.length ? this.searchForm.time[0] : ''
      data.endTime = this.searchForm.time && this.searchForm.time.length ? this.searchForm.time[1] : ''
      delete data.time
      let res = await this.$api.getIQCCheckList({ ...page, ...data })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    auditClick () {
      let data = this.$refs.tableList.getSelectData()
      if (data.length !== 1) {
        this.$message.warning(this.$t('IQCInspection_PleaseSelectADataToBeInspectedAndApproved'))
        return false
      }
      sessionStorage.setItem('IQCAuditData', JSON.stringify(data))
      this.$router.push('/Warehousing/IQCInspection/IQCInspectionAudit')
    }
  },
  components: {
    TableList
  },
  created () {
  }
}
</script>
