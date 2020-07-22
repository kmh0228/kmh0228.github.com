<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">测量仪器管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select v-model="mSpcMeasurementStationId" clearable style="width:35%" placeholder="量测站/实验室" @change="getSpcInstrumentList">
          <el-option v-for="option in measurementStationList" :key="option.mSpcMeasurementStationId" :label="option.stationCode" :value="option.mSpcMeasurementStationId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入查询内容" v-model.trim="keywords" style="width:40%;float:right;" @keydown.enter.native="getSpcInstrumentList">
          <i slot="suffix" class="el-input__icon" @click="getSpcInstrumentList"></i>
        </el-input>
      </el-col>
    </el-row>
     <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getSpcInstrumentList">查询</el-button>
         <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDialog('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteSpcInstrument('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="importDialog=true">批量导入</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getSpcInstrumentList">刷新</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border size="mini" @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="stationCode" sortable label="量测站/实验室" align="center"></el-table-column>
        <el-table-column prop="instrumentName" sortable label="测量仪器" align="center"></el-table-column>
        <el-table-column prop="precision" sortable label="仪器精度" align="center"></el-table-column>
        <el-table-column prop="uom" sortable label="测量单位" align="center" width="100"></el-table-column>
        <el-table-column prop="instrumentDesc" sortable label="描述" align="center"></el-table-column>
        <el-table-column prop="lastEditor" sortable label="最后维护人" align="center" width="110"></el-table-column>
        <el-table-column prop="lastEditedDt" sortable label="最后维护时间" align="center" :formatter="formatterDate"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <handle-button iconClass='el-icon-edit-outline' tipText="编辑" @click="handleDialog(scope.row)"></handle-button>
            <handle-button iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c' @click="deleteSpcInstrument(scope.row.mSpcMeasurementInstrumentId)"></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/编辑测量仪器表单 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible = false" :isEdit="isEdit" :measurementStationList="measurementStationList" @getSpcInstrumentList="getSpcInstrumentList"></dialog-form>
    </el-dialog>
    <!-- 导入测量仪器 -->
    <el-dialog title="请选择需要导入的测量仪器文件" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          拖动文件至此处，<em>点击上传</em> 或
          <em><a href="static/download/Instrument.xlsx" style="color:#3B6F9A;text-decoration:none;" download="测量仪器模板.xlsx" @click="downloadTemplate">模版下载</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importSpcInstrument">确 定</el-button>
        <el-button @click="closeUploadDialog">取 消</el-button>
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
      return this.isEdit ? '编辑测量仪器' : '新增测量仪器'
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
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的测量仪器吗？')
        if (confirm) {
          const res = await this.$api.deleteSpcInstrument(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getSpcInstrumentList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的测量仪器！')
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
        this.$message.warning('文件类型必须是excel格式!')
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
        this.$message.warning('请先上传需要导入的测量仪器！')
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
