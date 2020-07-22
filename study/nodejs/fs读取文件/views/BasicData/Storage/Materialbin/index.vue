<template>
<div class="mes-main mes-work-order">
  <h3 class="mes-main-title">料号储位关系管理</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input placeholder="请输入料号" v-model.trim="keywords" size="mini" style="width:35%" @keydown.enter.native="getMaterialBin">
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getMaterialBin">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleMateriaBin('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMateria('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
        layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="materialNo" sortable label="料号" align="center"></el-table-column>
        <el-table-column prop="materialName" sortable label="名称" align="center"></el-table-column>
        <el-table-column prop="version" sortable label="版次" align="center"></el-table-column>
        <el-table-column prop="mWmsWarehouseCode" sortable label="库房" align="center"></el-table-column>
        <el-table-column prop="mWmsWarehouseBinCode" sortable label="储位" align="center"></el-table-column>
        <el-table-column prop="materialType" sortable label="物料类型" align="center"></el-table-column>
        <el-table-column prop="materialDesc" sortable label="描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <handle-button @click="handleMateriaBin(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteMateria(scope.row.mWmsMaterialbinId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" :select-obj="selectObj" @cannel="cannel" :isEdit="isEdit" @getMaterialBin="getMaterialBin"></dialog-form>
    </el-dialog>
  </div>
</div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      keywords: '',
      mWmsMaterialbinId: '',
      tableData: [],
      selectList: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      dialogVisible: false,
      isEdit: false,
      selectObj: {}
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑料号储位关系' : '新建料号储位关系'
    },
    etidtable () {
      let { selectList } = this
      return selectList.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getMaterialBin()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getMaterialBin()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleMateriaBin (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.selectObj = row
      } else {
        this.isEdit = false
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(selct => {
        this.selectList.push(selct.mWmsMaterialbinId)
      })
    },
    cannel () {
      this.dialogVisible = false
    },
    async getMaterialBin () {
      let { keywords, page } = this
      let data = Object.assign({ keywords }, page)
      let res = await this.$api.getMaterialBin(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keywords = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getMaterialBin()
    },
    async deleteMateria (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的料号储位关系信息吗?')
        if (confirmRes) {
          let res = await this.$api.deleteMaterialBin(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getMaterialBin()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择要删除的客户信息')
      }
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getMaterialBin()
  }

}
</script>
