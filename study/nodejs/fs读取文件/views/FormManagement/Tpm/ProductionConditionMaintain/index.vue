<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('productCondM_MaintProdCondShee')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12" :offset="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('productCondM_enterDepaQuer')" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_Department')" class="el-col el-col-11">
            <el-cascader
            v-model="searchForm.officeCode"
            :options="deptOptions"
            class="col-department"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11 el-col-offset-1">
            <mes-select v-model="searchForm.productSeries" method="getMachine" labelKey="mComMaterialfamilyName" valueKey="mComMaterialfamilyCode"></mes-select>
          </el-form-item>
          <el-form-item :label="$t('common_ProduPartNumb')" class="el-col el-col-11 ">
            <el-input v-model="searchForm.productNumber" :placeholder="$t('productCondM_inputProdPartNumb')"></el-input>
          </el-form-item>
           <el-form-item :label="$t('common_EquipName')" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.eqpName" :placeholder="$t('productCondM_enterDeviName')"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div>
        <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getConditionRecordList" :total="total">
          <div slot="buttonBox">
            <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-plus" @click="addData">{{$t('common_Add')}}</el-button>
            <span class="split-line">|</span>
            <!-- <el-button size="mini" icon="el-icon-upload2" @click="uploadVisible = true">{{$t('common_Impor')}}</el-button> -->
            <!-- <span class="split-line">|</span> -->
            <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mmomEqpConditionrecordId))">{{$t('common_Delete')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          </div>
        </table-list>
      </div>
      <div class="mes-main-tabs" v-show="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('productCondM_ProjeDeta')" name="infoName">
          <item-details :mmomEqpConditionrecordId="mmomEqpConditionrecordId"></item-details>
        </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 新增弹窗 -->
      <el-dialog
        :title="addForm.mmomEqpConditionrecordId ? this.$t('common_Edit') : this.$t('common_Add') "
        :visible.sync="addVisible"
        width="800px">
        <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="150px" label-position="left">
          <el-form-item :label="$t('common_Department')"  prop="officeCode" class="el-col el-col-23 ">
            <el-cascader
            v-model="addForm.officeCode"
            :options="deptOptions"
            class="col-department"
            :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
            @change="officeChange"
            clearable></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')"  prop="productSeries" class="el-col el-col-11 ">
            <product-line ref="productLine"  v-model="addForm.productSeries" :confirmFun="productLineConfirmFun" :defaultValue="addForm.productSeries" :defaultProductSeries="addForm.productSeriesName"  :officeCode="addForm.officeCode.length ? addForm.officeCode[addForm.officeCode.length - 1] : ''"></product-line>
          </el-form-item>
          <el-form-item :label="$t('common_ProduPartNumb')"  prop="productNumberName" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.productNumberName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_EquipName')"  prop="eqpCode" class="el-col el-col-11 ">
            <equipment-select ref="equipmentSelect" v-model="addForm.eqpCode" valueKey="resourceCode" :confirmFun="confirmFun" :defaultValue="addForm.eqpCode" :defaultDeviceName="addForm.eqpName" :officeCode="addForm.officeCode.length ? addForm.officeCode[addForm.officeCode.length - 1] : ''" ></equipment-select>
          </el-form-item>
          <el-form-item :label="$t('common_LineName')"  prop="lineName" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.lineName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_TubeDiam')"  prop="pipeDiameter" class="el-col el-col-11 ">
            <el-input v-model="addForm.pipeDiameter"></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_DocumNumb')"  prop="fileNo" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.fileNo"></el-input>
          </el-form-item>
          <el-form-item label="SWR编号"  prop="swrNo" class="el-col el-col-11 ">
            <el-input v-model="addForm.swrNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_MaterNo')"  prop="rawPartno" class="el-col el-col-11 el-col-offset-1">
           <el-input v-model="addForm.rawPartno"></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_NameRawMate')"  prop="rawPartname" class="el-col el-col-11 ">
            <el-input v-model="addForm.rawPartname"></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_AppliMode')"  prop="smapType" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.smapType"></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_colou')"  prop="colour" class="el-col el-col-11 ">
            <el-input v-model="addForm.colour"></el-input>
          </el-form-item>
          <el-form-item label="CAV数量"  prop="cavQty" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.cavQty"></el-input>
          </el-form-item>
          <el-form-item label="ECN编号"  prop="ecnNo" class="el-col el-col-11 ">
            <el-input v-model="addForm.ecnNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('productCondM_VersiNumb')"  prop="revNo" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.revNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_remarks')"  prop="recordDesc" class="el-col el-col-23">
            <el-input type="textarea" :rows="3" v-model="addForm.recordDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">{{$t('common_cancel')}}</el-button>
          <el-button type="primary" :loading="saveLoading" @click="saveConditionRecord">{{$t('common_ok')}}</el-button>
        </span>
      </el-dialog>
      <!-- 导入弹窗 -->
      <el-dialog :visible.sync="uploadVisible" :title="$t('productCondM_selecFileYouWantImpo')" class="handle-dialog"  width="30vw">
        <el-upload
          style="text-align:center"  :before-upload="beforeUpload" drag action="">
          <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
          <p v-if="fileName">{{ fileName }}</p>
          <i class="el-icon-upload" v-else></i>
          <div class="el-upload__text">{{$t('productCondM_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em>,{{$t('common_or')}}
          <em><a href="static/download/Income_register.xlsx" style="color:#3B6F9A;text-decoration:none;" :download="$t('productCondM_ImporDailRepoMainTemp') + '.xls'" >{{$t('common_TemplDown')}}</a></em></div>
          <div class="el-upload__tip" slot="tip">{{$t('productCondM_onlyExcelAndNoMoreThan')}}</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importOnline">{{$t('common_ok')}}</el-button>
          <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
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
        eqpName: '',
        keywords: ''
      },
      addForm: {
        mmomEqpConditionrecordId: '',
        officeCode: [],
        fullOffice: '',
        productSeries: '',
        productSeriesName: '',
        productNumberName: '',
        productNumber: '',
        eqpCode: '',
        eqpName: '',
        lineName: '',
        cavQty: '',
        colour: '',
        ecnNo: '',
        fileNo: '',
        pipeDiameter: '',
        rawPartno: '',
        rawPartname: '',
        recordDesc: '',
        revNo: '',
        smapType: '',
        swrNo: ''
      },
      mmomEqpConditionrecordId: '',
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
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleDepa') }],
        productSeries: [{ required: true, message: this.$t('common_PleasSeleProdSe') }],
        productNumberName: [{ required: true, message: this.$t('productCondM_selecProdPartNumb') }],
        eqpCode: [{ required: true, message: this.$t('productCondM_selecDevi') }],
        pipeDiameter: [{ required: true, pattern: /^\d+(\.\d+)?$/, message: this.$t('common_pleasEnteANumb') }],
        fileNo: [{ required: true, message: this.$t('productCondM_enterDocuNumb') }],
        swrNo: [{ required: true, message: '请输入SWR编号' }],
        rawPartno: [{ required: true, message: this.$t('productCondM_inputMateNumb') }],
        rawPartname: [{ required: true, message: this.$t('productCondM_enterNameRawMate') }],
        smapType: [{ required: true, message: this.$t('productCondM_enterApplMode') }],
        colour: [{ required: true, message: this.$t('productCondM_enterColo') }],
        cavQty: [{ required: true, pattern: /^\d+(\.\d+)?$/, message: this.$t('common_pleasEnteANumb') }],
        ecnNo: [{ required: true, message: '请输入ECN编号' }],
        revNo: [{ required: true, message: this.$t('productCondM_enterVersNumb') }]
      }
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
        this.$message.warning(this.$t('productCondM_fileTypeExcel'))
      }
      return false
    },
    closeUploadDialog () {
      this.uploadVisible = false
      this.fileName = ''
      this.fileContent = ''
    },
    confirmFun (data) {
      this.addForm.lineName = data[0].lineCode
    },
    productLineConfirmFun (data) {
      this.addForm.productNumberName = data[0].materialNo || ''
      this.addForm.productNumber = data[0].mComMaterialId || ''
    },
    officeChange () {
      for (let key in this.addForm) {
        if (key !== 'recordDesc' && key !== 'officeCode' && key !== 'mmomEqpConditionrecordId') {
          this.addForm[key] = ''
        }
      }
      this.$refs.productLine.clearSelectData()
      this.$refs.equipmentSelect.clearSelectData()
    },
    async importOnline () {
      let { fileContent } = this
      if (fileContent) {
        let res = this.$api.insertByExcel(fileContent)
        this.$myPrompt.handleMsg(res, () => {
          this.$refs.tableList.queryList(true)
        })
      } else {
        this.$message.warning(this.$t('productCondM_uploaFileBeImpo'))
      }
    },
    async getConditionRecordList (page) {
      let officeCode = this.searchForm.officeCode.length ? this.searchForm.officeCode[this.searchForm.officeCode.length - 1] : ''
      let res = await this.$api.getConditionRecordList({ ...page, ...this.searchForm, officeCode: officeCode })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      }
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
    saveConditionRecord () {
      this.$refs['addForm'].validate(async (valid) => {
        if (valid) {
          this.saveLoading = true
          let officeCode = this.addForm.officeCode.length ? this.addForm.officeCode[this.addForm.officeCode.length - 1] : ''
          let data = {
            ...this.addForm,
            fullOffice: this.addForm.officeCode.join(','),
            officeCode: officeCode
          }
          let res = await this.$api.saveConditionRecord({ conditionRecord: data })
          if (res.code === '200') {
            this.addVisible = false
            this.saveLoading = false
            this.$message.success(this.$t('productCondM_SaveSucc'))
            this.$refs.tableList.queryList()
          }
        }
      })
    },
    async deletetableData (ids) {
      if (!ids.length) {
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
        return false
      }
      let confirm = await this.$myPrompt.confirm(this.$t('productCondM_AreYouSureSeleInfo'))
      if (confirm) {
        let res = await this.$api.deleteConditionRecordByIds({ idList: ids })
        this.$myPrompt.handleMsg(res, () => {
          this.$refs.tableList.queryList()
        })
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
