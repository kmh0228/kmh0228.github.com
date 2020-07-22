<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">报警上报记录查询</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.factoryCode" style="width:35%"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="报警单号" v-model="searchForm.alarmNumber" style="width:40%;float:right;" @keydown.enter.native="getAndonAlarmReportRecord">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getAndonAlarmReportRecord"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
          <el-form-item label="线别" prop="resourceName" class="el-col el-col-11">
            <el-select v-model="searchForm.mPomLineId " placeholder="请选择线别" filterable clearable size="mini" class="mes-form-item">
              <el-option v-for="(list,i) in lineList" :key="i" :label="list.lineName" :value="list.mPomLineId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getAndonAlarmReportRecord">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteAndonAlarmReportRecord('')">批量删除</el-button>
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
      <el-table :data="tableData" border size="mini" @selection-change="tableSelectionChange">
        <el-table-column type="selection" fixed="left" width="50" align="center"></el-table-column>
        <el-table-column type="index" sortable fixed="left" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName" sortable label="工厂" align="center"></el-table-column>
        <el-table-column prop="lineName" sortable label="线别" align="center"></el-table-column>
        <el-table-column prop="alarmTime" sortable label="报警时间" align="center" width="140"></el-table-column>
        <el-table-column prop="alarmNumber" sortable label="报警单号" align="center" width="100"></el-table-column>
        <el-table-column prop="alarmType" sortable label="上报类型" align="center" width="100">
          <!-- <template slot-scope="scope">
            <p>{{ getAlarmType(scope.row.alarmType) }}</p>
          </template> -->
        </el-table-column>
        <el-table-column prop="alarmReceiver" sortable label="上报接收人" align="center" width="110"></el-table-column>
        <el-table-column prop="messageTitle" sortable label="信息标题" align="center" width="100"></el-table-column>
        <el-table-column prop="messageContent" sortable label="信息内容" align="center" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pushSuccess" sortable label="是否推送成功" align="center" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.pushSuccess?'':'danger'" size="mini">{{scope.row.pushSuccess | formaterInvalid}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pushTime" sortable label="发送时间" align="center" width="140"></el-table-column>
        <el-table-column prop="pushFailLog" sortable label="发送失败日志" align="center" width="120"></el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="deleteAndonAlarmReportRecord(scope.row.mAlmRerortId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        factoryCode: '',
        mPomLineId: '',
        alarmNumber: ''
      },
      showMore: false,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      lineList: [],
      tableData: [],
      selectList: []
    }
  },
  methods: {
    // getAlarmType (type) {
    //   const typelist = [
    //     {
    //       label: '响应超时',
    //       value: '0'
    //     },
    //     {
    //       label: '一级报警',
    //       value: '1'
    //     },
    //     {
    //       label: '二级报警',
    //       value: '2'
    //     },
    //     {
    //       label: '三级报警',
    //       value: '3'
    //     }
    //   ]
    //   const currentType = typelist.filter(item => item.value === type)
    //   return currentType[0] ? currentType[0].label : ''
    // },
    async getLineList () {
      const params = {
        lineName: '',
        lineType: '',
        pageIndex: 1,
        pageSize: 10000
      }
      let res = await this.$api.getLineList(params)
      const { code, data } = res
      if (code === '200') {
        this.lineList = data.list
      } else {
        this.lineList = []
      }
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getAndonAlarmReportRecord()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getAndonAlarmReportRecord()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mAlmRerortId)
      })
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.searchForm.factoryCode = ''
      this.searchForm.mPomLineId = ''
      this.searchForm.alarmNumber = ''
      this.getAndonAlarmReportRecord()
    },
    async getAndonAlarmReportRecord () {
      const { searchForm, page } = this
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getAndonAlarmReportRecord(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async deleteAndonAlarmReportRecord (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的报警上传记录吗？')
        if (confirm) {
          const res = await this.$api.deleteAndonAlarmReportRecord(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getAndonAlarmReportRecord()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的报警上传记录！')
      }
    }
  },
  created () {
    this.getLineList()
    this.getAndonAlarmReportRecord()
  }
}
</script>
