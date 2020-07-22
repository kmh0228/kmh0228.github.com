<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">设备管理</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <cascader-select v-model="searchForm.officeCode" style="width:35%"></cascader-select>
    </el-col>
    <el-col :span="12">
      <el-input placeholder="请输入设备代码" v-model.trim="searchForm.resourceCode" size="mini" style="float:right;width:40%" @keydown.enter.native="getTableData" clearable>
        <i slot="suffix" class="el-input__icon"  @click="getTableData"></i>
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getTableData">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus" @click="handletable('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTable('')">批量删除</el-button>
        <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="getTableData">刷新</el-button>
      </el-col>
      <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange">>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="factoryName"  sortable label="工厂" align="center"></el-table-column>
        <el-table-column prop="officeName" sortable label="部门" align="center"></el-table-column>
        <el-table-column prop="hierarchyCode" sortable width="100" label="责任层级" align="center"></el-table-column>
        <el-table-column prop="resourceCode" sortable width="100" label="设备代码" align="center"></el-table-column>
        <el-table-column prop="resourceName" sortable width="100" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="lineCode" sortable label="线别" align="center"></el-table-column>
        <el-table-column prop="typeName" sortable width="120" label="设备类别名称" align="center"></el-table-column>
        <el-table-column prop="dictStatus" sortable width="100" label="设备状态" align="center"></el-table-column>
        <el-table-column prop="creator" sortable width="100" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createdDt" sortable width="95" label="创建时间" align="center" :formatter="dateFormatter"></el-table-column>
         <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteTable(scope.row.mMomResourceId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="1000px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getTableData="getTableData"></dialog-form>
  </el-dialog>
</div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      searchForm: {
        officeCode: '',
        resourceCode: '',
        queryLevel: 2
      },
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      isEdit: false,
      dialogVisible: false,
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑设备' : '新增设备'
    },
    deleteDisabled () {
      let len = this.selectList.length
      return len === 0
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
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mMomResourceId)
      })
    },
    async getTableData () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.findResourceList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    handletable (selctObj) {
      if (selctObj) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selctObj, keys)
          this.$refs.dialog.dialogForm.mMomResourceId = selctObj.mMomResourceId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (idList) {
      const selectList = idList ? [idList] : this.selectList
      if (selectList.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的设备信息吗？')
        // if (confirm) {
        //   let { selectList } = this
        //   if (idList) {
        //     selectList = [idList]
        //   }
        if (confirm) {
          let res = await this.$api.deleteResource(selectList)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning('请先选择要删除的设备信息')
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getTableData()
  },
  components: {
    dialogForm
  }
}
</script>
