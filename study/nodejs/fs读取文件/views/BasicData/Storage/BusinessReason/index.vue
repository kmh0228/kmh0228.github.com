<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">事务原因</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="18">
        <el-input placeholder="编码" v-model.trim="code" size="mini" style="width:30%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input placeholder="名称" v-model.trim="name" size="mini" style="width:30%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-select size="mini" placeholder="类型" v-model="reasonType" clearable  style="width:30%" @change="$refs.tableList.queryList(true)">
            <el-option label="成本中心" value="0"></el-option>
            <el-option label="退货原因" value="1"></el-option>
            <el-option label="退料原因" value="2"></el-option>
          </el-select>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getTransactionReason" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mWmsTransactionReasonId))">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
          <el-button size="mini" icon="el-icon-set-up" @click="changeTransactionReason($refs.tableList.getSelectData().map(item => item.mWmsTransactionReasonId))">启用/禁用</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="importVisible = true">导入</el-button>
        </div>
      </table-list>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="addForm.mWmsTransactionReasonId ? '编辑事务原因' : '新增事务原因' "
      :visible.sync="addVisible"
      width="600px">
      <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="编码"  prop="code" class="el-col el-col-11 ">
          <el-input size="mini"  v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="名称"  prop="name" class="el-col el-col-11 el-col-offset-1">
          <el-input size="mini" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型"  prop="reasonType"  class="el-col el-col-11 ">
           <el-select size="mini" clearable  v-model="addForm.reasonType" style="width:100%">
            <el-option label="成本中心" value="0"></el-option>
            <el-option label="退货原因" value="1"></el-option>
            <el-option label="退料原因" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="移动方向"  prop="moveDirection" class="el-col el-col-11 el-col-offset-1">
          <el-select size="mini" clearable  v-model="addForm.moveDirection" style="width:100%">
            <el-option label="入库" value="1"></el-option>
            <el-option label="出库" value="2"></el-option>
            <el-option label="移动" value="3"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="描述"  prop="description" class="el-col el-col-23">
          <el-input type="textarea" :rows="2" size="mini" v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTransactionReason" :loading="saveLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog
      title="导入"
      :visible.sync="importVisible"
      width="600px">
      <el-form class="el-row" label-width="100px" label-position="left">
        <el-form-item label="导入模板">
          <upload-file ref="uploadFile" :limit="1" :defaultFileArr="[]"></upload-file>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="importMeasurementInstrumentExcel" :loading="importLoading">确 定</el-button>
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
      },
      rules: {
        code: [{ required: true, message: '编码不能为空' }],
        name: [{ required: true, message: '名称不能为空' }],
        description: [{ required: true, message: '描述不能为空' }],
        reasonType: [{ required: true, message: '类型不能为空' }]
      }
    }
  },
  computed: {
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
            this.$message.success('保存成功')
            this.$refs.tableList.queryList(true)
          }
        }
      })
    },
    async deletetableData (ids) {
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm('确定删除当前选中的事务原因吗?')
        if (confirmRes) {
          const res = await this.$api.deleteTransactionReason(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的单据小类！')
      }
    },
    async changeTransactionReason (ids = []) {
      if (ids.length > 0) {
        const res = await this.$api.changeTransactionReason(ids)
        if (res.code === '200') {
          this.$message.success('修改成功')
          this.$refs.tableList.queryList()
        }
      } else {
        this.$message.warning('请先选择需要改变状态的事务原因！')
      }
    },
    async importMeasurementInstrumentExcel () {
      let files = this.$refs.uploadFile.getFileData()
      if (!files.length) {
        this.$message.warning('请选择导入模板')
        return false
      }
      let formData = new FormData()
      formData.append('file', files[0].raw)
      this.importLoading = true
      let res = await this.$api.importMeasurementInstrumentExcel(formData)
      if (res.code === '200') {
        this.$message.success('导入成功')
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
