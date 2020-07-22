<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">自动计算管制线</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-date-picker v-model="timeValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入关键词" v-model.trim="searchForm.keyWord" size="mini" style="width:40%;float:right" @keydown.enter.native="getControlLine"/>
      </el-col>
        <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="产品系列:" class="el-col el-col-11">
            <mes-select v-model="searchForm.mComMaterialfamilyId" clearable  method="getMachine" labelKey="mComMaterialfamilyName" valueKey="mComMaterialfamilyId"></mes-select>
          </el-form-item>
          <el-form-item label="控制项名称:" class="el-col el-col-11 el-col-offset-1">
            <el-input placeholder="请输入控制项名称" v-model.trim="searchForm.itemCode" size="mini" style="width:100%;" />
          </el-form-item>
          <el-form-item label="线别:" class="el-col el-col-11">
            <mes-select v-model="searchForm.mPomLineId" clearable  method="getLineList" labelKey="lineName" valueKey="mPomLineId"></mes-select>
          </el-form-item>
          <el-form-item label="料号:" class="el-col el-col-11 el-col-offset-1">
            <material-select v-model="searchForm.mComMaterialId" :materialNoVersion="materialNo" style="width:100%" ></material-select>
          </el-form-item>
          <el-form-item label="控制图类型:" class="el-col el-col-11">
            <dict-select style="width:100%;" v-model="searchForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode" clearable></dict-select>
          </el-form-item>
          <el-form-item label="模穴号/零件位置:" class="el-col el-col-11 el-col-offset-1">
            <el-input placeholder="请输入模穴号" v-model.trim="searchForm.moldCavityNo" size="mini" style="width:100%;" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row  class="mes-table-handle">
        <el-col :span="12">
          <el-button icon="el-icon-search" size="mini" @click="getControlLine">查询</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetForm">刷新</el-button>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage" :initData="getControlLine" :total="total" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @cell-click="cellClick">
          <el-table-column type="index" label="序号" align="center" fixed="left" :index="indexMethod"></el-table-column>
          <el-table-column sortable prop="officeName" label="部门" align="center" min-width="100"></el-table-column>
          <el-table-column prop="itemCode" sortable label="控制项名称" min-width="130" label-class-name="mes-table-label" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column sortable prop="materialNo" label="料号" align="center" min-width="100"></el-table-column>
          <el-table-column sortable prop="materialRev" label="料号版次" align="center" min-width="120"></el-table-column>
          <el-table-column prop="lineCode" sortable label="线别" align="center"></el-table-column>
          <el-table-column prop="stationCode" sortable label="量测站/实验室" align="center" min-width="150"></el-table-column>
          <el-table-column prop="instrumentName" sortable label="测量仪器" align="center" min-width="120"></el-table-column>
          <el-table-column prop="controlChartType" sortable label="控制图" align="center" min-width="120"></el-table-column>
          <el-table-column prop="materialfamilyCode" sortable label="产品系列" width="180" align="center"></el-table-column>
          <el-table-column sortable prop="moldCavityNo" label="模穴号/零件位置" align="center" min-width="150"></el-table-column>
          <el-table-column prop="itemDesc" sortable label="控制项描述" width="150" align="center"></el-table-column>
          <el-table-column sortable prop="mPomLineId" label="操作" align="center" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="saveDetailList(scope.row.tSpcControlItemId)">提交更新</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="tabAciveName">
        <el-tab-pane label="详细信息" name="info">
           <div class="mes-table">
            <el-table :data="detailData" border size="mini">
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="chartType" sortable label="管制图类型" align="center"></el-table-column>
              <el-table-column prop="ucl" sortable label="UCL" align="center"></el-table-column>
              <el-table-column prop="cl" sortable label="CL" align="center"></el-table-column>
              <el-table-column prop="lcl" sortable label="LCL" align="center"></el-table-column>
           </el-table>
           </div>
        </el-tab-pane>
        <el-tab-pane label="历史信息" name="information">
          <div class="mes-table">
            <el-table :data="historyRecordData" border size="mini">
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="chartType" sortable label="管制图类型" align="center"></el-table-column>
              <el-table-column prop="ucl" sortable label="UCL" align="center"></el-table-column>
              <el-table-column prop="cl" sortable label="CL" align="center"></el-table-column>
              <el-table-column prop="lcl" sortable label="LCL" align="center"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="'更新管制线'" class="handle-dialog" width="1000px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :tSpcControlItemId="tSpcControlItemId" ></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
// import info from './Tabs/info'
// import information from './Tabs/information'
import dialogForm from './dialogForm'
import materialSelect from '@/components/Module/materialSelect/materialSelect'
export default {
  data () {
    return {
      materialNo: '',
      searchForm: {
        starDate: '',
        endDate: '',
        keyWord: '',
        mComMaterialfamilyId: '',
        itemCode: '',
        mPomLineId: '',
        mComMaterialId: '',
        conTrolChartType: '',
        moldCavityNo: ''
      },
      showMoreConditon: false,
      total: 0,
      tableData: [],
      controlLine: '',
      showTas: false,
      tabAciveName: 'info',
      dialogVisible: false,
      materialColumns: [{
        key: 'materialNo',
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
      }],
      timeValue: [],
      detailData: [],
      historyRecordData: [],
      tSpcControlItemId: ''
    }
  },
  methods: {
    indexMethod (index) {
      const { pageIndex, pageSize } = this.$refs.mesPage.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.getControlLine()
    },
    async getControlLine () {
      let { searchForm } = this
      const res = await this.$api.getControlLineList(searchForm)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    cellClick (row, column, cell, event) {
      let { property } = column
      if (property === 'itemCode') {
        this.showTas = true
        this.getDetaildata(row.tSpcControlItemId)
        this.getHistorydata(row.tSpcControlItemId)
      } else {

      }
    },
    async getDetaildata (tSpcControlItemId) {
      let data = {
        tSpcControlItemId: tSpcControlItemId,
        type: 0
      }
      let res = await this.$api.getDetailsAndHistory(data)
      if (res.code === '200') {
        this.detailData = res.data
      } else {
        this.detailData = []
      }
    },
    async getHistorydata (tSpcControlItemId) {
      let data = {
        tSpcControlItemId: tSpcControlItemId,
        type: 1
      }
      let res = await this.$api.getDetailsAndHistory(data)
      if (res.code === '200') {
        this.historyRecordData = res.data
      } else {
        this.historyRecordData = []
      }
    },
    async saveDetailList (tSpcControlItemId) {
      this.tSpcControlItemId = tSpcControlItemId
      this.dialogVisible = true
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm,
    materialSelect
  },
  created () {
    this.getControlLine()
  }
}
</script>
