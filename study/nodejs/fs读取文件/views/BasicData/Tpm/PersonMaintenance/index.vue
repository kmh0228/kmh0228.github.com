<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('personMainten_LevelCorrPersMain')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="officeCode" style="width:40%" dataType="1"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('personMainten_RespoLeveName')" v-model.trim="hierarchyName" size="mini" style="width:40%;float:right;" @keydown.native.enter="getHierarchyUserList" clearable>
          <i slot="suffix" class="el-input__icon" @click="getHierarchyUserList"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getHierarchyUserList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleHierarchyUser('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteHierarchyUser('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getHierarchyUserList">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 层级对应人员维护列表 -->
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="officeName" sortable :label="$t('common_Factory')" align="center"></el-table-column>
          <el-table-column prop="hierarchyName" sortable :label="$t('personMainten_RespoLeveName')" align="center"></el-table-column>
          <el-table-column prop="workKind" sortable :label="$t('common_TypeWork')" align="center"></el-table-column>
          <el-table-column prop="workNo" sortable :label="$t('personMainten_JobNumb')" align="center"></el-table-column>
          <el-table-column prop="username" sortable :label="$t('common_fullName')" align="center"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('common_Creator')" align="center"></el-table-column>
          <el-table-column prop="createTime" sortable :label="$t('common_CreateTime')" align="center"></el-table-column>
          <el-table-column :label="$t('common_Operate')" width="120" align="center">
            <template slot-scope="scope">
              <handle-button iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')" @click="handleHierarchyUser(scope.row)"></handle-button>
              <handle-button iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c' @click="deleteHierarchyUser(scope.row.hierarchyUserId)"></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增/编辑设备类别表单 -->
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
        <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible = false" :isEdit="isEdit"   :hierarchyList="hierarchyList" @getHierarchyUserList="getHierarchyUserList"></dialog-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import dialogForm from './dialogForm'
export default {
  data () {
    return {
      queryLevel: 1,
      officeCode: '',
      hierarchyName: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      selectList: [],
      hierarchyList: [],
      isEdit: false,
      dialogVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('personMainten_CorrePersEditLeve') : this.$t('personMainten_NewLeveCorrPers')
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getHierarchyUserList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getHierarchyUserList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取责任层级代码
    async getHierarchyList () {
      const params = {
        hierarchyCode: '',
        officeCode: '',
        queryLevel: 1,
        pageIndex: 1,
        pageSize: 100
      }
      const res = await this.$api.findHierarchyList(params)
      if (res.code === '200') {
        this.hierarchyList = res.data.list
      } else {
        this.hierarchyList = []
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push()
      })
    },
    async getHierarchyUserList () {
      const { officeCode, hierarchyName, page, queryLevel } = this
      const params = Object.assign(page, { officeCode, hierarchyName, queryLevel })
      const res = await this.$api.getHierarchyUserList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    handleHierarchyUser (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.hierarchyUserId = row.hierarchyUserId
          this.$refs.dialog.dialogForm.workKind = row.workKindId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteHierarchyUser (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('personMainten_AreYouSureCorrPers'))
        if (confirm) {
          const res = await this.$api.deleteHierarchyUser(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getHierarchyUserList()
          })
        }
      } else {
        this.$message.warning(this.$t('personMainten_selecLeveCorrDeleFirs'))
      }
    }
  },
  created () {
    this.getHierarchyList()
    this.getHierarchyUserList()
  },
  components: { dialogForm }
}
</script>
