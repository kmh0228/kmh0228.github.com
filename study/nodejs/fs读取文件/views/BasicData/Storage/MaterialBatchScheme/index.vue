<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('materialBathS_MaterBatcSche')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('common_code')" v-model.trim="code" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input :placeholder="$t('common_Name')" v-model.trim="name" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getBatchProgramList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mwmsMaterialBatchProgramId))">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          <el-button size="mini" :loading="changeStatusLoading" @click="changeStautsBatchProgram" >{{$t('common_Enabl')}}/{{$t('common_Disab')}}</el-button>
        </div>
      </table-list>
    </div>
    <div class="mes-main-tabs" v-show="showTabs" style="margin-top:10px">
        <el-tabs v-model="tabAciveName">
        <el-tab-pane :label="$t('materialBathS_BatchProp')" name="batch">
          <el-button size="mini" icon="el-icon-edit" v-if="batchIsRead"  @click="batchIsRead = false">{{$t('common_Edit')}}</el-button>
          <el-button size="mini" icon="el-icon-edit"  v-else @click="updateBeleteBatchProgramDetail" :loading="detailLoading">{{$t('common_save')}}</el-button>
          <batch-table style="margin-top:10px" ref="detaliTable" :batchData="batchData" :isRead="batchIsRead"></batch-table>
        </el-tab-pane>
        </el-tabs>
      </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="addForm.id ? $t('materialBathS_EditMateBatcSch') : $t('materialBathS_NewMateBatcSche') "
      :visible.sync="addVisible"
      width="1100px">
      <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="70px" label-position="left">
        <el-form-item :label="$t('common_code')"  prop="code" class="el-col el-col-5 ">
          <el-input  v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Name')"  prop="name" class="el-col el-col-5 el-col-offset-1">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('materialBathS_BatchNumbRule')"  prop="batchCodeType" label-width="120px" class="el-col el-col-7 el-col-offset-1">
          <el-select  v-model="addForm.batchCodeType" filterable clearable style="width:100%">
            <el-option :label="item.seqNoFormat" :value="item.mSeqId" :key="i" v-for="(item, i) in codingLsit">
              <div style="display: flex;">
                <span style="display: inline-block;width:25%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ item.mSeqName }}</span>
                <span style="display: inline-block;width:45%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ item.seqNoFormat }}</span>
                <span style="display: inline-block;width:30%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color: #8492a6;">{{ item.description }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('materialBathS_IsItEffe')"  prop="isInvalid" label-width="100px" class="el-col el-col-3 el-col-offset-1">
           <el-checkbox  v-model="addForm.isInvalid"></el-checkbox>
        </el-form-item>
      </el-form>
      <el-tabs v-model="tabAciveName" v-if="popType === 'add'">
        <el-tab-pane :label="$t('materialBathS_BatchProp')" name="batch">
          <batch-table ref="batchTable" :batchData="popType === 'add' ? popBatchData : batchData" :isRead="popType !== 'add'"></batch-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">{{$t('common_cancel')}}</el-button>
        <el-button type="primary" @click="saveBatch" :loading="saveLoading">{{$t('common_ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import BatchTable from './batchTable'
import { tableOption, popBatchData } from './tableOption'
export default {
  data () {
    return {
      code: '',
      name: '',
      addVisible: false,
      saveLoading: false,
      detailLoading: false,
      changeStatusLoading: false,
      batchIsRead: true,
      showTabs: false,
      tabAciveName: 'batch',
      popType: 'add',
      codingLsit: [],
      popBatchData: popBatchData,
      batchData: [],
      total: 0,
      option: tableOption(this),
      tableData: [],
      addForm: {
        mwmsMaterialBatchProgramId: '',
        code: '',
        name: '',
        batchCodeType: '',
        isInvalid: true
      }
    }
  },
  computed: {
    rules () {
      return {
        code: [{ required: true, message: this.$t('materialBathS_CodeCannBeEmpt') }],
        name: [{ required: true, message: this.$t('materialBathS_TheNameCannBeEm') }],
        batchCodeType: [{ required: true, message: this.$t('materialBathS_PleasSeleBatcNu') }]
      }
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.code = ''
      this.name = ''
      this.$refs.tableList.queryList(true)
    },
    showPop () {
      this.addForm = {
        code: '',
        name: '',
        batchCodeType: '',
        isInvalId: true
      }
      this.popType = 'add'
      this.addVisible = true
    },
    async getBatchProgramList (page) {
      let res = await this.$api.getBatchProgramList({ ...page, code: this.code, name: this.name })
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async saveBatch () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let obj = {
            ...this.addForm
          }
          if (this.popType === 'add') {
            obj.items = this.$refs.batchTable.getBatchData()
          }
          let res = this.popType === 'add' ? await this.$api.insertBatchProgram(obj) : await this.$api.updateBatchProgram(obj)
          if (res.code === '200') {
            this.addVisible = false
            this.$message.success(this.$t('common_SavedSuccessfully'))
            this.$refs.tableList.queryList()
          }
        }
      })
    },
    async getCodingRules () {
      let res = await this.$api.getCodingRules({ mSeqName: '', queryLevel: 1, pageIndex: 1, pageSize: 1000 })
      let { list } = res.data
      this.codingLsit = list
    },
    async deletetableData (ids) {
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm(this.$t('materialBathS_AreYouSureDeleC') + '?')
        if (confirmRes) {
          const res = await this.$api.deleteBatchProgram(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.showTabs = false
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning(this.$t('materialBathS_PleasSeleDataBe'))
      }
    },
    async updateBeleteBatchProgramDetail () {
      this.detailLoading = true
      let data = this.$refs.detaliTable.getBatchData()
      let res = await this.$api.updateBeleteBatchProgramDetail(data)
      if (res.code === '200') {
        this.detailLoading = false
        this.batchIsRead = true
        this.$message.success(this.$t('common_SavedSuccessfully') + '!')
        this.$refs.tableList.queryList()
      }
    },
    async changeStautsBatchProgram () {
      let list = this.$refs.tableList.getSelectData().map(item => {
        return {
          id: item.mwmsMaterialBatchProgramId,
          isInvalid: !item.isInvalid
        }
      })
      if (list.length > 0) {
        this.changeStatusLoading = true
        const res = await this.$api.changeStautsBatchProgram(list)
        if (res.code === '200') {
          this.changeStatusLoading = false
          this.$message.success(this.$t('materialBathS_ModifSucc'))
          this.$refs.tableList.queryList()
        }
      } else {
        this.$message.warning(this.$t('materialBathS_PleasSeleItBeEn'))
      }
    }
  },
  components: {
    TableList, BatchTable
  },
  created () {
    this.getCodingRules()
  }
}
</script>
