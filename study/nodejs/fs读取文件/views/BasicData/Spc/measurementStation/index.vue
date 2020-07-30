<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('measurStation_SurveStatMana')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input size="mini" v-model="searchForm.keyWord" style="width:35%;" :placeholder="$t('common_PleasEnteQuerCo')" @keydown.enter.native="getTableData"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handletable('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid"  @click="deleteTable('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="isUpload = true">{{$t('measurStation_BatchImpo')}}</el-button>
          <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="getTableData">{{$t('common_Refresh')}}</el-button>
        </el-col>
      </el-row>
       <div class="mes-table-content">
      <el-table :data="tableData" border size="mini" highlight-current-row @selection-change="tableSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
        <el-table-column prop="stationCode" :label="$t('measurStation_SurveStat')+'/'+$t('common_labor')" align="center" sortable></el-table-column>
        <el-table-column prop="stationDesc" :label="$t('common_Description')" align="center" sortable></el-table-column>
        <el-table-column prop="lastEditor" :label="$t('measurStation_LastMain')" align="center" sortable></el-table-column>
        <el-table-column prop="lastEditedDt" :label="$t('measurStation_LastMainTime')" align="center" :formatter="formatterDate" sortable></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteTable(scope.row.mSpcMeasurementStationId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
      </el-table-column>
      </el-table>
    </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="500px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getTableData="getTableData" ></dialog-form>
  </el-dialog>
  <el-dialog :visible.sync="isUpload" :title="$t('measurStation_selecFileYouWantImpo')" class="handle-dialog"  width="30vw">
        <el-upload
        style="text-align:center"  :before-upload="beforeUpload" drag action="">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
         <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/MeasurementStation.xlsx" style="color:#3B6F9A;text-decoration:none;" :download="$t('measurStation_MeasuStatTemp')+'.xls'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
        </div>
      </el-upload>
       <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importOnline">{{$t('common_ok')}}</el-button>
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
      isUpload: false,
      selectList: [],
      isEdit: false,
      tableData: [],
      dialogVisible: false,
      fileName: '',
      fileContent: '',
      searchForm: {
        queryLevel: 1,
        keyWord: ''
      }
    }
  },
  computed: {
    editBtnDisabled () {
      return this.selectList.length !== 1
    },
    deleteBtnDisabled () {
      return this.selectList.length === 0
    },
    dialogTitle () {
      return this.isEdit ? this.$t('measurStation_EditStat') : this.$t('measurStation_NewSurvStat')
    }
  },
  methods: {
    // 取消组件本身的上传
    beforeUpload (file) {
      const fileName = file.name
      const fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        this.fileContent = file
      } else {
        this.$message.warning(this.$t('measurStation_fileTypeExcel'))
      }
      return false
    },
    formatterDate (row, column, ceellValue) {
      return this.$dayjs(ceellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    // 取消按钮停止上传
    downloadTemplate (event) {
      event.stopPropagation()
    },
    // 提交按钮 进行上传
    async importOnline () {
      const { fileContent } = this
      if (fileContent) {
        const data = new FormData()
        data.append('file', fileContent)
        const res = await this.$api.importMeasurementStation(data)
        this.$myPrompt.handleMsg(res, () => {
          this.closeUploadDialog()
          this.getTableData()
        })
      } else {
        this.$message.warning(this.$t('measurStation_uploaFileBeImpo'))
      }
    },
    closeUploadDialog () {
      this.isUpload = false
      this.fileName = ''
      this.fileContent = ''
    },
    async getTableData () {
      const { searchForm } = this
      const params = Object.assign(searchForm)
      const res = await this.$api.getMeasurementStation(params)
      if (res.code === '200') {
        this.tableData = res.data
      } else {
        this.tableData = []
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mSpcMeasurementStationId)
      })
    },
    handletable (selectObj) {
      if (selectObj) {
        this.isEdit = true
        this.dialogVisible = true
        let mSpcMeasurementStationId = selectObj.mSpcMeasurementStationId
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogForm.mSpcMeasurementStationId = mSpcMeasurementStationId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (mSpcMeasurementStationId) {
      let { selectList } = this
      let ids = mSpcMeasurementStationId ? [mSpcMeasurementStationId] : selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('measurStation_AreYouSureSurvStat'))
        if (confirm) {
          let res = await this.$api.deleteMeasurementStation(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning(this.$t('measurStation_selecSurvStatDele'))
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getTableData()
  }
}
</script>
