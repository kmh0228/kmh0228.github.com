<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('firstCheck_FirstInsp')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="searchForm.docStatus" dictType="SUBMIT_STATUS"  style="width:35%" selectKey="dictCode" @change="findMainPageCheck"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('common_PleasEnteKeyw')" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="findMainPageCheck"></el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('firstCheck_InspeDateF')" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="daterange"   start-:placeholder="$t('common_StartDate')" end-:placeholder="$t('common_EndDate')"  value-format="yyyy-MM-dd" clearable></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11 el-col-offset-1">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleProdSe')"  v-model="searchForm.model" >
              <el-option v-for="(option,i) in modelList" :key="i" :label="option.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_Line')" class="el-col el-col-11">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="searchForm.mPomLineId">
              <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_posit')" class="el-col el-col-11 el-col-offset-1">
            <el-input  v-model="searchForm.location"  style="width:100%" size="mini"  clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('firstCheck_InspeCate')" class="el-col el-col-11">
            <dict-select v-model="searchForm.inspectCategory" dictType='QMS_CHECK-TYPE' clearable></dict-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="findMainPageCheck">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <!-- <el-button size="mini" icon="el-icon-plus" @click="handleCheck('')" >{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span> -->
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTableData('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          <!-- <span class="split-line">|</span>
          <el-button size="mini" >{{$t('common_Submit')}}</el-button> -->
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" highlight-current-row border size="mini" @cell-click="cellClick" @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="batchNo" :label="$t('common_BatchNumb')" align="center" sortable></el-table-column>
          <el-table-column prop="productSn" label="SN" align="center" sortable></el-table-column>
          <el-table-column prop="inspectDate" :label="$t('firstCheck_InspeDate')" align="center" sortable :formatter="formatterDate"  min-width="120"></el-table-column>
          <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center" sortable></el-table-column>
          <el-table-column prop="modelCode" :label="$t('common_ProduSeries')" align="center" sortable min-width="120"></el-table-column>
          <el-table-column prop="location" :label="$t('common_posit')" align="center" sortable></el-table-column>
          <el-table-column prop="lineCode" :label="$t('common_Line')" align="center" sortable></el-table-column>
          <el-table-column prop="machineCodeName" :label="$t('common_Machi')" align="center" sortable></el-table-column>
          <el-table-column prop="inspectCategoryCode" :label="$t('firstCheck_InspeCate')" align="center" sortable min-width="120"></el-table-column>
          <el-table-column prop="docStatusName" :label="$t('common_Status')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button iconClass="el-icon-edit-outline" @click="handleCheck(scope.row)" :placeholder="$t('common_Edit')"></handle-button>
              <handle-button iconClass="el-icon-delete" @click="deleteTableData(scope.row.tqomFaiMainId)" :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
          <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('firstCheck_Detai')" name="infoName">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{$t('common_BasicInfo')}}</span>
              </div>
              <el-form v-model="infoForm" label-width="30%" label-position="left" class="el-row work-order-info mes-form-rule" style="padding:20px">
                <el-form-item :label="$t('firstCheck_BatchNumbFeed') + ':'"  class="el-col el-col-8">
                  <p >{{ infoForm.batchNo }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_ItemNo')"  class="el-col el-col-8">
                  <p >{{ infoForm.materialNo }}</p>
                </el-form-item>
                <el-form-item label="SN："  class="el-col el-col-8">
                  <p >{{ infoForm.productSn }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_ProduSeri')"  class="el-col el-col-8">
                  <p >{{ infoForm.modelCode }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_Manuf')"  class="el-col el-col-8">
                  <p >{{ infoForm.productionUnitCode }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_LineType')"  class="el-col el-col-8">
                <p >{{ infoForm.lineCode }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_Locat')" class="el-col el-col-8">
                  <p >{{ infoForm.location }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_InspeDateF')" class="el-col el-col-8">
                <p >{{ infoForm.inspectDate }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_examiCler')"  class="el-col el-col-8">
                <p >{{ infoForm.inspectorName }}</p>
                </el-form-item>
                <el-form-item :label="$t('firstCheck_InspeCateF')"  class="el-col el-col-8">
                <p >{{ infoForm.inspectCategoryCode }}</p>
                </el-form-item>
            </el-form>
              <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <span>{{$t('common_InspeRecord')}}</span>
                </div>
                <div class="mes-table" style="padding:20px">
                  <el-row class="mes-table-handle">
                    <el-col :span="12">
                      <span style="margin-right:15px">{{$t('firstCheck_InspeReguNo')}}</span>
                      <el-input :disabled="true" size="mini" v-model="sipNo" style="width:40%"></el-input>
                    </el-col>
                    <el-col :span="12">
                      <span style="margin-right:15px">{{$t('firstCheck_RevisInspRegu')}}</span>
                      <el-input :disabled="true" size="mini" v-model="sipVer" style="width:40%"></el-input>
                      </el-col>
                  </el-row>
                  <div class="mes-table-content">
                    <el-table :data="checkData" border size="mini">
                      <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
                      <el-table-column prop="inspectItem" :label="$t('common_AuditItem')" align="center"></el-table-column>
                      <el-table-column prop="inspectContent" :label="$t('common_AuditCont')" align="center"></el-table-column>
                      <!-- <el-table-column prop="inspectItem" :label="$t('common_Speci')" align="center"></el-table-column> -->
                      <el-table-column prop="defectImage" :label="$t('firstCheck_bluep')" align="center"></el-table-column>
                      <el-table-column prop="inspectInfo" :label="$t('common_detecResu')" align="center"></el-table-column>
                      <el-table-column prop="inspectResult" :label="$t('common_JudgmResu')" align="center"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-card>
            </el-card>
          </el-tab-pane>
          </el-tabs>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showMoreConditon: false,
      searchForm: {
        docStatus: 'DRAFT',
        keywords: '',
        location: '',
        model: '',
        mPomLineId: '',
        inspectCategory: '',
        startTime: '',
        endTime: ''
      },
      showTabs: false,
      timeValue: [],
      machineList: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      activeName: 'infoName',
      checkData: [],
      editInfo: true,
      infoForm: {},
      inspectCategoryList: [this.$t('firstCheck_PatroInsp'), this.$t('firstCheck_SelfInsp'), this.$t('firstCheck_other')],
      modelList: [],
      lineList: [],
      selectList: [],
      sipNo: '',
      sipVer: ''
    }
  },
  computed: {
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findMainPageCheck()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findMainPageCheck()
    },
    cellClick (row, column, cell, event) {
      this.showTabs = true
      this.showDetailData(row.tqomFaiMainId)
    },
    // 单击一行展示信息
    async showDetailData (tQomFaiMainId) {
      let res = await this.$api.getInfoAndDetailCheck({ tQomFaiMainId })
      this.infoForm = res.data
      this.sipNo = res.data.sipNo
      this.sipVer = res.data.sipVer
      this.checkData = res.data.detailList
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.tqomFaiMainId)
      })
    },
    // 日期转换
    formatterDate (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD') : ''
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.modelList = res.data.list
    },
    // 获取首检信息
    async findMainPageCheck () {
      let { searchForm, page, timeValue } = this
      searchForm.startTime = timeValue[0] ? timeValue[0] : ''
      searchForm.endTime = timeValue[1] ? timeValue[1] : ''
      let data = Object.assign(searchForm, page)
      let res = await this.$api.findMainPageCheck(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    handleCheck (row) {
      if (row) {
        const { tqomFaiMainId, batchNo } = row
        const { docStatus } = this.searchForm
        this.$router.replace(`FirstCheck/edit?id=${tqomFaiMainId}&status=${docStatus}&unitNumber=${batchNo}`)
      } else {
        this.$router.replace(`FirstCheck/add?status=DRAFT`)
      }
    },
    // 删除表信息
    async deleteTableData (id) {
      const ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        let confirm = await this.$myPrompt.confirm(this.$t('firstCheck_AreYouSureInspInfo'))
        if (confirm) {
          let res = await this.$api.deleteMainAndDetailCheck(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.showTabs = false
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.findMainPageCheck()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.searchForm.docStatus = 'DRAFT'
      this.findMainPageCheck()
    }
  },
  created () {
    this.getLineData()
    this.getModelList()
    this.findMainPageCheck()
  }

}
</script>

<style lang="scss">
.el-card__body {
  padding: 0px;
}
</style>
