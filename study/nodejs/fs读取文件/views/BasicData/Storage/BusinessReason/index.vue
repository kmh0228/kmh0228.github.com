<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('busnessRea_BusinReas')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="18">
        <el-input :placeholder="$t('common_code')" v-model.trim="code" size="mini" style="width:30%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input :placeholder="$t('common_Name')" v-model.trim="name" size="mini" style="width:30%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-select size="mini" :placeholder="$t('common_type')" v-model="reasonType" clearable  style="width:30%" @change="$refs.tableList.queryList(true)">
            <el-option :label="$t('busnessRea_CostCent')" value="0"></el-option>
            <el-option :label="$t('busnessRea_ReasoForRetu')" value="1"></el-option>
            <el-option :label="$t('busnessRea_MaterRetuReas')" value="2"></el-option>
          </el-select>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getTransactionReason" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mWmsTransactionReasonId))">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          <el-button size="mini" icon="el-icon-set-up" @click="changeTransactionReason($refs.tableList.getSelectData().map(item => item.mWmsTransactionReasonId))">{{$t('common_Enabl')}}/{{$t('common_Disab')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="importVisible = true">{{$t('common_Impor')}}</el-button>
        </div>
      </table-list>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="addForm.mWmsTransactionReasonId ? $t('busnessRea_EditTranReas') : $t('busnessRea_NewTranReas') "
      :visible.sync="addVisible"
      width="600px">
      <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="80px" label-position="left">
        <el-form-item :label="$t('common_code')"  prop="code" class="el-col el-col-11 ">
          <el-input size="mini"  v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Name')"  prop="name" class="el-col el-col-11 el-col-offset-1">
          <el-input size="mini" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_type')"  prop="reasonType"  class="el-col el-col-11 ">
           <el-select size="mini" clearable  v-model="addForm.reasonType" style="width:100%">
            <el-option :label="$t('busnessRea_CostCent')" value="0"></el-option>
            <el-option :label="$t('busnessRea_ReasoForRetu')" value="1"></el-option>
            <el-option :label="$t('busnessRea_MaterRetuReas')" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('busnessRea_MovinDire')"  prop="moveDirection" class="el-col el-col-11 el-col-offset-1">
          <el-select size="mini" clearable  v-model="addForm.moveDirection" style="width:100%">
            <el-option :label="$t('busnessRea_Wareh')" value="1"></el-option>
            <el-option :label="$t('busnessRea_WarehOut')" value="2"></el-option>
            <el-option :label="$t('common_move')" value="3"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label="$t('common_Description')"  prop="description" class="el-col el-col-23">
          <el-input type="textarea" :rows="2" size="mini" v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">{{$t('common_cancel')}}</el-button>
        <el-button type="primary" @click="updateTransactionReason" :loading="saveLoading">{{$t('common_ok')}}</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog
      :title="$t('common_Impor')"
      :visible.sync="importVisible"
      width="600px">
      <el-form class="el-row" label-width="100px" label-position="left">
        <el-form-item :label="$t('busnessRea_ImporTemp')">
          <upload-file ref="uploadFile" :limit="1" :defaultFileArr="[]"></upload-file>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">{{$t('common_cancel')}}</el-button>
        <el-button type="primary" @click="importMeasurementInstrumentExcel" :loading="importLoading">{{$t('common_ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import uploadFile from '@/components/Module/uploadFile'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      code: '',
      name: '',
      reasonType: '',
      addVisible: false,
      importVisible: false,
      saveLoading: false,
      importLoading: false,
      total: 0,
      option: tableOption(this),
      tableData: [],
      addForm: {
        mWmsTransactionReasonId: '',
        code: '',
        name: '',
        description: '',
        reasonType: '',
        moveDirection: '',
        isInvalid: '1'
      }
    }
  },
  computed: {
    rules () {
      return {
        code: [{ required: true, message: this.$t('busnessRea_CodeCannBeEmpt') }],
        name: [{ required: true, message: this.$t('busnessRea_TheNameCannBeEm') }],
        description: [{ required: true, message: this.$t('busnessRea_DescrCannBeEmpt') }],
        reasonType: [{ required: true, message: this.$t('busnessRea_TypeCannBeEmpt') }]
      }
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.code = ''
      this.name = ''
      this.reasonType = ''
      this.$refs.tableList.queryList(true)
    },
    showPop () {
      this.addForm = {
        mWmsTransactionReasonId: '',
        code: '',
        name: '',
        description: '',
        reasonType: '',
        moveDirection: '',
        isInvalid: '1'
      }
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.addVisible = true
    },
    async getTransactionReason (page) {
      let res = await this.$api.getTransactionReason({ ...page, code: this.code, name: this.name, reasonType: this.reasonType })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async updateTransactionReason () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let obj = {
            ...this.addForm
          }
          this.saveLoading = true
          let res = obj.mWmsTransactionReasonId ? await this.$api.updateTransactionReason(obj) : await this.$api.insertTransactionReason(obj)
          if (res.code === '200') {
            this.addVisible = false
            this.saveLoading = false
            this.$message.success(this.$t('common_SavedSuccessfully'))
            this.$refs.tableList.queryList(true)
          }
        }
      })
    },
    async deletetableData (ids) {
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm(this.$t('busnessRea_AreYouSureDeleC'))
        if (confirmRes) {
          const res = await this.$api.deleteTransactionReason(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning(this.$t('busnessRea_PleasSeleDocuCa'))
      }
    },
    async changeTransactionReason (ids = []) {
      if (ids.length > 0) {
        const res = await this.$api.changeTransactionReason(ids)
        if (res.code === '200') {
          this.$message.success(this.$t('busnessRea_ModifSucc'))
          this.$refs.tableList.queryList()
        }
      } else {
        this.$message.warning(this.$t('busnessRea_PleasSeleTranRe'))
      }
    },
    async importMeasurementInstrumentExcel () {
      let files = this.$refs.uploadFile.getFileData()
      if (!files.length) {
        this.$message.warning(this.$t('busnessRea_PleasSeleImpoTe'))
        return false
      }
      let formData = new FormData()
      formData.append('file', files[0].raw)
      this.importLoading = true
      let res = await this.$api.importMeasurementInstrumentExcel(formData)
      if (res.code === '200') {
        this.$message.success(this.$t('busnessRea_ImporSucc'))
        this.$refs.tableList.queryList(true)
        this.importVisible = false
        this.importLoading = false
      }
    }
  },
  components: {
    TableList, uploadFile
  },
  created () {
  }
}
</script>
