<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">点检达成率</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.factoryCode" style="width:35%" ></cascader-select>
        <el-button size="mini" icon="el-icon-search" @click="getRateData">查询</el-button>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
         <el-select size="mini" clearable placeholder="请选择责任层级"  style="width:35%;float:right"  v-model="searchForm.hierarchyId" >
            <el-option v-for="(option,i) in hierarchyList" :key="i" :label="option.hierarchyName" :value="option.mMomHierarchyId" @change="getRateData"></el-option>
          </el-select>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item label="故障起始时间"  class="el-col el-col-12">
            <el-date-picker  v-model="dateList"  type="daterange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" style="width:100%"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row  :gutter="20">
      <!-- <el-col :span="8">
        <p>已达成数量</p>
        <p style="color:#67C23A">{{resData.finishNum}}</p>
      </el-col>
       <el-col :span="8">
        <p>未达成数量</p>
        <p style="color:#F56C6C">{{resData.notFinishNum}}</p>
      </el-col>
       <el-col :span="8">
        <p>点检达成率</p>
        <p style="color:#409EFF">{{resData.rate}}</p>
      </el-col> -->
      <el-col :span="8" style="height:22vh;padding-top:1vh">
         <pie-echart id="achieveRate" pieTitle="点检达成率分析" :seriesData="checkRateData" :labelData="labelData"></pie-echart>
      </el-col>
      <el-col :span="8" style="height:22vh;padding-top:1vh">
         <pie-echart id="maintainRate" pieTitle="保养达成率分析" :seriesData="maintainRateData" :labelData="labelData"></pie-echart>
      </el-col>
      <el-col :span="8" style="height:22vh;padding-top:1vh">
         <bar-echart id="rate" barTitle="保养达成率分析" :reachData="reachData" :notReachData="notReachData"></bar-echart>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div class="mes-table"  style="margin-top:2.5vh" >
      <el-row class="mes-table-handle">
         <el-col :span="12" >
          <el-button size="mini" icon="el-icon-search" @click="getTpmCheckList">查询</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-search" @click="exportCheckExcel">导出Excel</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh" @click="exportCheckPdf">打印pdf</el-button>
        </el-col>
        <el-col :span="12" >
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange"   @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content" id="check">
        <el-table :data="cehckTable" border highlight-current-row size="mini" height="180">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" width="50"></el-table-column>
           <el-table-column prop="officeName"  width="120" label="工厂" align="center"></el-table-column>
          <el-table-column prop="hierarchyCode"  width="120" label="责任层级" align="center" min-width="120"></el-table-column>
          <el-table-column prop="lineCode" label="线别名称" align="center" min-width="120"></el-table-column>
          <el-table-column prop="resourceCode" width="150" label="设备名称" align="center" min-width="120"></el-table-column>
          <el-table-column prop="frequency" label="点检周期" align="center"  min-width="120">
            <template slot-scope="scope">
              <p>{{ scope.row.frequency === '1'  ? '日' : scope.row.frequency === '2' ? '周' : '月' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="点检状态" align="center"  min-width="120">
            <template slot-scope="scope">
              <el-tag :type="checkStatusTag(scope.row.status)">{{ fliterCheckStatus(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="planTime"  width="140" label="计划点检时间" align="center"  min-width="150"></el-table-column>
          <el-table-column prop="startTime" width="140" label="点检开始时间" align="center"  min-width="150"></el-table-column>
          <el-table-column prop="endTime"  width="140" label="点检结束时间" align="center"  min-width="150"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-table"  style="margin-top:2.5vh">
      <el-row class="mes-table-handle">
         <el-col :span="12" >
          <el-button size="mini" icon="el-icon-search" @click="getMaintainTable">查询</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-search" @click="exportMaintainExcel">导出Excel</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh" @click="exportMaintainPdf">打印pdf</el-button>
        </el-col>
        <el-col :span="12" >
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
            @current-change="handleCurrentChange1"   @size-change="handleSizeChange1">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content" id="maintain">
        <el-table :data="maintainTable" border highlight-current-row size="mini" height="190">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod1" width="50"></el-table-column>
          <el-table-column prop="frequencyDictName" sortable label="保养方式" align="center" ></el-table-column>
          <el-table-column prop="officeName" sortable label="工厂" align="center"></el-table-column>
          <el-table-column prop="hierarchy" sortable label="责任层级" align="center" min-width="140"></el-table-column>
          <el-table-column prop="lineName" sortable label="线别名称" align="center" ></el-table-column>
          <el-table-column prop="typeName" sortable label="设备名称" align="center" min-width="120"></el-table-column>
          <el-table-column prop="maintainStatusDictName" sortable label="保养状态" align="center" min-width="120"></el-table-column>
          <el-table-column prop="planTime" sortable label="排配日期" align="center" min-width="150" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="startTime" sortable label="保养开始时间" align="center" min-width="150" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="endTime" sortable label="保养结束时间" align="center" min-width="150" :formatter="dateFormatter"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import pieEchart from './echartCompoment/pie'
import barEchart from './echartCompoment/bar'
export default {
  data () {
    return {
      searchForm: {
        factoryCode: '',
        hierarchyId: '',
        startTime: '',
        endTime: ''
      },
      dateList: [],
      showMore: false,
      hierarchyList: [],
      labelData: ['未达成数量', '已达成数量'],
      checkRateData: [],
      maintainRateData: [],
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
      cehckTable: [],
      checkStatusList: [
        {
          label: '未开始',
          value: '0'
        },
        {
          label: '处理中',
          value: '1'
        },
        {
          label: '待确认',
          value: '2'
        },
        {
          label: '已完成',
          value: '3'
        }
      ],
      maintainTable: [],
      reachData: [],
      notReachData: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTpmCheckList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTpmCheckList()
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (size) {
      this.page1.pageSize = size
      this.getMaintainTable()
    },
    handleSizeChange1 (index) {
      this.page1.pageIndex = index
      this.getMaintainTable()
    },
    async getRateData () {
      let { searchForm, dateList } = this
      searchForm.startTime = dateList[0] ? this.$dayjs(dateList[0]).format('YYYY-MM-DD 00:00:00') : ''
      searchForm.endTime = dateList[1] ? this.$dayjs(dateList[1]).format('YYYY-MM-DD 00:00:00') : ''
      let res = await this.$api.getRate(searchForm)
      if (res.code === '200') {
        this.checkRateData = [
          {
            name: this.labelData[0],
            value: res.data.checkRate.notFinishNum
          }, {
            name: this.labelData[1],
            value: res.data.checkRate.finishNum
          }
        ]
        this.maintainRateData = [
          {
            name: this.labelData[0],
            value: res.data.maintainRate.notFinishNum
          }, {
            name: this.labelData[1],
            value: res.data.maintainRate.finishNum
          }
        ]
        this.reachData = [res.data.checkRate.finishNum, res.data.maintainRate.finishNum]
        this.notReachData = [res.data.checkRate.notFinishNum, res.data.maintainRate.notFinishNum]
      } else {
        this.checkRateData = []
        this.maintainRateData = []
        this.reachData = []
        this.notReachData = []
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
    // 获取点检数据
    async getTpmCheckList () {
      const { page, dateList } = this
      let planStartTime = dateList[0] || ''
      let planEndTime = dateList[1] || ''
      const params = Object.assign({ planStartTime, planEndTime }, page)
      const res = await this.$api.getTpmCheckList(params)
      const { code, data } = res
      if (code === '200') {
        this.cehckTable = data.list
        this.total = data.totalNum
      } else {
        this.cehckTable = []
        this.total = 0
      }
    },
    fliterCheckStatus (status) {
      const { checkStatusList } = this
      const checkStatus = checkStatusList.filter(item => item.value === status)
      return checkStatus[0] ? checkStatus[0].label : ''
    },
    checkStatusTag (status) {
      let type = ''
      switch (status) {
        case '0':
          type = 'info'
          break
        case '1':
          type = ''
          break
        case '2':
          type = 'warning'
          break
        case '3':
          type = 'success'
          break
        default:
          type = ''
          break
      }
      return type
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    // 获取保养数据
    async  getMaintainTable () {
      const { page1, dateList } = this
      let startTime = dateList[0] ? this.$dayjs(dateList[0]).format('YYYY-MM-DD 00:00:00') : ''
      let endTime = dateList[1] ? this.$dayjs(dateList[1]).format('YYYY-MM-DD 00:00:00') : ''
      let data = Object.assign({ startTime, endTime }, page1)
      let res = await this.$api.getMaintainList(data)
      if (res.code === '200') {
        this.total1 = res.data.totalNum
        this.maintainTable = res.data.list
      } else {
        this.total1 = 0
        this.maintainTable = []
      }
    },
    // 导出点检表
    async  exportCheckExcel () {
      let { dateList } = this
      let planStartTime = dateList[0] ? this.$dayjs(dateList[0]).format('YYYY-MM-DD 00:00:00') : ''
      let planEndTime = dateList[1] ? this.$dayjs(dateList[1]).format('YYYY-MM-DD 00:00:00') : ''
      let res = await this.$api.exportCheckExcel({ planStartTime, planEndTime })
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '点检表'
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      window.URL.revokeObjectURL(blob)
    },
    // 导出点检pdf
    async exportCheckPdf () {
      this.getPdf('check', '点检表')
    },
    // 导出保养表
    async  exportMaintainExcel () {
      let res = await this.$api.exportMaintainExcel()
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '保养表'
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      window.URL.revokeObjectURL(blob)
    },
    // 导出保养pdf
    async exportMaintainPdf () {
      this.getPdf('maintain', '点检表')
    }

  },
  created () {
    this.getRateData()
    this.findHierarchyList()
    this.getTpmCheckList()
    this.getMaintainTable()
  },
  components: {
    pieEchart, barEchart
  }
}
</script>

<style lang="scss">
.achieve-info {
  .el-col {
    text-align: center;
    p {
      padding: 1.5vh 0;
      &:first-child {
        color: #666;
        font-size: 1.2vw;
      }
      &:last-child {
        font-size: 2vw;
        font-weight: 600;
      }
    }
  }
}
</style>
