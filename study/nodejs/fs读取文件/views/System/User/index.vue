<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('dictionary_userManagement')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input v-model="keywords" :placeholder="$t('user_DGDH')" size="mini" style="width:12vw;" @keydown.enter.native="getUsers"></el-input>
      </el-col>
      <el-col :span="12">
        <el-select v-model="employeePost" size="mini" clearable :placeholder="$t('user_selectPost')" style="width:40%;float:right;" @change="getUsers">
          <el-option v-for="(item,i) in postList" :key="i" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <div class="mes-btn-group">
            <el-button size="mini" icon="el-icon-search" @click="getUsers">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-plus" @click="handleUser('')">{{$t('common_Add')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-delete-solid" @click="deleteUsers('')">{{$t('common_Delete')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="getUsers">{{$t('common_Refresh')}}</el-button>
          </div>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table :data="userData" border size="mini" @selection-change="selectUser">
        <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="department" sortable :label="$t('common_Department')" align="center"></el-table-column>
        <el-table-column prop="employeeCardId" sortable :label="$t('user_DGDH')" align="center"></el-table-column>
        <el-table-column prop="employeeName" sortable :label="$t('user_Name')" align="center"></el-table-column>
        <el-table-column prop="employeeSex" sortable :label="$t('user_Sex')" align="center">
          <template slot-scope="props">
            <p>{{ props.row.employeeSex === 2 ? $t('user_male') : $t('user_female') }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="employeePost" sortable :label="$t('user_Post')" align="center" ></el-table-column>
        <el-table-column prop="employeeEmail" sortable :label="$t('user_Mail')" align="center" ></el-table-column>
        <el-table-column prop="employeeJoinedDate" sortable :label="$t('user_Hiredate')" align="center" ></el-table-column>
        <el-table-column prop="employeeStatus" sortable :label="$t('user_JobStatus')" align="center" >
          <template slot-scope="props">
            <el-tag :type="props.row.employeeStatus === 0 ? '':'danger'"> {{props.row.employeeStatus === 0 ? $t('user_OnTheJob') :$t('user_quit')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lineName" :label="$t('common_Line')" sortable align="center" ></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handleUser(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteUsers(scope.row.mComEmployeeId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible=false" @getUsers="getUsers" :isEdit="isEdit" :lineList="lineList" :postList="postList" :deptList="deptList"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      keywords: '',
      queryLevel: 2,
      employeePost: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      userData: [],
      dialogVisible: false,
      isEdit: false,
      lineList: [],
      deptList: [],
      selectList: [],
      postList: [this.$t('user_production'), this.$t('user_Inspect'), this.$t('user_storage'), this.$t('user_equipment'), this.$t('user_Management')]
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('user_EditUser') : this.$t('user_AddUsers')
    }
  },
  methods: {
    // 获取所有线别
    async getAllLine () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      } else {
        this.lineList = []
      }
    },
    // 获取所有部门
    async getDepts () {
      const res = await this.$api.getDeptList()
      if (res.code === '200') {
        this.deptList = res.data
      } else {
        this.deptList = []
      }
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getLineList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getLineList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectUser (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mComEmployeeId)
      })
    },
    async getUsers () {
      const { keywords, employeePost, page, queryLevel } = this
      const data = Object.assign({ keywords, employeePost, queryLevel }, page)
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.userData = res.data.list
      } else {
        this.total = 0
        this.userData = []
      }
    },
    handleUser (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mComEmployeeId = row.mComEmployeeId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteUsers (id) {
      const { selectList } = this
      const ids = id ? [id] : selectList
      if (ids.length > 0) {
        const isConfirm = await this.$myPrompt.confirm(this.$t('user_deleteUser'))
        if (isConfirm) {
          const res = await this.$api.delEmployees(ids)
          this.$myPrompt.handleMsg(res, this.getUsers)
        }
      } else {
        this.$message.warning(this.$t('user_deleted'))
      }
    }
  },
  components: { dialogForm },
  created () {
    this.getAllLine()
    this.getDepts()
    this.getUsers()
  }
}
</script>
