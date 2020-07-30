<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('maintain_RepaiOrde')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.factoryCode" style="width:35%" ></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_EquipName')" v-model="searchForm.resourceName" style="width:40%;float:right;"></el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('common_RespoLeve')" prop="hierarchyId" class="el-col el-col-11">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('maintain_selecRespLeve')"  v-model="searchForm.hierarchyId" >
              <el-option v-for="(option,i) in hierarchyList" :key="i" :label="option.hierarchyCode" :value="option.mMomHierarchyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('maintain_MaintStat')" prop="statusIdList" class="el-col el-col-11 el-col-offset-2">
            <dict-select v-model="searchForm.statusIdList" dictType="RESOURCE_STATUS" ></dict-select>
          </el-form-item>
          <el-form-item :label="$t('maintain_RepaiOrdeNo')" prop="docNo" class="el-col el-col-11 ">
            <el-input v-model="searchForm.docNo" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item :label="$t('maintain_FaultStarTimeFrom')" prop="hierarchyId" class="el-col el-col-11 el-col-offset-2">
            <el-date-picker  v-model="dateList"  type="daterange"  :range-separator="$t('common_to')"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')" style="width:100%"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
     <div class="mes-table">
      <el-row class="mes-table-handle">
         <el-col :span="12" >
          <el-button  size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12" >
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange"   @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini" @cell-click="cellClick">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" width="50" fixed="left"></el-table-column>
          <el-table-column prop="officeName" sortable :label="$t('common_Factory')" align="center"></el-table-column>
          <el-table-column prop="docNo" sortable :label="$t('maintain_RepaiOrdeNo')" align="center" width="140"></el-table-column>
          <el-table-column prop="status" sortable :label="$t('maintain_MaintStat')" align="center" width="120"></el-table-column>
          <el-table-column prop="lineName" sortable :label="$t('common_LineName')" align="center" width="120"></el-table-column>
          <el-table-column prop="resourceName" sortable :label="$t('common_EquipName')" align="center" width="120"></el-table-column>
          <el-table-column prop="failCode" sortable :label="$t('maintain_FaultCode')" align="center" width="120"></el-table-column>
          <el-table-column prop="workKind" sortable :label="$t('maintain_DispaDepa')" align="center" width="120"></el-table-column>
          <el-table-column prop="remark" sortable :label="$t('common_remarks')" align="center" width="120"></el-table-column>
          <el-table-column prop="startTime" sortable :label="$t('maintain_FaultStarTime')" align="center" width="180"></el-table-column>
          <el-table-column prop="endTime" sortable :label="$t('maintain_FailuEndTime')" align="center" width="180"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('common_Creator')" align="center" width="120"></el-table-column>
          <el-table-column prop="operator" sortable :label="$t('common_opera')" align="center" width="120"></el-table-column>
          <el-table-column prop="attachmentid" sortable label="照片/视频" align="center" width="120"></el-table-column>
        </el-table>
      </div>
    </div>
      <div class="mes-main-tabs" v-if="detailTabs">
      <el-tabs v-model="activeName" >
      <el-tab-pane :label="$t('maintain_MaintDeta')" name="repairDetail">
          <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12" style="float:right">
                <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                    layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                  @current-change="handleCurrentChange1"   @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
             <div class="mes-table-content">
              <el-table :data="detailData" border highlight-current-row size="mini" >
                <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
                <el-table-column prop="operateType" sortable :label="$t('maintain_WorkCont')" align="center"></el-table-column>
                <el-table-column prop="operator" sortable :label="$t('maintain_Execu')" align="center"></el-table-column>
                <el-table-column prop="finishTime" sortable :label="$t('maintain_ComplTime')" align="center"></el-table-column>
                <el-table-column prop="failReason" sortable :label="$t('maintain_CauseFail')" align="center"></el-table-column>
                <el-table-column prop="method" sortable :label="$t('maintain_proceMeth')" align="center"></el-table-column>
                <el-table-column prop="remark" sortable :label="$t('common_remarks')" align="center"></el-table-column>
                <el-table-column prop="attachmentid" sortable :label="$t('maintain_Photo') + '/' + $t('maintain_video')" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        factoryCode: '',
        resourceName: '',
        hierarchyId: '',
        statusIdList: '',
        docNo: '',
        startTime: '',
        endTime: ''
      },
      dateList: [],
      showMore: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      tableData: [],
      hierarchyList: [],
      detailData: [],
      detailTabs: false,
      activeName: 'repairDetail'
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (size) {
      this.page1.pageSize = size
    },
    handleSizeChange1 (index) {
      this.page1.pageIndex = index
    },
    async getTableData () {
      let { searchForm, page, dateList } = this
      searchForm.startTime = dateList[0] ? this.$dayjs(dateList[0]).format('YYYY-MM-DD 00:00:00') : ''
      searchForm.endTime = dateList[1] ? this.$dayjs(dateList[1]).format('YYYY-MM-DD 00:00:00') : ''
      searchForm.statusIdList = searchForm.statusIdList ? [searchForm.statusIdList] : ''
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getRepairOrderList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    // 获取责任层级列表
    async findHierarchyList () {
      let data = { pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.findHierarchyList(data)
      if (res.code === '200') {
        this.hierarchyList = res.data.list
      } else {
        this.hierarchyList = []
      }
    },
    cellClick (row, column, cell, event) {
      this.detailTabs = true
      this.getDetailTable(row.tMomRepairlistId)
    },
    // 获取明细
    async getDetailTable (tMomRepairlistId) {
      let { page1 } = this
      const data = Object.assign(page1, { tMomRepairlistId })
      let res = await this.$api.getRepairOrderDetailList(data)
      if (res.code === '200') {
        this.detailData = res.data.list
        this.total1 = res.data.totalNum
      } else {
        this.detailData = []
        this.total1 = 0
      }
    },
    refreshPage () {
      this.dateList = []
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageSize: 10,
        pageIndex: 1
      }
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
    this.findHierarchyList()
  }
}
</script>
