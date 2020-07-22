<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">文档类型管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:40%" placeholder="请输入文档类型" v-model="docType" @keydown.native.enter="getTableData" clearable></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button  size="mini" icon="el-icon-search" @click="getTableData">查询</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-plus" @click="handleTable('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-delete-solid" @click="deleteTable('')">批量删除</el-button>
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
        <el-table :data="tableData"  border size="mini" @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" align="center" label="序号" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="docType" sortable label="文档类型" align="center"></el-table-column>
          <el-table-column prop="typeDesc" sortable label="描述" align="center" ></el-table-column>
          <el-table-column prop="suffix" sortable label="文档后缀" align="center" ></el-table-column>
          <el-table-column prop="mSeqId" sortable label="文档编号规则" align="center" ></el-table-column>
          <el-table-column prop="browseTool" sortable label="浏览工具" align="center" ></el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleTable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteTable(scope.row.mComDoctypeId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px" :close-on-click-modal="false">
      <dialog-from v-if="dialogVisible" @cancel="cancel" ref="dialog" :isEdit="isEdit" @getTableData="getTableData"></dialog-from>
    </el-dialog>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      isEdit: false,
      docType: '',
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑文档类型' : '新增文档类型'
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
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mComDoctypeId)
      })
    },
    async getTableData () {
      let { docType, page } = this
      let data = Object.assign(page, { docType })
      let res = await this.$api.getEsopDocType(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    handleTable (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mComDoctypeId = row.mComDoctypeId
          this.$refs.dialog.dialogForm.suffix = ''
          let arr = row.suffix.split(';')
          this.$refs.dialog.suffixList = arr
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除选中的信息吗?')
        if (confirm) {
          let res = await this.$api.deleteById(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning('请选择要删除的信息?')
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.docType = ''
      this.getTableData()
    },
    cancel () {
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
