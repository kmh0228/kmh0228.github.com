<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">点检单管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:35%" @change="getTpmCheckList"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="点检单号" v-model="searchForm.docNo" style="width:40%;float:right;" @keydown.enter.native="getTpmCheckList"></el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
          <el-form-item label="设备名称" prop="resourceName" class="el-col el-col-11">
            <el-input v-model="searchForm.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="设备类别" prop="resourceTypeId" class="el-col el-col-11 el-col-offset-2">
            <el-select v-model="searchForm.resourceTypeId" clearable filterable @change="getTpmCheckList" style="width:100%">
              <el-option v-for="option in eqpTypeList" :key="option.mMomResourceTypeId" :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任层级" prop="hierarchyId" class="el-col el-col-11">
            <el-select v-model="searchForm.hierarchyId" clearable filterable style="width:100%" @change="getTpmCheckList">
              <el-option v-for="option in levelList" :key="option.mMomHierarchyId" :label="option.hierarchyName" :value="option.mMomHierarchyId "></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="点检状态" prop="status" class="el-col el-col-11 el-col-offset-2">
            <el-select v-model="searchForm.status" clearable style="width:100%" @change="getTpmCheckList">
              <el-option v-for="(option,index) in checkStatusList" :key="index" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始时间" prop="hierarchyId" class="el-col el-col-11">
            <el-date-picker v-model="timeList"  type="datetimerange" :picker-options="pickerOptions" range-separator="至" :default-time="['12:00:00', '12:00:00']"
            start-placeholder="开始时间" end-placeholder="结束时间" align="center" style="width:100%;" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button  size="mini" icon="el-icon-search" @click="getTpmCheckList">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-close" @click="closeCheckOrder('')">关闭</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
       <!-- 点检单列表 -->
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange" @current-change="tableActiveRow">
        <el-table-column type="selection" fixed="left" width="50" align="center"></el-table-column>
        <el-table-column type="index" fixed="left" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName"  width="120" label="工厂" align="center"></el-table-column>
        <el-table-column prop="hierarchyCode"  width="120" label="责任层级" align="center"></el-table-column>
        <el-table-column prop="docNo"  width="150" label="点检单号" align="center"></el-table-column>
        <el-table-column prop="lineCode" label="线别名称" align="center"></el-table-column>
        <el-table-column prop="resourceCode" width="150" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="frequency" label="点检周期" align="center">
           <template slot-scope="scope">
            <p>{{ scope.row.frequency === '1'  ? '日' : scope.row.frequency === '2' ? '周' : '月' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="点检状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="checkStatusTag(scope.row.status)">{{ fliterCheckStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="点检结果" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.result ? '通过' : '不通过' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="kindWork" label="工种" align="center"></el-table-column>
        <el-table-column prop="planTime"  width="140" label="计划点检时间" align="center"></el-table-column>
        <el-table-column prop="startTime" width="140" label="点检开始时间" align="center"></el-table-column>
        <el-table-column prop="endTime"  width="140" label="点检结束时间" align="center"></el-table-column>
        <el-table-column prop="operator" fixed="right"  width="100" label="点检人" align="center"></el-table-column>
        <el-table-column prop="confirmer" fixed="right" width="100"  label="确认人" align="center"></el-table-column>
      </el-table>
       <!-- 故障原因处理方法 -->
      <div class="mes-main-tabs" v-if="showTabs">
        <el-tabs  v-model="activeTabName">
          <el-tab-pane label="点检明细" name="info" class="mes-table-content">
            <el-table :data="checkInfoList" border highlight-current-row size="mini">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="点检方式" prop="item"></el-table-column>
              <el-table-column label="点检内容" prop="detail"></el-table-column>
              <el-table-column label="点检方法" prop="method"></el-table-column>
              <el-table-column label="设备状态" prop="status"></el-table-column>
              <el-table-column label="下限值" prop="lowerValue"></el-table-column>
              <el-table-column label="上限值" prop="upperValue"></el-table-column>
              <el-table-column label="备注" prop="remark"></el-table-column>
              <el-table-column label="点检值" prop="actValue"></el-table-column>
              <el-table-column label="点检结果" prop="result">
                <template slot-scope="scope">
                  <p>{{ scope.row.result ? '通过' : '不通过' }}</p>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
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
        resourceName: '',
        resourceTypeId: '',
        hierarchyId: '',
        status: '',
        planStartTime: '',
        planEndTime: ''
      },
      eqpTypeList: [],
      levelList: [],
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
      showMore: false,
      timeList: [],
      pickerOptions: {
        disabledDate: time => {
          const today = this.$dayjs().format('YYYY-MM-DD')
          return time.getTime() > this.$dayjs(`${today} 23:59:59`).valueOf()
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      slectList: [],
      tMomChecklistId: '',
      activeTabName: 'info',
      checkInfoList: []
    }
  },
  computed: {
    showTabs () {
      return this.tMomChecklistId !== ''
    }
  },
  watch: {
    tMomChecklistId (val) {
      this.getTpmCheckDetail()
    }
  },
  methods: {
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
    // 获取设备类别
    async geteqpTypeList () {
      const params = {
        officeCode: '',
        typeCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getDeviceClassList(params)
      const { code, data } = res
      if (code === '200') {
        this.eqpTypeList = data.list
      } else {
        this.eqpTypeList = []
      }
    },
    // 获取责任层级
    async getLevelList () {
      const params = {
        hierarchyCode: '',
        officeCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.findHierarchyList(params)
      const { code, data } = res
      if (code === '200') {
        this.levelList = data.list
      } else {
        this.levelList = []
      }
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTpmCheckList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTpmCheckList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableSelectionChange (selection) {
      this.slectList = []
      selection.forEach(item => {
        this.slectList.push(item.tMomChecklistId)
      })
    },
    tableActiveRow (row) {
      this.tMomChecklistId = row ? row.tMomChecklistId : ''
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.searchForm.officeCode = ''
      this.searchForm.docNo = ''
      this.$refs.searchForm.resetFields()
      this.getTpmCheckList()
    },
    async getTpmCheckList () {
      const { searchForm, page, timeList } = this
      if (timeList.length > 0) {
        searchForm.planStartTime = timeList[0]
        searchForm.planEndTime = timeList[1]
      }
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getTpmCheckList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async getTpmCheckDetail () {
      const checklistId = this.tMomChecklistId
      const res = await this.$api.getTpmCheckDetail({ checklistId })
      const { code, data } = res
      if (code === '200') {
        this.checkInfoList = data
      } else {
        this.checkInfoList = []
      }
    },
    async closeCheckOrder (id) {
      const checklistIds = id ? [id] : this.slectList
      if (checklistIds.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定关闭当前选中的点检单吗？')
        if (confirm) {
          const res = await this.$api.closeCheckOrder(checklistIds)
          this.$myPrompt.handleMsg(res, () => {
            this.getTpmCheckList()
          })
        }
      } else {
        this.$message.warning('请先选择需要关闭的点检单！')
      }
    }
  },
  created () {
    this.geteqpTypeList()
    this.getLevelList()
    this.getTpmCheckList()
  }
}
</script>
