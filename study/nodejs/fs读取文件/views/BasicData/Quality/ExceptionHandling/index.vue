<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">异常处理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="searchForm.docStatus" dictType="SUBMIT_STATUS"  style="width:35%" selectKey="dictCode" @change="findExceptList"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" placeholder="请输入关键字" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="findExceptList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findExceptList"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="产品系列" class="el-col el-col-11">
            <mes-select v-model="searchForm.model" labelKey="mComMaterialfamilyCode" valueKey="mComMaterialfamilyId" method="getMachine"></mes-select>
          </el-form-item>
          <el-form-item label="生产单位" class="el-col el-col-11  el-col-offset-1">
            <mes-select v-model="searchForm.productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select>
          </el-form-item>
          <el-form-item label="稽核日期" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="datetimerange"   start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="findExceptList">查询</el-button>
          <span class="split-line">|</span>
          <!-- <el-button size="mini" icon="el-icon-plus" @click="handleCheck('')">新增</el-button>
          <span class="split-line">|</span> -->
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
          <el-table-column prop="docNo" label="异常单号" align="center" sortable></el-table-column>
          <el-table-column prop="batchNo" label="检验单号" align="center" sortable></el-table-column>
          <el-table-column prop="model" label="产品系列" align="center" sortable></el-table-column>
          <el-table-column prop="productionUnit" label="生产单位" align="center" sortable></el-table-column>
          <el-table-column prop="inspectItem" label="稽核项目" align="center" sortable></el-table-column>
          <el-table-column prop="inspectContent" label="稽核内容" align="center" sortable></el-table-column>
          <el-table-column prop="failTypeName" label="不良类型" align="center" sortable></el-table-column>
          <el-table-column prop="failCategoryName" label="不良种类" align="center" sortable></el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleCheck(scope.row)" iconClass="el-icon-edit-outline" tipText="编辑"></handle-button>
              <handle-button @click="deletetableData(scope.row.tQomFqcMainId)" iconClass="el-icon-delete" tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="800px" class="handle-dialog">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" :findExceptList="findExceptList" :id="id"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      searchForm: {
        docStatus: 'DRAFT',
        productionUnit: '',
        model: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      timeValue: [],
      showMoreConditon: false,
      dialogVisible: false,
      isEdit: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑异常处理列表' : '新增异常处理列表'
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findExceptList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findExceptList()
    },
    selectionChange (selection) {

    },
    async findExceptList () {
      let { searchForm, timeValue, page } = this
      searchForm.startTime = timeValue[0] ? timeValue[0] : ''
      searchForm.endTime = timeValue[1] ? timeValue[1] : ''
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getExcepList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    handleCheck (row) {
      this.id = row.id
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          this.$refs.dialog.model = row.model
          this.$refs.dialog.productionUnit = row.productionUnit
          this.$refs.dialog.inspectContent = row.inspectContent
          this.$refs.dialog.failType = row.failType
          this.$refs.dialog.failCategory = row.failCategory
        })
      } else {
        this.isEdit = false
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.timeValue = []
      this.$global.resetForm(this.searchForm)
      this.searchForm.status = 'DRAFT'
      this.findExceptList()
    },
    cannel () {
      this.dialogVisible = false
    }

  },
  components: {
    dialogForm
  },
  created () {
    this.findExceptList()
  }
}

</script>
