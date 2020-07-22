<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">最终检验</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="searchForm.docStatus" dictType="QMS_CHECK_NO_STATUS"  style="width:35%" selectKey="dictCode" @change="findFqcList"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" placeholder="请输入关键字" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="findFqcList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findFqcList"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="检验日期：" class="el-col el-col-11">
            <el-date-picker style="width:100%" v-model="timeValue"  type="daterange" align="right" unlink-panels  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" :picker-options="pickerOptions" clearable></el-date-picker>
          </el-form-item>
            <el-form-item label="入库单号" class="el-col el-col-11  el-col-offset-1">
            <el-input  v-model="searchForm.stockInNo"  placeholder="请输入入库单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="料号" class="el-col el-col-11">
            <el-input v-model="searchForm.materialNo" size="mini" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="findFqcList">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleCheck('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData('')">批量删除</el-button>
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
        <el-table :data="tableData" highlight-current-row border size="mini"  @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="batchNo" label="检验单号" align="center" sortable></el-table-column>
          <el-table-column prop="stockInNo" label="入库单号" align="center" sortable></el-table-column>
          <el-table-column prop="materialNo" label="料号" align="center" sortable></el-table-column>
          <el-table-column prop="customer" label="客户" align="center" sortable></el-table-column>
          <el-table-column prop="inspectDate" label="日期" align="center" sortable></el-table-column>
          <el-table-column prop="docStatusName" label="状态" align="center" sortable></el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleCheck(scope.row)" iconClass="el-icon-edit-outline" tipText="编辑"></handle-button>
              <handle-button @click="deletetableData(scope.row.tQomFqcMainId)" iconClass="el-icon-delete" tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions: {
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
      searchForm: {
        docStatus: 'DRAFT',
        keywords: '',
        materialNo: '',
        stockInNo: ''
      },
      timeValue: [],
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      lineList: [],
      selectList: []
    }
  },
  computed: {
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findFqcList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findFqcList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.tQomFqcMainId)
      })
    },
    // 获取表的内容
    async findFqcList () {
      let { searchForm, page, timeValue } = this
      let startTime = timeValue[0] ? timeValue[0] : ''
      let endTime = timeValue[1] ? timeValue[1] : ''
      let data = Object.assign(page, searchForm, { startTime, endTime })
      let res = await this.$api.findFqcList(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    handleCheck (row) {
      if (row) {
        let status = this.searchForm.docStatus
        const { batchNo, tQomFqcMainId } = row
        this.$router.push(`FqcCheck/edit?id=${tQomFqcMainId}&status=${status}&unitNumber=${batchNo}`)
      } else {
        this.$router.push(`FqcCheck/add?status=DRAFT`)
      }
    },
    async deletetableData (id) {
      let { selectList } = this
      const ids = id ? [id] : selectList
      const len = ids.length
      if (len > 0) {
        let confirm = await this.$myPrompt.confirm('确定删除选中的最终检查信息吗？')
        if (confirm) {
          let res = await this.$api.deleteFqcById(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.findFqcList()
          })
        }
      } else {
        this.$message.warning('请选择要删除的最终检查信息')
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.findFqcList()
    }
  },
  created () {
    this.findFqcList()
    this.getLineData()
  }

}
</script>
