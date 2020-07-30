<template>
  <div>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-button size="mini" icon="el-icon-plus" @click="showPop">{{$t('warehouse_choic')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteWarehouseUser()">{{$t('common_Del')}}</el-button>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange" >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index"  width="80" :label="$t('common_Number')" align="center" :index="indexMethod" sortable></el-table-column>
          <el-table-column prop="userCode" :label="$t('warehouse_UserCode')"  align="center" sortable></el-table-column>
          <el-table-column prop="userName" :label="$t('warehouse_UserName')" align="center" sortable></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="$t('warehouse_AssocUser')" :visible.sync="usersVisible" width="400px" class="handle-dialog" >
      <el-form :model="adssociatedUsersForm" ref="adssociatedUsersForm" label-width="70px" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('warehouse_user')" prop="userIds" class="el-col el-col-24">
          <el-select
            v-model="adssociatedUsersForm.userIds"
            multiple
            collapse-tags
            :placeholder="$t('common_PleasSele')">
            <el-option
              v-for="item in personList"
              :key="item.userCode"
              :label="item.userName"
              :value="item.userCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
          <el-button type="primary" size="mini" @click="saveUser">{{$t('common_save')}}</el-button>
          <el-button size="mini" @click="usersVisible = false">{{$t('common_cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      adssociatedUsersForm: {
        userIds: []
      },
      indexMethod: 1,
      usersVisible: false,
      tableData: [],
      personList: [],
      selectList: []
    }
  },
  props: {
    mWmsWarehouseId: {
      type: String,
      default: ''
    }
  },
  watch: {
    mWmsWarehouseId (n) {
      // 根据仓库id获取关联用户列表
      this.getWarehouseUser()
    }
  },
  methods: {
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(select => {
        this.selectList.push(select.warehouseUserId)
      })
    },
    showPop () {
      this.adssociatedUsersForm.userIds = this.tableData.map(item => item.userCode)
      this.usersVisible = true
    },
    async saveUser () {
      if (!this.adssociatedUsersForm.userIds.length) {
        this.$message.error(this.$t('warehouse_PleasSeleAssoUs'))
        return false
      }
      let data = this.adssociatedUsersForm.userIds.map(item => {
        return {
          userCode: item,
          warehouseId: this.mWmsWarehouseId
        }
      })
      const res = await this.$api.saveWarehouseUser(data)
      if (res.code === '200') {
        this.$message.success(res.msg)
        this.usersVisible = false
        this.getWarehouseUser()
      } else {
        this.tableData = []
        this.$message.error(res.msg)
      }
    },
    async deleteWarehouseUser () {
      if (this.selectList.length > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('warehouse_deleteCurAssUser'))
        if (confirmRes) {
          const res = await this.$api.deleteWarehouseUser(this.selectList)
          if (res.code === '200') {
            this.$message.success(res.msg)
            this.getWarehouseUser()
          } else {
            this.$message.error(res.msg)
          }
        }
      } else {
        this.$message.warning(this.$t('warehouse_PleasSeleDelUs'))
      }
    },
    async getPersonList () {
      const res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.personList = res.data
      } else {
        this.personList = []
      }
    },
    async getWarehouseUser () {
      const res = await this.$api.getWarehouseUser({ warehouseId: this.mWmsWarehouseId })
      if (res.code === '200') {
        this.tableData = res.data
      } else {
        this.tableData = []
      }
    }
  },
  created () {
    if (this.mWmsWarehouseId) {
      this.getWarehouseUser()
    }
    this.getPersonList()
  }
}
</script>
