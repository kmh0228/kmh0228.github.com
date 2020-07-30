<template>
   <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('dictionary_userManagement')}}</h3>
    <el-form label-position="left">
      <el-form-item >
        <el-input v-model="keywords" :placeholder="$t('Device_deviceCode')" size="mini" style="width:12vw;" @keydown.enter.native="getDevices">
          <i slot="suffix" class="el-input__icon" @click="getDevices"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getDevices">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus" @click="handleEqp('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteEpqs('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" @click="showPermissionInfo" :disabled="permissionBtn">{{$t('Device_Permission')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="getDevices">{{$t('common_Refresh')}}</el-button>

      </div>
      <mes-page ref="mesPage" :initData="getDevices" :total="total" />
    </div>
    <div class="mes-table">
      <el-table :data="eqpData" border size="mini" @selection-change="selectDevice">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="eqpCode" sortable width="100" :label="$t('Device_deviceCode')" align="center"></el-table-column>
        <el-table-column prop="eqpName" sortable  width="100" :label="$t('Device_deviceName')" align="center"></el-table-column>
        <el-table-column prop="lineName" sortable :label="$t('common_Line')" align="center"></el-table-column>
        <el-table-column prop="segName" sortable :label="$t('common_Process')" align="center"></el-table-column>
        <el-table-column prop="mComPersonEqpOwner" sortable  width="120" :label="$t('Device_Custodian')" align="center" ></el-table-column>
        <el-table-column prop="repairUser" sortable  width="120" :label="$t('Device_Inspector')" align="center" ></el-table-column>
        <el-table-column prop="eqpDesc" sortable :label="$t('common_Description')" align="center" ></el-table-column>
        <el-table-column prop="eqpMac" sortable  width="100" :label="$t('Device_MAC')" align="center" ></el-table-column>
        <el-table-column prop="eqpIp" sortable :label="$t('Device_IP')" align="center" ></el-table-column>
        <el-table-column prop="documentAuthority"  width="120" sortable :label="$t('Device_Document')" align="center" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.documentAuthority ? '':'danger'"> {{scope.row.documentAuthority ? $t('common_Yes') : $t('common_No')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_Operate')" fixed="right" align="center" width="160">
            <template slot-scope="scope">
              <handle-button @click="handleEqp(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteEpqs(scope.row.mComEqpId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="950px">
      <dialog-form ref="dialog" @cannel="dialogVisible=false" @getDevices="getDevices" :isEdit="isEdit" :processList="processList" :userList="userList"></dialog-form>
    </el-dialog>
    <el-dialog :title="$t('Device_DeviceDetails')" :visible.sync="dialogPermission" class="handle-dialog" width="600px">
      <el-form :model="infoForm" ref="infoForm" label-width="100px" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('common_Process')" class="el-col el-col-24">
          <el-checkbox-group  v-model="infoForm.segIds" :disabled="!isEditInfo">
            <el-checkbox v-for="(process,i) in processList" :label="process.mComProcessSegId" :key="i">{{process.segName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
          <el-button type="primary" size="mini" v-if="isEditInfo" @click="savePermissionInfo">{{$t('common_save')}}</el-button>
          <el-button type="primary" size="mini" v-else @click="isEditInfo=true">{{$t('common_Edit')}}</el-button>
          <el-button size="mini" @click="permissionCannel">{{$t('common_cancel')}}</el-button>
        </el-form-item>
      </el-form>
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
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      userList: [],
      processList: [],
      eqpData: [],
      dialogVisible: false,
      isEdit: false,
      selectList: [],
      dialogPermission: false,
      infoForm: {
        mComEqpId: '',
        segIds: []
      },
      isEditInfo: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('Device_Editing') : this.$t('Device_New')
    },
    permissionBtn () {
      return this.selectList.length !== 1
    },
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.$refs.mesPage.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取所有人员
    async getUserList () {
      const data = {
        keywords: '',
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.userList = res.data.list
      } else {
        this.userList = []
      }
    },
    // 获取所有制程
    async getProcessList () {
      const { segCode } = this
      let data = {
        segCode,
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAllProcessList(data)
      if (res.code === '200') {
        this.processList = res.data.list
      } else {
        this.processList = []
      }
    },
    selectDevice (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mComEqpId)
      })
    },
    async getDevices () {
      const { keywords, queryLevel } = this
      const { page } = this.$refs.mesPage
      const data = Object.assign({ keywords, queryLevel }, page)
      const res = await this.$api.getEqpList(data)
      if (res.code === '200') {
        this.eqpData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.eqpData = []
        this.total = 0
      }
    },
    handleEqp (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mComEqpId = row.mComEqpId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dialog.resetFields()
        })
      }
    },
    async deleteEpqs (id) {
      const { selectList } = this
      const ids = id ? [id] : selectList
      if (ids.length > 0) {
        const isConfirm = await this.$myPrompt.confirm(this.$t('Device_deleteDevice'))
        if (isConfirm) {
          const res = await this.$api.delEqps(ids)
          this.$myPrompt.handleMsg(res, this.getDevices)
        }
      } else {
        this.$message.warning(this.$t('Device_selectDevice'))
      }
    },
    async showPermissionInfo () {
      const { selectList } = this
      const mComEqpId = selectList[0]
      const res = await this.$api.getEqpPermissions({ mComEqpId })
      if (res.code === '200') {
        this.dialogPermission = true
        this.infoForm.mComEqpId = mComEqpId
        this.infoForm.segIds = res.data
      } else {
        this.infoForm.mComEqpId = ''
        this.$message.error(res.msg)
      }
    },
    permissionCannel () {
      this.dialogPermission = false
      this.isEditInfo = false
    },
    async savePermissionInfo () {
      const res = await this.$api.setEqpPermissions(this.infoForm)
      this.$myPrompt.handleMsg(res, () => {
        this.permissionCannel()
      })
    }
  },
  created () {
    this.getProcessList()
    this.getUserList()
  },
  mounted () {
    this.getDevices()
  },
  components: {
    dialogForm
  }
}
</script>
