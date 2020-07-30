<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('ipqcAudit_audit')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="searchForm.status" dictType="QMS_CHECK_NO_STATUS"  style="width:35%" selectKey="dictCode" @change="initData"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input  size="mini" style="width:35%;float:right" clearable :placeholder="$t('common_PleasEnteKeyWor')" v-model="searchForm.keywords" @keydown.enter.native="initData"></el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('ipqcAudit_InspeDate')" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValueArray"  type="daterange"   start-:placeholder="$t('common_StartDate')" end-:placeholder="$t('common_EndDate')"  value-format="yyyy-MM-dd" >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11 el-col-offset-1">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleProdSe')"  v-model="searchForm.model" >
              <el-option v-for="(option,i) in modelList" :key="i" :label="option.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_Line')" class="el-col el-col-11 ">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="searchForm.mPomLineId">
              <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleIpqcAudit('')" >{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMainAndDetail('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshData">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" highlight-current-row @cell-click="cellClick" @selection-change="tableChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="batchNo" :label="$t('common_BatchNumb')" align="center" sortable></el-table-column>
          <el-table-column prop="modelCode" :label="$t('common_ProduSeries')" align="center" sortable></el-table-column>
          <el-table-column prop="productionUnitCode" :label="$t('ipqcAudit_ProduDepa')" align="center" sortable></el-table-column>
          <el-table-column prop="inspectDate" :label="$t('common_AuditDate')" align="center" sortable></el-table-column>
          <el-table-column prop="location" :label="$t('common_posit')" align="center" sortable></el-table-column>
          <el-table-column prop="lineCode" :label="$t('common_Line')" align="center" sortable></el-table-column>
          <el-table-column prop="statusName" :label="$t('common_Status')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button iconClass="el-icon-edit-outline" @click="handleIpqcAudit(scope.row)" :placeholder="$t('common_Edit')"></handle-button>
              <handle-button iconClass="el-icon-delete" @click="deleteMainAndDetail(scope.row.tqomIpqcauditMainId)" :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
          <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('common_BasicInfo')" name="infoName">
            <el-form :model="infoForm"  label-width="120px" label-position="left" class="el-row mes-form-rule">
                <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-7">
                  <p>{{ infoForm.modelCode }}</p>
                </el-form-item>
                <el-form-item :label="$t('common_ProduUnit')" class="el-col el-col-7 el-col-offset-1">
                  <p>{{ infoForm.productionUnitCode }}</p>
                </el-form-item>
                <el-form-item :label="$t('common_Line')" class="el-col el-col-7 el-col-offset-1">
                  <p>{{ infoForm.lineCode }}</p>
                </el-form-item>
                <el-form-item :label="$t('common_posit')" class="el-col el-col-7 ">
                  <p>{{ infoForm.location }}</p>
                </el-form-item>
                <el-form-item :label="$t('common_Shift')" class="el-col el-col-7 el-col-offset-1">
                  <p>{{ infoForm.shiftName }}</p>
                </el-form-item>
                <el-form-item :label="$t('common_AuditDate')" class="el-col el-col-7 el-col-offset-1">
                  <p>{{ infoForm.inspectDate }}</p>
                </el-form-item>
                <!-- <el-form-item :label="$t('ipqcAudit_Audit')" class="el-col el-col-7 ">
                  <p>{{ infoForm.material }}</p>
                </el-form-item> -->
            </el-form>
          </el-tab-pane>
            <el-tab-pane :label="$t('common_InspeRecord')" name="checkRecord">
              <el-table :data="checkData" border>
                <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
                <el-table-column prop="inspectItem" :label="$t('common_AuditItem')" align="center"></el-table-column>
                <el-table-column prop="inspectContent" :label="$t('common_AuditCont')" align="center"></el-table-column>
                <el-table-column prop="" :label="$t('ipqcAudit_pictu')" align="center"></el-table-column>
                <el-table-column prop="inspectResult" :label="$t('common_JudgmResu')" align="center"></el-table-column>
              </el-table>
          </el-tab-pane>
          </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import paging from '@/mixins/paging'
export default {
  mixins: [paging],
  data () {
    return {
      tableData: [],
      modelList: [],
      lineList: [],
      showMoreConditon: false,
      timeValueArray: [],
      searchForm: {
        status: 'DRAFT',
        mPomLineId: '',
        model: '',
        startTime: '',
        endTime: '',
        keywords: ''
      },
      activeName: 'infoName',
      showTabs: false,
      checkData: [],
      infoForm: {
        modelCode: '',
        productionUnitCode: '',
        lineCode: '',
        location: '',
        shiftName: '',
        inspectDate: ''
      },
      IpqcauditMainIdList: []
    }
  },
  computed: {
    editDisabled () {
      let len = this.IpqcauditMainIdList.length
      return len !== 1
    }
  },
  methods: {
    refreshData () {
      let { searchForm } = this
      this.timeValueArray = []
      let keys = Object.keys(searchForm)
      keys.forEach(item => {
        if (item !== 'status') {
          searchForm[item] = ''
        }
      })
      this.initData()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.modelList = res.data.list
    },
    // 获取线别列表
    async getLineList () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    cellClick (row, column, cell, event) {
      this.showTabs = true
      this.getInfoAndDetail(row.tqomIpqcauditMainId)
    },
    // 获取所有信息
    async  getInfoAndDetail (tqomIpqcauditMainId) {
      let res = await this.$api.getInfoAndDetail({ tqomIpqcauditMainId })
      let { infoForm } = this
      let arr = []
      for (let i in infoForm) {
        arr.push(i)
      }
      arr.forEach(item => {
        infoForm[item] = res.data[item]
      })
      this.checkData = res.data.detailList
    },
    tableChange (selection) {
      this.IpqcauditMainIdList = []
      selection.map(item => {
        this.IpqcauditMainIdList.push(item.tqomIpqcauditMainId)
      })
    },
    handleIpqcAudit (row) {
      if (row) {
        const { tqomIpqcauditMainId, batchNo } = row
        const { status } = this.searchForm
        this.$router.replace(`IpqcAudit/edit?id=${tqomIpqcauditMainId}&status=${status}&unitNumber=${batchNo}`)
      } else {
        this.$router.replace(`IpqcAudit/add?status=DRAFT`)
      }
    },
    async  initData () {
      let { page, searchForm, timeValueArray } = this
      searchForm.startTime = timeValueArray[0] ? timeValueArray[0] : ''
      searchForm.endTime = timeValueArray[1] ? timeValueArray[0] : ''
      let data = Object.assign(page, searchForm)
      let res = await this.$api.findMainPage(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async deleteMainAndDetail (id) {
      const ids = id ? [id] : this.IpqcauditMainIdList
      const len = ids.length
      if (len > 0) {
        let confirm = await this.$myPrompt.confirm(this.$t('ipqcAudit_AreYouSureDeleSeleI'))
        if (confirm) {
          let res = await this.$api.deleteMainAndDetail(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.initData()
          })
        }
      } else {
        this.$message.warning(this.$t('ipqcAudit_selecDeleIPQC'))
      }
    }
  },
  created () {
    this.getModelList()
    this.initData()
    this.getLineList()
  }

}
</script>
