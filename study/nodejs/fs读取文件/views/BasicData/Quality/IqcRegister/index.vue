<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">进料检验登记</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <!-- <el-select style="width:40%" size="mini" v-model="docStatus" clearable placeholder="请选择进料单状态" @change="changeStatus">
          <el-option v-for="(option,i) in machineList" :key="i" :label="option.label" :value="option.value"></el-option>
        </el-select> -->
        <dict-select  v-model="searchForm.docStatus" dictType="INSPECT_STATUS"  style="width:35%" @change="changeStatus"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;"  @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" v-model="searchForm.keywords" placeholder="请输入关键词" style="width:40%;float:right;" @keydown.enter.native="getdata"></el-input>
      </el-col>
      <el-col :span="24"  style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
            <el-form-item label="进料单号" class="el-col el-col-11">
              <el-input v-model="searchForm.grNo" style="width:100%" size="mini" >
              </el-input>
            </el-form-item>
            <el-form-item label="供应商" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="searchForm.vendorName" style="width:100%" size="mini">
              </el-input>
            </el-form-item>
            <el-form-item label="检验日期：" class="el-col el-col-11">
              <el-date-picker style="width:100%"  v-model="changeTime"  type="daterange"  start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd"   :default-time="['12:00:00']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="料号" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="searchForm.mComMaterialId" style="width:100%" size="mini">
              </el-input>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12" v-if="searchForm.docStatus === 'UN_REGISTER'">
          <el-button size="mini" icon="el-icon-search" @click="getdata">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleIPQC('')" >新增</el-button>
          <span class="split-line">|</span>
          <!-- <el-button size="mini" @click="deleteTable">删除</el-button>
          <span class="split-line">|</span> -->
          <el-button size="mini" icon="el-icon-upload2" @click="isUpload = true">批量导入</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="changeEntrylistDialog">按入库单创建</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="IqcInfoByGrNos">批量生成检验单</el-button>
        </el-col>
        <el-col :span="12" v-else-if="searchForm.docStatus === 'REGISTERED'" >
          <el-button size="mini" icon="el-icon-search" @click="getdata">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" :disabled="dispatchDisabled" @click="dispatchMethod">派工</el-button>
        </el-col>
        <el-col :span="12" v-else >
          <el-button size="mini" icon="el-icon-search" @click="getdata">查询</el-button>
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
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="grNo" label="进料单号" align="center" sortable></el-table-column>
          <el-table-column prop="stockInNo" label="入库单号" align="center" sortable></el-table-column>
          <el-table-column prop="qty" label="数量" align="center" sortable></el-table-column>
          <el-table-column prop="qtyUom" label="单位" align="center" sortable></el-table-column>
          <el-table-column prop="materialNo" label="料号" align="center" sortable></el-table-column>
          <el-table-column prop="vendorName" label="供应商代码" align="center" sortable></el-table-column>
          <el-table-column prop="poNo" label="采购单号" align="center" sortable></el-table-column>
          <el-table-column prop="warehouseNo" label="仓库代码" align="center" sortable></el-table-column>
          <el-table-column prop="docStatus" label="状态" align="center" sortable></el-table-column>
          <el-table-column label="操作" align="center" width="80" fixed="right">
            <template slot-scope="scope">
              <handle-button iconClass="el-icon-edit-outline" @click="handleIPQC(scope.row)" tipText="编辑"></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" :close-on-click-modal="false">
        <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getdata="getdata" :isEdit="isEdit" ></dialog-form>
      </el-dialog>
      <el-dialog :visible.sync="dispatchDialog" title="进料派工" width="50%" class="handle-dialog" >
        <dispatch-form v-if="dispatchDialog" ref="dispatchDialog" @cannelDispatch="cannelDispatch" :ids="ids"  @getdata="getdata"></dispatch-form>
      </el-dialog>
      <el-dialog :visible.sync="isUpload" title="请选择需要导入的文件" class="handle-dialog"  width="30vw">
          <el-upload
          style="text-align:center"  :before-upload="beforeUpload" drag action="">
          <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
          <p v-if="fileName">{{ fileName }}</p>
          <i class="el-icon-upload" v-else></i>
          <div class="el-upload__text">将EXCEL文件拖到此处<em>点击上传</em>,或
          <em><a href="static/download/Income_register.xlsx" style="color:#3B6F9A;text-decoration:none;" download="导入进料检验模板.xls" @click="downloadTemplate">模版下载</a></em></div>
          <div class="el-upload__tip" slot="tip">只能上传EXCEL文件，且不超过500kb</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="importOnline">确 定</el-button>
          <el-button @click="closeUploadDialog">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="entrylistDialog" title="入库单创建" class="handle-dialog" width="30vw">
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
      return this.isEdit ? '编辑进料检验登记' : '新增进料检验登记'
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
        this.$message.warning('文件类型必须是excel格式!')
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
        this.$message.warning('请上传需要导入的文件！')
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
        this.$message.warning('请选择要批量生成的检验单')
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
