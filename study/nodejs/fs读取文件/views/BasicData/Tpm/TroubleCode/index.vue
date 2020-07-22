<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">故障代码管理</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
    </el-col>
    <el-col :span="12">
      <el-input placeholder="请输入故障代码" v-model.trim="searchForm.failCode" size="mini" style="width:40%;float:right" @keydown.enter.native="getTableData">
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
        <el-table-column prop="officeName" sortable label="工厂" fixed align="center"></el-table-column>
        <el-table-column prop="malmTypeName" sortable width="120" label="报警类型名称" align="center"></el-table-column>
        <el-table-column prop="dictWorkKind" sortable label="工种" align="center"></el-table-column>
        <el-table-column prop="typeName" sortable width="120" label="设备类别名称" align="center"></el-table-column>
        <el-table-column prop="failCode" sortable width="100" label="故障代码" align="center"></el-table-column>
        <el-table-column prop="failName" sortable width="100" label="故障描述" align="center"></el-table-column>
        <el-table-column prop="standardTime" sortable width="100" label="标准工时" align="center"></el-table-column>
        <el-table-column prop="responseTimeoutLength" sortable width="100" label="响应时间" align="center"></el-table-column>
        <el-table-column prop="firstLevelTimeoutLength" sortable width="120" label="一级报警超时" align="center"></el-table-column>
        <el-table-column prop="secondLevelTimeoutLength" sortable width="120" label="二级报警超时" align="center"></el-table-column>
        <el-table-column prop="thirdLevelTimeoutLength" sortable width="120" label="三级报警超时" align="center"></el-table-column>
        <el-table-column prop="isTimeoutReport" sortable width="120" label="是否超时上报" align="center" :formatter="dataFormatter"></el-table-column>
        <el-table-column prop="dictAlarmLevel" sortable width="100" label="报警等级" align="center"></el-table-column>
        <el-table-column prop="creator" sortable width="100" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createdDt" sortable width="100" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteTable(scope.row.mMomFailcodeId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
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
        officeCode: '',
        failCode: '',
        queryLevel: 1
      },
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑故障代码' : '新增故障代码'
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
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mMomFailcodeId)
      })
    },
    dataFormatter (row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    },
    async getTableData () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.findFailcodeList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      }
    },
    handletable (selectObj) {
      if (selectObj) {
        this.isEdit = true
        this.dialogVisible = true
        let mMomFailcodeId = selectObj.mMomFailcodeId
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogForm.mMomFailcodeId = mMomFailcodeId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (mMomFailcodeId) {
      let { selectList } = this
      const ids = mMomFailcodeId ? [mMomFailcodeId] : selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的责任层级信息吗？')
        if (confirm) {
          if (mMomFailcodeId) {
            selectList = [mMomFailcodeId]
          }
          let res = await this.$api.deleteFailcode(selectList)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning('请选择需要删除的责任层级信息！')
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
