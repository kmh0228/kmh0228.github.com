<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">群组管理</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-input placeholder="报警群组代码" v-model.trim="searchForm.groupCode" size="mini" style="width:40%;float:right">
          <i slot="suffix" class="el-input__icon"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getAndonGroupList">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDialog('dialogForm','')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteAndonGroup('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getAndonGroupList">刷新</el-button>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange" @current-change="tableActiveRow">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="factoryName" sortable  label="工厂" align="center"></el-table-column>
        <el-table-column prop="officeCode" sortable width="120" label="部门代码" align="center"></el-table-column>
        <el-table-column prop="officeName" sortable width="120" label="部门名称" align="center"></el-table-column>
        <el-table-column sortable label="群组代码" prop="groupCode" align="center"></el-table-column>
        <el-table-column sortable label="群组名称" prop="groupName" align="center"></el-table-column>
        <el-table-column sortable label="备注" prop="remark" align="center"></el-table-column>
        <el-table-column sortable label="创建人" prop="creator" align="center"></el-table-column>
        <el-table-column sortable label="创建时间" prop="createdDt" align="center"></el-table-column>
        <el-table-column sortable label="操作" width="120" align="center">
          <template slot-scope="scope">
            <handle-button iconClass='el-icon-edit-outline' tipText="编辑" @click="handleDialog('dialogForm',scope.row)"></handle-button>
            <handle-button iconClass='el-icon-delete' tipText="删除" iconColor="#f56c6c" @click="deleteAndonGroup(scope.row.mAlmGroupId)"></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 报警群组人员列表 -->
    <div class="mes-main-tabs mes-table" v-if="showTabs">
      <el-tabs  v-model="activeTabName">
        <el-row class="mes-table-handle">
          <el-col :span="24">
            <el-button size="mini" @click="handleDialog('userForm','')">新增</el-button>
            <span class="split-line">|</span>
            <el-button size="mini"  @click="deleteAndonGroupUser('')">批量删除</el-button>
          </el-col>
        </el-row>
        <el-tab-pane label="群组人员" name="info" class="mes-table-content">
          <el-table :data="groupUserList" border highlight-current-row size="mini" @selection-change="userSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="工号" prop="workNo"></el-table-column>
            <el-table-column label="姓名" prop="uName"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <handle-button iconClass='el-icon-edit-outline' tipText="编辑" @click="handleDialog('userForm',scope.row)"></handle-button>
                <handle-button iconClass='el-icon-delete' tipText="删除" iconColor="#f56c6c" @click="deleteAndonGroupUser(scope.row.mAlmGroupUserId)"></handle-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增、编辑群组/群组人员弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="600px" class="handle-dialog">
      <component :is="dialogComponent" v-if="dialogVisible" ref="dialog" :isEdit="isEdit" @cannel="dialogVisible = false"  :mAlmGroupId="mAlmGroupId"
      @getAndonGroupList="getAndonGroupList" @getAndonGroupUserList="getAndonGroupUserList"></component>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import userForm from './userForm'
export default {
  data () {
    return {
      searchForm: {
        queryLevel: 1,
        officeCode: '',
        groupCode: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      mAlmGroupId: null,
      total: 0,
      tableData: [],
      selectList: [],
      isEdit: false,
      dialogVisible: false,
      dialogComponent: null,
      activeTabName: 'info',
      groupUserList: [],
      groupSelectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑报警类型' : '新增报警类型'
    },
    showTabs () {
      return this.mAlmGroupId !== '' && this.mAlmGroupId
    }
  },
  watch: {
    mAlmGroupId () {
      this.getAndonGroupUserList()
    }
  },
  methods: {
    handleDialog (componentName, row) {
      this.dialogComponent = componentName
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          if (componentName === 'dialogForm') {
            this.$refs.dialog.dialogForm.mAlmGroupId = row.mAlmGroupId
          } else if (componentName === 'userForm') {
            this.$refs.dialog.dialogForm.mAlmGroupUserId = row.mAlmGroupUserId
          }
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getAndonGroupList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getAndonGroupList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mAlmGroupId)
      })
    },
    tableActiveRow (row) {
      if (row) {
        this.mAlmGroupId = row.mAlmGroupId
      }
    },
    async getAndonGroupList () {
      const { searchForm, page } = this
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getAndonGroupList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async deleteAndonGroup (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的报警群组吗？')
        if (confirm) {
          const res = await this.$api.deleteAndonGroup(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getAndonGroupList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的报警群组！')
      }
    },
    async getAndonGroupUserList () {
      const id = this.mAlmGroupId
      const res = await this.$api.getAndonGroupUserList({ id })
      const { code, data } = res
      if (code === '200') {
        this.groupUserList = data
      } else {
        this.groupUserList = []
      }
    },
    userSelectionChange (selection) {
      this.groupSelectList = []
      selection.forEach(item => {
        this.groupSelectList.push(item.mAlmGroupUserId)
      })
    },
    async deleteAndonGroupUser (id) {
      const ids = id ? [id] : this.groupSelectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的群组人员吗？')
        if (confirm) {
          const res = await this.$api.deleteAndonGroupUser(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getAndonGroupUserList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的群组人员！')
      }
    }
  },
  created () {
    this.getAndonGroupList()
  },
  components: { dialogForm, userForm }
}
</script>
