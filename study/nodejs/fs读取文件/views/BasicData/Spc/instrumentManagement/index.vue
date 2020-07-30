<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('instrumentM_ManagMeasInst')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select v-model="mSpcMeasurementStationId" clearable style="width:35%" :placeholder="$t('common_MeasuStat')+'/'+$t('common_labor')" @change="getSpcInstrumentList">
          <el-option v-for="option in measurementStationList" :key="option.mSpcMeasurementStationId" :label="option.stationCode" :value="option.mSpcMeasurementStationId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_PleasEnteQuerCo')" v-model.trim="keywords" style="width:40%;float:right;" @keydown.enter.native="getSpcInstrumentList">
          <i slot="suffix" class="el-input__icon" @click="getSpcInstrumentList"></i>
        </el-input>
      </el-col>
    </el-row>
     <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getSpcInstrumentList">{{$t('common_Inquire')}}</el-button>
         <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDialog('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteSpcInstrument('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="importDialog=true">{{$t('instrumentM_BatchImpo')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getSpcInstrumentList">{{$t('common_Refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border size="mini" @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
        <el-table-column prop="stationCode" sortable :label="$t('common_MeasuStat')+'/'+$t('common_labor')" align="center"></el-table-column>
        <el-table-column prop="instrumentName" sortable :label="$t('common_MeasuInst')" align="center"></el-table-column>
        <el-table-column prop="precision" sortable :label="$t('instrumentM_InstrAccu')" align="center"></el-table-column>
        <el-table-column prop="uom" sortable :label="$t('instrumentM_UnitMeas')" align="center" width="100"></el-table-column>
        <el-table-column prop="instrumentDesc" sortable :label="$t('common_Description')" align="center"></el-table-column>
        <el-table-column prop="lastEditor" sortable :label="$t('instrumentM_LastMain')" align="center" width="110"></el-table-column>
        <el-table-column prop="lastEditedDt" sortable :label="$t('instrumentM_LastMainTime')" align="center" :formatter="formatterDate"></el-table-column>
        <el-table-column :label="$t('common_Operate')" width="120" align="center">
          <template slot-scope="scope">
            <handle-button iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')" @click="handleDialog(scope.row)"></handle-button>
            <handle-button iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c' @click="deleteSpcInstrument(scope.row.mSpcMeasurementInstrumentId)"></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/编辑测量仪器表单 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible = false" :isEdit="isEdit" :measurementStationList="measurementStationList" @getSpcInstrumentList="getSpcInstrumentList"></dialog-form>
    </el-dialog>
    <!-- 导入测量仪器 -->
    <el-dialog :title="$t('instrumentM_selecMeasInstBeImpo')" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/Instrument.xlsx" style="color:#3B6F9A;text-decoration:none;" download="$t('instrumentM_MeasuInstTemp')+'.xlsx'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importSpcInstrument">{{$t('common_ok')}}</el-button>
        <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      measurementStationList: [],
      mSpcMeasurementStationId: '',
      queryLevel: 1,
      keywords: '',
      tableData: [],
      selectList: [],
      dialogVisible: false,
      isEdit: false,
      importDialog: false,
      fileName: '',
      fileContent: ''
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('instrumentM_EditMeasInst') : this.$t('instrumentM_NewMeasInst')
    }
  },
  methods: {
    async getMeasurementStationList () {
      const res = await this.$api.getMeasurementStation({ keywords: '' })
      const { code, data } = res
      if (code === '200') {
        this.measurementStationList = data
      } else {
        this.measurementStationList = []
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mSpcMeasurementInstrumentId)
      })
    },
    formatterDate (row, column, ceellValue) {
      return this.$dayjs(ceellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    async getSpcInstrumentList () {
      const { mSpcMeasurementStationId, keywords, queryLevel } = this
      const params = { mSpcMeasurementStationId, keywords, queryLevel }
      const res = await this.$api.getSpcInstrumentList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
      } else {
        this.tableData = []
      }
    },
    handleDialog (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mSpcMeasurementInstrumentId = row.mSpcMeasurementInstrumentId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteSpcInstrument (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('instrumentM_AreYouSureMeasInst'))
        if (confirm) {
          const res = await this.$api.deleteSpcInstrument(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getSpcInstrumentList()
          })
        }
      } else {
        this.$message.warning(this.$t('instrumentM_selecMeasInstDeleFirs'))
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
        this.$message.warning(this.$t('instrumentM_fileTypeExcel'))
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
    async importSpcInstrument () {
      const { fileContent } = this
      if (fileContent) {
        const data = new FormData()
        data.append('file', fileContent)
        const res = await this.$api.importSpcInstrument(data)
        this.$myPrompt.handleMsg(res, () => {
          this.closeUploadDialog()
          this.getSpcInstrumentList()
        })
      } else {
        this.$message.warning(this.$t('instrumentM_uploaMeasInstImpoFirs'))
      }
    }
  },
  created () {
    this.getSpcInstrumentList()
    this.getMeasurementStationList()
  },
  components: { dialogForm }
}
</script>
