<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('IqcRegister_IncomingInspectionRegistration')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <!-- <el-select style="width:40%" size="mini" v-model="docStatus" clearable :placeholder="$t('IqcRegister_PleaseSelectTheStatusOfTheIncomingMaterial')" @change="changeStatus">
          <el-option v-for="(option,i) in machineList" :key="i" :label="option.label" :value="option.value"></el-option>
        </el-select> -->
        <dict-select  v-model="searchForm.docStatus" dictType="INSPECT_STATUS"  style="width:35%" @change="changeStatus"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;"  @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" v-model="searchForm.keywords" :placeholder="$t('common_PleasEnteKeyWor')" style="width:40%;float:right;" @keydown.enter.native="getdata"></el-input>
      </el-col>
      <el-col :span="24"  style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
            <el-form-item :label="$t('IqcRegister_IncomingMaterialNo')" class="el-col el-col-11">
              <el-input v-model="searchForm.grNo" style="width:100%" size="mini" >
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('common_suppl')" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="searchForm.vendorName" style="width:100%" size="mini">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('common_InspeDate')" class="el-col el-col-11">
              <el-date-picker style="width:100%"  v-model="changeTime"  type="daterange"  :start-placeholder="$t('common_StartDate')" :end-placeholder="$t('common_endTime')"  value-format="yyyy-MM-dd"   :default-time="['12:00:00']">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('common_PorN')" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="searchForm.mComMaterialId" style="width:100%" size="mini">
              </el-input>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12" v-if="searchForm.docStatus === 'UN_REGISTER'">
          <el-button size="mini" icon="el-icon-search" @click="getdata">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleIPQC('')" >{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <!-- <el-button size="mini" @click="deleteTable">{{$t('common_Del')}}</el-button>
          <span class="split-line">|</span> -->
          <el-button size="mini" icon="el-icon-upload2" @click="isUpload = true">{{$t('IqcRegister_BatchImport')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="changeEntrylistDialog">{{$t('IqcRegister_CreateByStockInOrder')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="IqcInfoByGrNos">{{$t('IqcRegister_BatchGenerateInspection')}}</el-button>
        </el-col>
        <el-col :span="12" v-else-if="searchForm.docStatus === 'REGISTERED'" >
          <el-button size="mini" icon="el-icon-search" @click="getdata">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" :disabled="dispatchDisabled" @click="dispatchMethod">{{$t('IqcRegister_Dispatch')}}</el-button>
        </el-col>
        <el-col :span="12" v-else >
          <el-button size="mini" icon="el-icon-search" @click="getdata">{{$t('common_Inquire')}}</el-button>
        </el-col>
        <el-col :span="12">
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
              @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @selection-change="tableChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="grNo" :label="$t('IqcRegister_IncomingMaterialNo')" align="center" sortable></el-table-column>
          <el-table-column prop="stockInNo" :label="$t('common_StockInNo')" align="center" sortable></el-table-column>
          <el-table-column prop="qty" :label="$t('common_numbe')" align="center" sortable></el-table-column>
          <el-table-column prop="qtyUom" :label="$t('common_Unit')" align="center" sortable></el-table-column>
          <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center" sortable></el-table-column>
          <el-table-column prop="vendorName" :label="$t('common_SupplCode')" align="center" sortable></el-table-column>
          <el-table-column prop="poNo" :label="$t('IqcRegister_PurchaseOrder')" align="center" sortable></el-table-column>
          <el-table-column prop="warehouseNo" :label="$t('IqcRegister_WarehouseCode')" align="center" sortable></el-table-column>
          <el-table-column prop="docStatus" :label="$t('common_Status')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="80" fixed="right">
            <template slot-scope="scope">
              <handle-button iconClass="el-icon-edit-outline" @click="handleIPQC(scope.row)" :tipText="$t('common_Edit')"></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" :close-on-click-modal="false">
        <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getdata="getdata" :isEdit="isEdit" ></dialog-form>
      </el-dialog>
      <el-dialog :visible.sync="dispatchDialog" :title="$t('IqcRegister_IncomingDispatch')" width="50%" class="handle-dialog" >
        <dispatch-form v-if="dispatchDialog" ref="dispatchDialog" @cannelDispatch="cannelDispatch" :ids="ids"  @getdata="getdata"></dispatch-form>
      </el-dialog>
      <el-dialog :visible.sync="isUpload" :title="$t('IqcRegister_PleaseSelectTheFileToBeImported')" class="handle-dialog"  width="30vw">
          <el-upload
          style="text-align:center"  :before-upload="beforeUpload" drag action="">
          <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
          <p v-if="fileName">{{ fileName }}</p>
          <i class="el-icon-upload" v-else></i>
          <div class="el-upload__text">{{$t('IqcRegister_Tips2')}}<em>{{$t('common_ClickUplo')}}</em>,{{$t('IqcRegister_Or')}}
          <em><a href="static/download/Income_register.xlsx" style="color:#3B6F9A;text-decoration:none;" :download="$t('IqcRegister_ImportIncomingInspectionTemplate')" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em></div>
          <div class="el-upload__tip" slot="tip">{{$t('IqcRegister_Tips3')}}</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importOnline">{{$t('common_ok')}}</el-button>
          <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="entrylistDialog" :title="$t('IqcRegister_StockInOrderCreate')" class="handle-dialog" width="30vw">
        <dialog-enter v-if="entrylistDialog" ref="dialog"   @cannelEnDialog="cannelEnDialog" @getdata="getdata" ></dialog-enter>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import dispatchForm from './dispatchForm'
import dialogEnter from './dialogEnter'

export default {
  data () {
    return {
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      changeTime: [],
      searchForm: {
        docStatus: 'UN_REGISTER',
        mComMaterialId: '',
        grNo: '',
        vendorName: '',
        materail: '',
        startTime: '',
        endTime: '',
        keywords: ''
      },
      auditList: [],
      dialogVisible: false,
      isEdit: false,
      showMoreConditon: false,
      dispatchDialog: false,
      isUpload: false,
      fileName: '',
      fileContent: '',
      ids: [],
      isMaterial: '',
      isStockInNo: '',
      entrylistDialog: false

    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('IqcRegister_EditIncomingInspectionRegistration') : this.$t('IqcRegister_AddIncomingInspectionRegistration')
    },
    editDisabled () {
      return this.ids.length !== 1
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getdata()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getdata()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async handleIPQC (row) {
      let date = new Date()
      const str = date.toJSON().slice(0, 11) + date.toTimeString().slice(0, 8) + '+08:00'
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        let tQomIncomingMainId = row.tQomIncomingMainId
        let res = await this.$api.getInfoByGrNo({ tQomIncomingMainId })
        let keys = Object.keys(this.$refs.dialog.dialogForm)
        keys.forEach(key => {
          this.$refs.dialog.dialogForm[key] = res.data[0][key]
        })
        this.$refs.dialog.dialogForm.tQomIncomingMainId = tQomIncomingMainId
        this.$refs.dialog.dialogForm.inspectDate = str
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    tableChange (selection) {
      this.ids = []
      selection.map(item => {
        this.ids.push(item.tQomIncomingMainId)
      })
      this.isMaterial = selection.mComMaterialId
      this.isStockInNo = selection.stockInNo
    },
    changeStatus () {
      let { searchForm } = this
      for (let key in searchForm) {
        if (key !== 'docStatus') {
          searchForm[key] = ''
        }
      }
      this.changeTime = []
      this.getdata()
    },
    downloadTemplate (event) {
      event.stopPropagation()
    },
    async  getdata () {
      let { searchForm, page, changeTime } = this
      searchForm.startTime = changeTime[0] || ''
      searchForm.endTime = changeTime[1] || ''
      let data = Object.assign(searchForm, page)
      let res = await this.$api.findRegisterList(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
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
        this.$message.warning(this.$t('IqcRegister_Tips1'))
      }
      return false
    },
    dispatchMethod () {
      this.dispatchDialog = true
    },
    async importOnline () {
      let { fileContent } = this
      if (fileContent) {
        let res = this.$api.insertByExcel(fileContent)
        this.$myPrompt.handleMsg(res, () => {
          this.getdata()
        })
      } else {
        this.$message.warning(this.$t('IqcRegister_PleaseUploadTheFileToBeImported'))
      }
    },
    async IqcInfoByGrNos () {
      let len = this.ids.length
      if (len > 0) {
        let date = new Date()
        const inspectDate = date.toJSON().slice(0, 11) + date.toTimeString().slice(0, 8)
        let tQomIncomingMainIds = this.ids
        let data = Object.assign({ tQomIncomingMainIds, inspectDate })
        let res = await this.$api.insertIqcInfoByGrNos(data)
        this.$myPrompt.handleMsg(res, () => {
          this.getdata()
        })
      } else {
        this.$message.warning(this.$t('IqcRegister_PleaseSelectTheInspectionOrderToBeGeneratedInBatch'))
      }
    },
    closeUploadDialog () {
      this.isUpload = false
      this.fileName = ''
      this.fileContent = ''
    },
    changeEntrylistDialog () {
      this.entrylistDialog = true
    },
    cannel () {
      this.dialogVisible = false
    },
    cannelDispatch () {
      this.dispatchDialog = false
    },
    cannelEnDialog () {
      this.entrylistDialog = false
    }
  },
  components: {
    dialogForm, dispatchForm, dialogEnter
  },
  created () {
    this.getdata()
  }

}
</script>
