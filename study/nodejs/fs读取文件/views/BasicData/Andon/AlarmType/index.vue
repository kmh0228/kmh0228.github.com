<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">报警类型管理</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
    </el-col>
    <el-col :span="12">
      <el-input placeholder="请输入报警类型代码" v-model.trim="searchForm.typeCode" size="mini" style="width:40%;float:right" clearable @keydown.enter.native="getTableData">
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
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" fixed="left" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName" sortable label="工厂" align="center"></el-table-column>
        <el-table-column prop="typeCode" sortable width="120" label="报警类型代码" align="center"></el-table-column>
        <el-table-column prop="typeName" sortable width="120" label="报警类型名称" align="center"></el-table-column>
        <el-table-column prop="remark" sortable label="备注" align="center"></el-table-column>
        <el-table-column prop="responseTimeoutGroup" sortable width="145" label="响应超时上报群组" align="center"></el-table-column>
        <el-table-column prop="firstLevelTimeoutGroup" sortable width="145" label="一级超时上报群组" align="center"></el-table-column>
        <el-table-column prop="secondLevelTimeoutGroup" sortable width="145" label="二级超时上报群组" align="center"></el-table-column>
        <el-table-column prop="thirdLevelTimeoutGroup" sortable width="145" label="三级超时上报群组" align="center"></el-table-column>
        <el-table-column prop="creator" sortable width="90" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createdDt" sortable width="100" label="创建时间" align="center" :formatter="dateFormatter"></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteTable(scope.row.mAlmTypeId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="1000px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getTableData="getTableData" ></dialog-form>
  </el-dialog>
</div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      isEdit: false,
      tableData: [],
      dialogVisible: false,
      searchForm: {
        queryLevel: 1,
        officeCode: '',
        typeCode: ''
      },
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑报警类型' : '新增报警类型'
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
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mAlmTypeId)
      })
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    async getTableData () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getAlarmType(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    handletable (selectObj) {
      if (selectObj) {
        this.isEdit = true
        this.dialogVisible = true
        let mAlmTypeId = selectObj.mAlmTypeId
        this.$nextTick(() => {
          this.$refs.dialog.getAlarmGroup(selectObj.officeCode)
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogForm.mAlmTypeId = mAlmTypeId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (mAlmTypeId) {
      let { selectList } = this
      let ids = mAlmTypeId ? [mAlmTypeId] : selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的报警类型信息吗？')
        if (confirm) {
          let res = await this.$api.deleteAlarmType(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning('请选择要删除的报警类型信息')
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getTableData()
  }
}
</script>
