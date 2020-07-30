<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('troubleReason_FaultCausMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="officeCode" style="width:35%" @change="getTpmFailReasonList"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('troubleReason_CauseFail')" v-model.trim="failReason" size="mini" style="width:40%;float:right;" @keydown.enter.native="getTpmFailReasonList">
          <i slot="suffix" class="el-input__icon" @click="getTpmFailReasonList"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getTpmFailReasonList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleFailReason('dialogForm','')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="importDialog=true">{{$t('common_Impor')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTpmFailReason('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getTpmFailReasonList">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 故障原因列表 -->
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange" @current-change="tableActiveRow">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName" sortable :label="$t('common_Factory')" align="center"></el-table-column>
        <el-table-column prop="typeName" sortable width="120" :label="$t('common_EquipCateName')" align="center"></el-table-column>
        <el-table-column prop="failCode" sortable :label="$t('troubleReason_FaultCode')" align="center"></el-table-column>
        <el-table-column prop="failReason" sortable :label="$t('troubleReason_CauseFail')" align="center"></el-table-column>
        <el-table-column prop="failDesc" sortable width="120" :label="$t('troubleReason_FailuCausDesc')" align="center"></el-table-column>
        <el-table-column prop="isPredefined" sortable :label="$t('troubleReason_Prede')" align="center">
            <template slot-scope="scope">
            <el-tag :type="scope.row.isPredefined?'':'danger'">{{ scope.row.isPredefined?this.$t('common_Yes'):this.$t('common_No') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" sortable :label="$t('common_Creator')" align="center"></el-table-column>
        <el-table-column prop="createdDt" sortable :label="$t('common_CreateTime')" align="center"></el-table-column>
        <el-table-column :label="$t('common_Operate')" width="120" align="center">
          <template slot-scope="scope">
            <handle-button iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')" @click="handleFailReason('dialogForm',scope.row)"></handle-button>
            <handle-button iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c' @click="deleteTpmFailReason(scope.row.mMomFailreasonId)"></handle-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 故障原因处理方法 -->
      <div class="mes-main-tabs" v-if="showTabs">
        <el-tabs  v-model="activeTabName">
          <el-row class="mes-table-handle">
            <el-col :span="24">
              <el-button size="mini" @click="handleFailReason('methodForm','')">{{$t('common_Add')}}</el-button>
              <span class="split-line">|</span>
              <el-button size="mini" @click="deleteFailReasonMethod('')">{{$t('common_Delete')}}</el-button>
            </el-col>
          </el-row>
          <el-tab-pane :label="$t('troubleReason_proceMeth')" name="info" class="mes-table-content">
            <el-table :data="methodList" border highlight-current-row size="mini" @selection-change="methodSelectionChange">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
              <el-table-column :label="$t('troubleReason_proceMeth')" prop="method"></el-table-column>
              <el-table-column :label="$t('common_Operate')" width="120" align="center">
                <template slot-scope="scope">
                  <handle-button iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')" @click="handleFailReason('methodForm',scope.row)"></handle-button>
                  <handle-button iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor="#f56c6c" @click="deleteFailReasonMethod(scope.row.mMomFailreasonMethodId)"></handle-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 新增/编辑故障原因表单 -->
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
        <component :is="dialogComponent" v-if="dialogVisible" ref="dialog" @cannel="dialogVisible = false" :isEdit="isEdit" :deviceTypeList="deviceTypeList" :mMomFailreasonId="mMomFailreasonId"
         :failCodeList="failCodeList" @getTpmFailReasonList="getTpmFailReasonList" @getFailReasonMethodList="getFailReasonMethodList"></component>
      </el-dialog>
        <!-- 导入故障原因弹框 -->
      <el-dialog :title="$t('troubleReason_selecFaulReasFileImpo')" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
        <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
          <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
          <i class="el-icon-upload" v-else></i>
          <p v-if="fileName">{{ fileName }}</p>
          <div class="el-upload__text" v-else>
            {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
            <em><a href="static/download/FailReason.xlsx" style="color:#3B6F9A;text-decoration:none;" :download="$t('troubleReason_FailuCausTemp')+'.xlsx'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
          </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importFailReason">{{$t('common_ok')}}</el-button>
          <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import methodForm from './methodForm'
export default {
  data () {
    return {
      queryLevel: 1,
      officeCode: '',
      failReason: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      selectList: [],
      deviceTypeList: [],
      failCodeList: [],
      isEdit: false,
      dialogVisible: false,
      importDialog: false,
      fileName: '',
      fileContent: '',
      activeTabName: 'info',
      mMomFailreasonId: '',
      methodList: [],
      methodSelectList: [],
      dialogComponent: ''
    }
  },
  computed: {
    dialogTitle () {
      const name = this.dialogComponent === 'dialogForm' ? this.$t('troubleReason_CauseFail') : this.$t('troubleReason_proceMeth')
      return this.isEdit ? this.$t('common_Edit') + name : this.$t('common_Add') + name
    },
    showTabs () {
      return this.mMomFailreasonId !== ''
    }
  },
  watch: {
    mMomFailreasonId (newValue) {
      if (newValue) {
        this.getFailReasonMethodList()
      }
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTpmFailReasonList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTpmFailReasonList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mMomFailreasonId)
      })
    },
    tableActiveRow (row) {
      this.mMomFailreasonId = row ? row.mMomFailreasonId : ''
    },
    // 获取设备类别
    async getDeviceClassList () {
      const params = {
        officeCode: '',
        queryLevel: 1,
        typeCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getDeviceClassList(params)
      const { code, data } = res
      if (code === '200') {
        this.deviceTypeList = data.list
      } else {
        this.deviceTypeList = []
      }
    },
    // 获取故障代码
    async getTpmFailCodeList () {
      const params = {
        officeCode: '',
        queryLevel: 1,
        failCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.findFailcodeList(params)
      const { code, data } = res
      if (code === '200') {
        this.failCodeList = data.list
      } else {
        this.failCodeList = []
      }
    },
    async getTpmFailReasonList () {
      const { officeCode, failReason, page, queryLevel } = this
      const params = Object.assign({ officeCode, queryLevel, failReason }, page)
      const res = await this.$api.getTpmFailReasonList(params)
      const { code, data } = res
      if (code === '200') {
        this.total = data.totalNum
        this.tableData = data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    handleFailReason (componentName, row) {
      this.dialogComponent = componentName
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        if (componentName === 'dialogForm') {
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.dialogForm)
            this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.dialogForm.mMomFailreasonId = row.mMomFailreasonId
          })
        } else if (componentName === 'methodForm') {
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.form)
            this.$refs.dialog.form = this.$global.filterForm(row, keys)
            this.$refs.dialog.form.mMomFailreasonMethodId = row.mMomFailreasonMethodId
          })
        }
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTpmFailReason (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('troubleReason_AreYouSureFaulCaus'))
        if (confirm) {
          const res = await this.$api.deleteTpmFailReason(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTpmFailReasonList()
          })
        }
      } else {
        this.$message.warning(this.$t('troubleReason_selecFaulReasDeleFirs'))
      }
    },
    // 导入文件
    // 上传文件 (并验证文件类型是否是excel)
    beforeUpload (file) {
      const fileName = file.name
      const fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        this.fileContent = file
      } else {
        this.$message.warning(this.$t('troubleReason_fileTypeExcel'))
      }
      return false
    },
    closeUploadDialog () {
      this.importDialog = false
      this.fileName = ''
      this.fileContent = ''
    },
    downloadTemplate (event) {
      event.stopPropagation()
    },
    async importFailReason () {
      const { fileContent } = this
      if (fileContent) {
        const data = new FormData()
        data.append('file', fileContent)
        const res = await this.$api.importTpmFailReason(data)
        this.$myPrompt.handleMsg(res, () => {
          this.closeUploadDialog()
          this.getTpmFailReasonList()
        })
      } else {
        this.$message.warning(this.$t('troubleReason_uploaDeliInspImpoFirs'))
      }
    },
    // 获取处理方法
    methodSelectionChange (selection) {
      this.methodSelectList = []
      selection.forEach(item => {
        this.methodSelectList.push(item.mMomFailreasonMethodId)
      })
    },
    async getFailReasonMethodList () {
      const { mMomFailreasonId } = this
      const res = await this.$api.getFailReasonMethodList({ mMomFailreasonId })
      const { code, data } = res
      if (code === '200') {
        this.methodList = data
      } else {
        this.methodList = []
      }
    },
    // 删除处理方法
    async deleteFailReasonMethod (id) {
      const ids = id ? [id] : this.methodSelectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('troubleReason_AreYouSureProcMeth'))
        if (confirm) {
          const res = await this.$api.deleteFailReasonMethod(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getFailReasonMethodList()
          })
        }
      } else {
        this.$message.warning(this.$t('troubleReason_selecProcMethDeleFirs'))
      }
    }
  },
  created () {
    this.getTpmFailCodeList()
    this.getDeviceClassList()
    this.getTpmFailReasonList()
  },
  components: { dialogForm, methodForm }
}
</script>
