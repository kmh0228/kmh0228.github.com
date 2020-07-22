<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">生产自主检查维护</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12" :offset="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" placeholder="请输入部门查询" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="部门" class="el-col el-col-11">
            <el-cascader
            v-model="searchForm.officeCode"
            :options="deptOptions"
            class="col-department"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item label="产品系列" class="el-col el-col-11 el-col-offset-1">
            <mes-select v-model="searchForm.productSeries" method="getMachine" labelKey="mComMaterialfamilyName" valueKey="mComMaterialfamilyCode"></mes-select>
          </el-form-item>
          <el-form-item label="产品料号" class="el-col el-col-11">
            <el-input v-model="searchForm.productNumber" placeholder="请输入产品料号"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div>
        <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getAutonomyCheckList" :total="total">
          <div slot="buttonBox">
            <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList()">查询</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-plus" @click="addData()">新增</el-button>
            <span class="split-line">|</span>
            <!-- <el-button size="mini" icon="el-icon-upload2" @click="uploadVisible = true">导入</el-button>
            <span class="split-line">|</span> -->
            <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.autonomyCheckId))">批量删除</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
          </div>
        </table-list>
      </div>
      <div class="mes-main-tabs" v-show="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
        <el-tab-pane label="项目明细" name="infoName">
          <item-details ref="itemDetails" :autonomyCheckId="autonomyCheckId"></item-details>
        </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 新增弹窗 -->
      <el-dialog
        :title="addForm.autonomyCheckId ? '编辑' : '新增' "
        :visible.sync="addVisible"
        width="650px">
        <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="120px" label-position="left">
          <el-form-item label="部门"  prop="officeCode" class="el-col el-col-23 ">
            <el-cascader
            v-model="addForm.officeCode"
            :options="deptOptions"
            class="col-department"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            @change="officeChange"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item label="产品系列"  prop="productSeries" class="el-col el-col-11 ">
            <product-line ref="productLine"  v-model="addForm.productSeries" :confirmFun="productLineConfirmFun" :defaultProductSeries="addForm.productSeriesName" :officeCode="addForm.officeCode.length ? addForm.officeCode[addForm.officeCode.length - 1] : ''"></product-line>
          </el-form-item>
          <el-form-item label="产品料号"  prop="productNumber" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.productNumberName" disabled></el-input>
          </el-form-item>
          <el-form-item label="线别名称"  prop="lineId" class="el-col el-col-11 ">
            <equipment-select ref="equipmentSelect" v-model="addForm.lineId" placeholder="请选择线别" valueKey="lineId" labelKey="lineCode" :defaultValue="addForm.lineId" :defaultDeviceName="addForm.lineName" :officeCode="addForm.officeCode.length ? addForm.officeCode[addForm.officeCode.length - 1] : ''" ></equipment-select>
          </el-form-item>
          <el-form-item label="是否自动生产"  prop="isAutoCreate" class="el-col el-col-11 el-col-offset-1">
             <el-radio-group v-model="addForm.isAutoCreate">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频率"  prop="frequency" class="el-col el-col-23">
            <el-input  v-model="addForm.frequency"></el-input>
          </el-form-item>
          <el-form-item label="检查时间"  prop="checkTime" class="el-col el-col-23">
            <el-date-picker
              v-model="addForm.checkTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="ECN编号"  prop="ecnNo" class="el-col el-col-11">
            <el-input v-model="addForm.ecnNo"></el-input>
          </el-form-item>
          <el-form-item label="版本号"  prop="revNo" class="el-col el-col-11 el-col-offset-1">
            <el-input  v-model="addForm.revNo"></el-input>
          </el-form-item>
          <el-form-item label="备注"  prop="remark" class="el-col el-col-23">
            <el-input type="textarea" :rows="3" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAutonomyCheck" :loading="saveLoading">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导入弹窗 -->
      <el-dialog :visible.sync="uploadVisible" title="请选择需要导入的文件" class="handle-dialog"  width="30vw">
        <el-upload
          style="text-align:center"  :before-upload="beforeUpload" drag action="">
          <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
          <p v-if="fileName">{{ fileName }}</p>
          <i class="el-icon-upload" v-else></i>
          <div class="el-upload__text">将EXCEL文件拖到此处<em>点击上传</em>,或
          <em><a href="static/download/Income_register.xlsx" style="color:#3B6F9A;text-decoration:none;" download="导入生产日报表维护模板.xls" >模版下载</a></em></div>
          <div class="el-upload__tip" slot="tip">只能上传EXCEL文件，且不超过500kb</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importOnline">确 定</el-button>
          <el-button @click="closeUploadDialog">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import productLine from '@/components/Module/productLineSelect'
import equipmentSelect from '@/components/Module/equipmentSelect'
import ItemDetails from './itemDetails'
import { tableOption } from './tableOption'
export default {
  components: { TableList, productLine, equipmentSelect, ItemDetails },
  data () {
    return {
      activeName: 'infoName',
      showTabs: false,
      addVisible: false,
      uploadVisible: false,
      saveLoading: false,
      searchForm: {
        officeCode: [],
        productSeries: '',
        productNumber: '',
        keywords: ''
      },
      addForm: {
        autonomyCheckId: '',
        officeCode: [],
        fullOffice: '',
        productSeries: '',
        productSeriesName: '',
        productNumberName: '',
        productNumber: '',
        lineId: '',
        lineName: '',
        isAutoCreate: '',
        frequency: '',
        checkTime: '',
        ecnNo: '',
        revNo: '',
        remark: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择部门' }],
        productSeries: [{ required: true, message: '请选择产品系列' }],
        productNumber: [{ required: true, message: '请选择产品料号' }],
        lineId: [{ required: true, message: '请选择线别' }],
        isAutoCreate: [{ required: true, message: '请选择是否自动生产' }],
        frequency: [{ required: true, message: '请输入频率' }],
        checkTime: [{ required: true, message: '请选择检查时间' }],
        ecnNo: [{ required: true, message: '请输入ECN编号' }],
        revNo: [{ required: true, message: '请输入版本号' }]
        // remark: [{ required: true, message: '请输入备注' }]
      },
      autonomyCheckId: '',
      fileName: '',
      fileContent: '',
      tableData: [],
      deptOptions: [],
      option: tableOption(this),
      total: 0,
      mWmsEntrylistVendList: [],
      showMoreConditon: false
    }
  },
  methods: {
    beforeUpload (file) {
      let fileName = file.name
      let fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        // 将文件转换成base64格式
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = e => {
          this.fileContent = e.target.result
        }
        // console.log(this.fileContent)
      } else {
        this.$message.warning('文件类型必须是excel格式!')
      }
      return false
    },
    closeUploadDialog () {
      this.uploadVisible = false
      this.fileName = ''
      this.fileContent = ''
    },
    productLineConfirmFun (data) {
      this.addForm.productNumberName = data[0].materialNo || ''
      this.addForm.productNumber = data[0].mComMaterialId || ''
    },
    officeChange () {
      for (let key in this.addForm) {
        if (key !== 'remark' && key !== 'officeCode' && key !== 'autonomyCheckId') {
          this.addForm[key] = ''
        }
      }
      this.$refs.productLine.clearSelectData()
      this.$refs.equipmentSelect.clearSelectData()
    },
    addData () {
      if (this.$refs.addForm) {
        for (let key in this.addForm) {
          this.addForm[key] = Array.isArray(this.addForm[key]) ? [] : ''
        }
        this.$refs.productLine.clearSelectData()
        this.$refs.equipmentSelect.clearSelectData()
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate()
        })
      }
      this.addVisible = true
      this.showTabs = false
    },
    saveAutonomyCheck () {
      this.$refs['addForm'].validate(async (valid) => {
        if (valid) {
          this.saveLoading = true
          let officeCode = this.addForm.officeCode.length ? this.addForm.officeCode[this.addForm.officeCode.length - 1] : ''
          let data = {
            ...this.addForm,
            fullOffice: this.addForm.officeCode.join(','),
            officeCode: officeCode
          }
          let res = await this.$api.saveAutonomyCheck({ autonomyCheck: data })
          if (res.code === '200') {
            this.saveLoading = false
            this.addVisible = false
            this.$message.success('保存成功！')
            this.$refs.tableList.queryList()
          }
        }
      })
    },
    async deletetableData (ids = []) {
      if (!ids.length) {
        this.$message.warning('请选择要删除的信息')
        return false
      }
      let confirm = await this.$myPrompt.confirm('确定删除所选择的信息吗？')
      if (confirm) {
        let res = await this.$api.deleteAutonomyCheckByIds({ idList: ids })
        this.$myPrompt.handleMsg(res, () => {
          this.$refs.tableList.queryList()
        })
      }
    },
    async importOnline () {
      let { fileContent } = this
      if (fileContent) {
        let res = this.$api.insertByExcel(fileContent)
        this.$myPrompt.handleMsg(res, () => {
          this.$refs.tableList.queryList(true)
        })
      } else {
        this.$message.warning('请上传需要导入的文件！')
      }
    },
    async getAutonomyCheckList (page) {
      let officeCode = this.searchForm.officeCode.length ? this.searchForm.officeCode[this.searchForm.officeCode.length - 1] : ''
      let res = await this.$api.getAutonomyCheckList({ ...page, ...this.searchForm, officeCode: officeCode })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      }
    },
    refreshPage () {
      this.$global.resetForm(this.searchForm)
      this.$refs.tableList.queryList(true)
    },
    async getOfficeList () {
      const res = await this.$api.getOfficeList({ type: 2 })
      const { code, data } = res
      if (code === '200') {
        this.deptOptions = Array.isArray(data) ? data : []
      }
    }
  },
  created () {
    this.getOfficeList()
  }
}

</script>
<style lang="scss">
.col-department.el-cascader {
  width: 100%;
}
</style>
