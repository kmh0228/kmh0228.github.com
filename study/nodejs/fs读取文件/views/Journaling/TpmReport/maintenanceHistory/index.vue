<template>
   <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">保养履历查询</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1" @change="getTableData"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button style="float:right;margin-left:10px" size="mini" @click="showMoreDetail = !showMoreDetail">
          <i class="fa fa-filter" ></i>
        </el-button>
        <el-input placeholder="保养单号" v-model.trim="searchForm.docNo" style="float:right;width:40%" @keydown.enter.native="getTableData">
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreDetail">
          <el-form-item label="设备名称" class="el-col el-col-11">
            <el-input v-model="searchForm.resourceName"></el-input>
          </el-form-item>
           <el-form-item label="保养状态：" class="el-col el-col-11 el-col-offset-1">
             <dict-select v-model="searchForm.maintainStatus" dictType='MAINTAIN_LIST_TYPE' clearable></dict-select>
          </el-form-item>
          <el-form-item label="保养日期" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="daterange"   start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd" clearable></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
     <div class="mes-table">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button size="mini" icon="el-icon-search" @click="getTableData">查询</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
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
            <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
            <el-table-column prop="officeName" label="工厂" align="center" sortable></el-table-column>
            <el-table-column prop="resourceCode" label="责任层级" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="docNo" label="保养单号" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="lineName" label="线别名称" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="resourceName" label="设备名称" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="frequencyDictName" label="保养频率" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="maintainStatusDictName" label="保养状态" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="isDowntime" label="是否停机" align="center" sortable min-width="120" :formatter="isDownFormatter"></el-table-column>
            <el-table-column prop="planTime" label="计划保养时间" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="startTime" label="保养开始时间" align="center" sortable  min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="保养结束时间" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="operator" label="保养人" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="confirmer" label="确认人" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="confirmDate" label="确认时间" align="center" sortable min-width="120"></el-table-column>
            <!-- <el-table-column prop="docStatusName" label="计划工时" align="center" sortable min-width="120"></el-table-column>
            <el-table-column prop="docStatusName" label="实际工时" align="center" sortable min-width="120"></el-table-column> -->
          </el-table>
        </div>
      </div>
       <div class="mes-main-tabs mes-table" v-if="showTabs">
        <el-tabs v-model="activeName" >
          <el-tab-pane label="保养明细" name="maintainDetail" >
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
                <el-table-column type="index" label="序号" align="center" :index="indexMethod1"></el-table-column>
                <el-table-column prop="maintainContent" sortable label="保养项目" align="center" ></el-table-column>
                <el-table-column prop="maintainMethod" sortable label="保养方法" align="center" ></el-table-column>
                <el-table-column prop="attachment" sortable label="附件" align="center" label-class-name="mes-table-label" class-name="mes-table-click" :formatter="downFormatter"></el-table-column>
                <el-table-column prop="standardTime" sortable label="标准时长（分）" align="center" ></el-table-column>
                <el-table-column prop="isWork" sortable label="是否作业" align="center" :formatter="isWorkFormatter"></el-table-column>
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
      return cellValue ? '已停机' : '未停机'
    },
    isWorkFormatter (row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    },
    downFormatter (row, column, cellValue, index) {
      return cellValue ? '下载' : ''
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
