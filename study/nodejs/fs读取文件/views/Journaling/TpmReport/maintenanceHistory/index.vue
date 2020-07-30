<template>
   <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('maintenanceH_MaintRecoInqu')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1" @change="getTableData"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button style="float:right;margin-left:10px" size="mini" @click="showMoreDetail = !showMoreDetail">
          <i class="fa fa-filter" ></i>
        </el-button>
        <el-input :placeholder="$t('maintenanceH_MaintOrdeNo')" v-model.trim="searchForm.docNo" style="float:right;width:40%" @keydown.enter.native="getTableData">
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreDetail">
          <el-form-item :label="$t('common_EquipName')" class="el-col el-col-11">
            <el-input v-model="searchForm.resourceName"></el-input>
          </el-form-item>
           <el-form-item :label="$t('maintenanceH_MaintStat') + ':'" class="el-col el-col-11 el-col-offset-1">
             <dict-select v-model="searchForm.maintainStatus" dictType='MAINTAIN_LIST_TYPE' clearable></dict-select>
          </el-form-item>
          <el-form-item :label="$t('maintenanceH_MaintDate')" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="daterange"   start-:placeholder="$t('common_StartDate')" end-:placeholder="$t('common_EndDate')"  value-format="yyyy-MM-dd" clearable></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
     <div class="mes-table">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
              @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
          </el-col>
        </el-row>
        <div class="mes-table-content">
          <el-table :data="tableData" highlight-current-row border size="mini" @cell-click="cellClick">
            <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
            <el-table-column prop="officeName" :label="$t('common_Factory')" align="center" sortable></el-table-column>
            <el-table-column prop="resourceCode" :label="$t('common_RespoLeve')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="docNo" :label="$t('maintenanceH_MaintOrdeNo')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="lineName" :label="$t('common_LineName')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="resourceName" :label="$t('common_EquipName')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="frequencyDictName" :label="$t('maintenanceH_MaintFreq')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="maintainStatusDictName" :label="$t('maintenanceH_MaintStat')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="isDowntime" :label="$t('maintenanceH_ShutdOrNot')" align="center" sortable min-width="120" :formatter="isDownFormatter"></el-table-column>
            <el-table-column prop="planTime" :label="$t('maintenanceH_SchedMainTime')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="startTime" :label="$t('maintenanceH_MaintStarTime')" align="center" sortable  min-width="120"></el-table-column>
            <el-table-column prop="endTime" :label="$t('maintenanceH_EndTimeMain')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="operator" :label="$t('maintenanceH_Maint')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="confirmer" :label="$t('maintenanceH_Confi')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="confirmDate" :label="$t('maintenanceH_ConfiTime')" align="center" sortable min-width="120"></el-table-column>
            <!-- <el-table-column prop="docStatusName" :label="$t('maintenanceH_PlannHour')" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="docStatusName" :label="$t('maintenanceH_ActuaWorkHour')" align="center" sortable min-width="120"></el-table-column> -->
          </el-table>
        </div>
      </div>
       <div class="mes-main-tabs mes-table" v-if="showTabs">
        <el-tabs v-model="activeName" >
          <el-tab-pane :label="$t('maintenanceH_MaintDeta')" name="maintainDetail" >
              <el-row class="mes-table-handle">
              <el-col :span="24">
              <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                  @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
             <div class="mes-table-content">
               <el-table :data="detailData" size="mini" border highlight-current-row @cell-click="cellDetailClick">
                <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
                <el-table-column prop="maintainContent" sortable :label="$t('maintenanceH_maintProg')" align="center" ></el-table-column>
                <el-table-column prop="maintainMethod" sortable :label="$t('maintenanceH_MaintMeth')" align="center" ></el-table-column>
                <el-table-column prop="attachment" sortable :label="$t('common_enclo')" align="center" label-class-name="mes-table-label" class-name="mes-table-click" :formatter="downFormatter"></el-table-column>
                <el-table-column prop="standardTime" sortable :label="$t('maintenanceH_StandDuraMin')" align="center" ></el-table-column>
                <el-table-column prop="isWork" sortable :label="$t('maintenanceH_WorkOrNot')" align="center" :formatter="isWorkFormatter"></el-table-column>
              </el-table>
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
        officeCode: '',
        docNo: '',
        maintainStatus: '',
        resourceName: '',
        startTime: '',
        endTime: ''
      },
      showMoreDetail: false,
      timeValue: [],
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      total1: 0,
      page1: {
        pageIndex: 1,
        pageSize: 10
      },
      showTabs: false,
      activeName: 'maintainDetail',
      detailData: []
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
      this.getTableDataDetail()
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
      this.getTableDataDetail()
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    isDownFormatter (row, column, cellValue, index) {
      return cellValue ? this.$t('maintenanceH_ShutDown') : this.$t('maintenanceH_NoShut')
    },
    isWorkFormatter (row, column, cellValue, index) {
      return cellValue ? this.$t('common_Yes') : this.$t('common_No')
    },
    downFormatter (row, column, cellValue, index) {
      return cellValue ? this.$t('common_downLoad') : ''
    },
    async getTableData () {
      let { searchForm, timeValue, page } = this
      searchForm.startTime = timeValue[0] || ''
      searchForm.endTime = timeValue[1] || ''
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getMaintainList(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    refreshPage () {
      this.timeValue = []
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.getTableData()
    },
    // 获取详细信息
    async getTableDataDetail (tMomMaintainlistId) {
      let { page1 } = this
      let data = Object.assign(page1, { tMomMaintainlistId })
      let res = await this.$api.getMaintainDetailList(data)
      if (res.code === '200') {
        this.total1 = res.data.totalNum
        this.detailData = res.data.list
      } else {
        this.total1 = 0
        this.detailData = []
      }
    },
    cellClick (row, column, cell, event) {
      this.showTabs = true
      this.getTableDataDetail(row.tmomMaintainlistId)
    },
    cellDetailClick (row, column, cell, event) {
      if (column.property === 'attachment') {
        if (row.attachment) {
          let aLink = document.createElement('a')
          aLink.href = `http://10.157.138.206:8989/dfs/dfsFile/downloadFile?fileId=${row.attachment}`
          aLink.click()
        }
      }
    }

  },
  created () {
    this.getTableData()
  }
}

</script>
