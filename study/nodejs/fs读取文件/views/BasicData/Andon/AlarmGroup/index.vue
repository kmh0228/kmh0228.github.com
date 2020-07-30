<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('alarmGroup_groupMana')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-input :placeholder="$t('alarmGroup_AlarmGrouCode')" v-model.trim="searchForm.groupCode" size="mini" style="width:40%;float:right">
          <i slot="suffix" class="el-input__icon"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getAndonGroupList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDialog('dialogForm','')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteAndonGroup('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getAndonGroupList">{{$t('common_Refresh')}}</el-button>
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
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="factoryName" sortable  :label="$t('common_Factory')" align="center"></el-table-column>
        <el-table-column prop="officeCode" sortable width="120" :label="$t('alarmGroup_DeparCode')" align="center"></el-table-column>
        <el-table-column prop="officeName" sortable width="120" :label="$t('alarmGroup_DeparName')" align="center"></el-table-column>
        <el-table-column sortable :label="$t('alarmGroup_GroupCode')" prop="groupCode" align="center"></el-table-column>
        <el-table-column sortable :label="$t('alarmGroup_groupName')" prop="groupName" align="center"></el-table-column>
        <el-table-column sortable :label="$t('common_remarks')" prop="remark" align="center"></el-table-column>
        <el-table-column sortable :label="$t('common_Creator')" prop="creator" align="center"></el-table-column>
        <el-table-column sortable :label="$t('common_CreateTime')" prop="createdDt" align="center"></el-table-column>
        <el-table-column sortable :label="$t('common_Operate')" width="120" align="center">
          <template slot-scope="scope">
            <handle-button iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')" @click="handleDialog('dialogForm',scope.row)"></handle-button>
            <handle-button iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor="#f56c6c" @click="deleteAndonGroup(scope.row.mAlmGroupId)"></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 报警群组人员列表 -->
    <div class="mes-main-tabs mes-table" v-if="showTabs">
      <el-tabs  v-model="activeTabName">
        <el-row class="mes-table-handle">
          <el-col :span="24">
            <el-button size="mini" @click="handleDialog('userForm','')">{{$t('common_Add')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini"  @click="deleteAndonGroupUser('')">{{$t('common_Delete')}}</el-button>
          </el-col>
        </el-row>
        <el-tab-pane :label="$t('alarmGroup_GroupMemb')" name="info" class="mes-table-content">
          <el-table :data="groupUserList" border highlight-current-row size="mini" @selection-change="userSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
            <el-table-column :label="$t('alarmGroup_JobNumb')" prop="workNo"></el-table-column>
            <el-table-column :label="$t('common_fullName')" prop="uName"></el-table-column>
            <el-table-column :label="$t('common_Operate')" width="120" align="center">
              <template slot-scope="scope">
                <handle-button iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')" @click="handleDialog('userForm',scope.row)"></handle-button>
                <handle-button iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor="#f56c6c" @click="deleteAndonGroupUser(scope.row.mAlmGroupUserId)"></handle-button>
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
      return this.isEdit ? this.$t('alarmGroup_EditAlarType') : this.$t('alarmGroup_NewAlarType')
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
        const confirm = await this.$myPrompt.confirm(this.$t('alarmGroup_AreYouSureAlarGrou'))
        if (confirm) {
          const res = await this.$api.deleteAndonGroup(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getAndonGroupList()
          })
        }
      } else {
        this.$message.warning(this.$t('alarmGroup_selecAlarGrouDeleFirs'))
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
        const confirm = await this.$myPrompt.confirm(this.$t('alarmGroup_AreYouSureGrouMemb'))
        if (confirm) {
          const res = await this.$api.deleteAndonGroupUser(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getAndonGroupUserList()
          })
        }
      } else {
        this.$message.warning(this.$t('alarmGroup_selecGrouMembDeleFirs'))
      }
    }
  },
  created () {
    this.getAndonGroupList()
  },
  components: { dialogForm, userForm }
}
</script>
