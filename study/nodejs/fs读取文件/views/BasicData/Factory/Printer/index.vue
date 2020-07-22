<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('printer_printerManager')}}</h3>
    <el-form label-position="left" class="el-row">
      <el-form-item :label="$t('printer_printerName')" label-width="100px" class="el-col el-col-24">
        <el-input v-model="keyWord" size="mini" style="width:12vw;" @keydown.enter.native="getPrinterList">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getPrinterList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="hendlePrinter('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deletePrinters('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="printerData" border highlight-current-row size="mini" @selection-change="selectPrinter">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" ></el-table-column>
          <el-table-column prop="printerName" sortable :label="$t('printer_printerName')" align="center"></el-table-column>
          <el-table-column :label="$t('printer_printerPath')" sortable prop="printerPath" align="center"></el-table-column>
          <el-table-column :label="$t('printer_charEncod')" sortable align="center" prop="dictCode"></el-table-column>
          <el-table-column :label="$t('printer_accessName')" sortable align="center" prop="accessUserName"></el-table-column>
          <el-table-column :label="$t('printer_password')" align="center">
            <template>
              <p>******</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('printer_printerPath')" sortable prop="printerFilePath" align="center"></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120">
             <template slot-scope="scope">
              <handle-button @click="hendlePrinter(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deletePrinters(scope.row.mComPrinterId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="showDialog" :title="dialogTitle" class="handle-dialog">
      <el-form :model="printerForm" v-if="showDialog" ref="printerForm" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('printer_printerName')" prop="printerName" class="el-col el-col-11">
          <el-input v-model.trim="printerForm.printerName" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('printer_printerPath')" prop="printerPath" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="printerForm.printerPath" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('printer_charEncod')" prop="codedCharacterSet" class="el-col el-col-11">
          <!-- <el-select v-model="printerForm.codedCharacterSet" size="mini" style="width:100%">
            <el-option v-for="(option,i) in codeList" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
          </el-select> -->
          <dict-select  v-model="printerForm.codedCharacterSet" dictType="PRINTER_CODED_CHARACTER_SET" clearable ></dict-select>
        </el-form-item>
        <el-form-item :label="$t('printer_accessName')" prop="accessUserName" class="el-col el-col-11 11 el-col-offset-1">
          <el-input v-model.trim="printerForm.accessUserName" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('printer_password')" prop="accessUserPwd" class="el-col el-col-11">
          <el-input v-model.trim="printerForm.accessUserPwd" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('printer_printerPath')" prop="printerFilePath" class="el-col el-col-11 11 el-col-offset-1">
          <el-input v-model.trim="printerForm.printerFilePath" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('common_ok')}}</el-button>
        <el-button @click="showDialog = false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryLevel: 1,
      keyWord: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      printerData: [],
      selectedList: [],
      showDialog: false,
      mComPrinterId: '',
      printerForm: {
        printerName: '',
        printerPath: '',
        codedCharacterSet: '',
        mPomLineStationId: '',
        accessUserName: '',
        accessUserPwd: '',
        printerFilePath: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        printerName: [{ required: true, message: this.$t('printer_printNameRequire') }],
        printerPath: [{ required: true, message: this.$t('printer_printPathRequire') }],
        codedCharacterSet: [{ required: true, message: this.$t('printer_pleaseSelectChart') }],
        mPomLineStationId: [{ required: true, message: this.$t('printer_pleaseSelStation') }],
        accessUserName: [{ required: true, message: this.$t('printer_usersRequire') }],
        accessUserPwd: [{ required: true, message: this.$t('printer_passWordRequire') }],
        printerFilePath: [{ required: true, message: this.$t('printer_printFileRequire') }]
      }
    },
    dialogTitle () {
      return this.mComPrinterId ? this.$t('printer_editPrint') : this.$t('printer_newPrint')
    },
    handleData () {
      let { mComPrinterId, printerForm } = this
      let data = mComPrinterId ? { mComPrinterId } : {}
      return Object.assign(printerForm, data)
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    selectPrinter (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mComPrinterId)
      })
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取打印机列表
    async getPrinterList () {
      let { keyWord, queryLevel } = this
      let data = Object.assign({ keyWord, queryLevel }, this.page)
      let res = await this.$api.getPrinters(data)
      if (res.code === '200') {
        this.total = res.data.total_num
        this.printerData = res.data.list
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keyWord = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getPrinterList()
    },
    // 删除打印机信息
    async deletePrinters (id) {
      let ids = id ? [id] : this.selectedList
      if (ids.length > 0) {
        let result = await this.$myPrompt.confirm(this.$t('shift_confirmDelSelPri'))
        if (result) {
          let res = await this.$api.deletePrinters(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getPrinterList()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('shift_placeSelDelPri'))
      }
    },
    // 打开新增/编辑打印机弹框
    hendlePrinter (row) {
      let { mComPrinterId } = row
      let keys = Object.keys(this.printerForm)
      if (mComPrinterId) {
        this.printerForm = this.$global.filterForm(row, keys)
      } else {
        keys.forEach(key => {
          this.printerForm[key] = ''
        })
        this.printerForm.codedCharacterSet = 'PRINTER_CODED_CHARACTER_SET_10'
      }
      this.mComPrinterId = mComPrinterId
      this.showDialog = true
    },
    // 新增/编辑打印机
    submitForm () {
      const vm = this
      vm.$refs['printerForm'].validate(async valid => {
        if (valid) {
          let res = null
          let { mComPrinterId, handleData } = vm
          if (mComPrinterId) {
            res = await this.$api.editPrinter(handleData)
          } else {
            res = await this.$api.addPrinter(handleData)
          }
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.showDialog = false
            this.getPrinterList()
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getPrinterList()
  }
}
</script>
