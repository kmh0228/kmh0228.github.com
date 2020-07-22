<template>
<div class="mes-main mes-work-order">
  <div class="mes-main-title">配置项管理</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
       <el-input placeholder="请输入配置项代码" v-model.trim="searchFrom.configureCode" clearable size="mini" style="width:40%" @keydown.enter.native="getTableData"></el-input>
    </el-col>
    <el-col :span="12">
       <el-input placeholder="请输入配置项名称" v-model.trim="searchFrom.configureName" clearable size="mini" style="width:40%;float:right" @keydown.enter.native="getTableData"></el-input>
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
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="configureCode" sortable label="配置项编码" align="center"></el-table-column>
        <el-table-column prop="configureName" sortable label="配置项名称" align="center"></el-table-column>
        <el-table-column prop="configureValue" sortable label="配置项值" align="center"></el-table-column>
        <el-table-column prop="remark" sortable label="备注" align="center"></el-table-column>
         <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteTable(scope.row.mComConfigureID)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px">
    <dialog-from  v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getTableData="getTableData"></dialog-from>
  </el-dialog>
</div>
</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      searchFrom: {
        configureCode: '',
        configureName: ''
      },
      isEdit: false,
      tableData: [],
      dialogVisible: false,
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑配置项' : '新增配置项'
    },
    editDisabeld () {
      let len = this.selectList.length
      return len !== 1
    },
    deleteDisabeld () {
      let len = this.selectList.length
      return len < 1
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (size) {
      this.page.pageSize = size
    },
    handleSizeChange (index) {
      this.page.pageIndex = index
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mComConfigureID)
      })
    },
    async getTableData () {
      let { searchFrom, page } = this
      let data = Object.assign(searchFrom, page)
      let res = await this.$api.getConfigure(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    handletable (selectObj) {
      if (selectObj !== '') {
        this.isEdit = true
        this.dialogVisible = true
        let mComConfigureID = selectObj.mComConfigureID
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogFrom)
          this.$refs.dialog.dialogFrom = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogFrom.mComConfigureID = mComConfigureID
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (mComConfigureID) {
      let { selectList } = this
      const ids = mComConfigureID ? [mComConfigureID] : selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的配置项吗？')
        if (confirm) {
          if (mComConfigureID !== '') {
            selectList = [mComConfigureID]
          }
          let res = await this.$api.deleteConfigure(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning('请选择需要删除的配置项！')
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
    dialogFrom
  }

}
</script>
