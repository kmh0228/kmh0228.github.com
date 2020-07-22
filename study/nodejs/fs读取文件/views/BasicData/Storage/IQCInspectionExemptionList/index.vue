<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">物料免检清单</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="18">
        <el-input placeholder="物料编码" v-model.trim="materialNo" size="mini" style="width:30%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input placeholder="物料名称" v-model.trim="materialName" size="mini" style="width:30%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-select size="mini" placeholder="供应商" v-model="vendor" filterable clearable  style="width:30%" @change="$refs.tableList.queryList(true)">
          <el-option v-for="(option,i) in vendorList" :key="i" :label="option.mWmsVendorName" :value="option.mWmsVendorId"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getNoNeedCheckList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mwmsIqcExtId))">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button><el-button size="mini" icon="el-icon-upload2" @click="importVisible = true">导入</el-button>
        </div>
      </table-list>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="addForm.mwmsIqcExtId ? '编辑物料免检清单' : '新增物料免检清单' "
      :visible.sync="addVisible"
      width="600px">
      <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="110px" label-position="left">
        <el-form-item label="物料编码"  prop="materialId" class="el-col el-col-11 ">
          <material-select  v-model="addForm.materialId" :materialNoVersion="addForm.materialNo" style="width:100%" @change="getProductName"></material-select>
        </el-form-item>
        <el-form-item label="物料名称"  prop="materialName" class="el-col el-col-11 el-col-offset-1">
          <el-input size="mini" v-model="addForm.materialName" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商编码"  prop="vendorId"  class="el-col el-col-11 ">
           <el-select size="mini" clearable filterable v-model="addForm.vendorId" style="width:100%" @change="getVendorName">
            <el-option v-for="(option,i) in vendorList" :key="i" :label="option.mWmsVendorCode" :value="option.mWmsVendorId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商名称"  prop="mwmsVendorName" class="el-col el-col-11 el-col-offset-1">
          <el-input size="mini" v-model="addForm.mwmsVendorName" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNoNeedCheck" :loading="saveLoading">确 定</el-button>
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
        <el-button type="primary" @click="importNoNeedCheck" :loading="importLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import TableList from '@/components/Module/TableList'
import uploadFile from '@/components/Module/uploadFile'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      materialNo: '',
      materialName: '',
      vendor: '',
      addVisible: false,
      importVisible: false,
      saveLoading: false,
      importLoading: false,
      total: 0,
      option: tableOption(this),
      vendorList: [],
      tableData: [],
      addForm: {
        mwmsIqcExtId: '',
        materialId: '',
        materialNo: '',
        materialName: '',
        vendorId: '',
        mwmsVendorName: ''
      },
      rules: {
        materialId: [{ required: true, message: '物料编码不能为空' }]
      }
    }
  },
  computed: {
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.materialNo = ''
      this.materialName = ''
      this.vendor = ''
      this.$refs.tableList.queryList(true)
    },
    showPop () {
      this.addForm = {
        mwmsIqcExtId: '',
        materialId: '',
        materialNo: '',
        materialName: '',
        vendorId: '',
        mwmsVendorName: ''
      }
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.addVisible = true
    },
    async getNoNeedCheckList (page) {
      let res = await this.$api.getNoNeedCheckList({ ...page, materialNo: this.materialNo, materialName: this.materialName, vendor: this.vendor })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async saveNoNeedCheck () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let noNeedCheck = {
            ...this.addForm
          }
          this.saveLoading = true
          let res = await this.$api.saveNoNeedCheck({ noNeedCheck })
          if (res.code === '200') {
            this.addVisible = false
            this.saveLoading = false
            this.$message.success('保存成功')
            this.$refs.tableList.queryList(true)
          }
        }
      })
    },
    async deletetableData (idList) {
      const len = idList.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm('确定删除当前选中的数据吗?')
        if (confirmRes) {
          const res = await this.$api.deleteNoNeedCheck({ idList })
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的数据！')
      }
    },
    async importNoNeedCheck () {
      let files = this.$refs.uploadFile.getFileData()
      if (!files.length) {
        this.$message.warning('请选择导入模板')
        return false
      }
      let formData = new FormData()
      formData.append('file', files[0].raw)
      this.importLoading = true
      let res = await this.$api.importNoNeedCheck(formData)
      if (res.code === '200') {
        this.$message.success('导入成功')
        this.$refs.tableList.queryList(true)
        this.importVisible = false
        this.importLoading = false
      }
    },
    async getVendors () {
      let data = {
        mWmsVendorCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getVendors(data)
      this.vendorList = res.code === '200' ? res.data.list : []
    },
    getVendorName () {
      this.addForm.mwmsVendorName = this.vendorList.find(item => item.mWmsVendorId === this.addForm.vendorId).mWmsVendorName
    },
    async getProductName () {
      let partId = this.addForm.materialId
      let res = await this.$api.getTypeAndNameByPartNo({ partId })
      if (res.code === '200') {
        this.addForm.materialName = res.data.productName
      } else {
        this.addForm.materialName = ''
      }
    }
  },
  components: {
    TableList, uploadFile, materialSelect
  },
  created () {
    this.getVendors()
  }
}
</script>
