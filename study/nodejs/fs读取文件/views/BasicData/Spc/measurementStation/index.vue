<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">测量站管理</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input size="mini" v-model="searchForm.keyWord" style="width:35%;" placeholder="请输入查询内容" @keydown.enter.native="getTableData"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getTableData">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handletable('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid"  @click="deleteTable('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="isUpload = true">批量导入</el-button>
          <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="getTableData">刷新</el-button>
        </el-col>
      </el-row>
       <div class="mes-table-content">
      <el-table :data="tableData" border size="mini" highlight-current-row @selection-change="tableSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="stationCode" label="测量站/实验室" align="center" sortable></el-table-column>
        <el-table-column prop="stationDesc" label="描述" align="center" sortable></el-table-column>
        <el-table-column prop="lastEditor" label="最后维护人" align="center" sortable></el-table-column>
        <el-table-column prop="lastEditedDt" label="最后维护时间" align="center" :formatter="formatterDate" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteTable(scope.row.mSpcMeasurementStationId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
      </el-table-column>
      </el-table>
    </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="500px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getTableData="getTableData" ></dialog-form>
  </el-dialog>
  <el-dialog :visible.sync="isUpload" title="请选择需要导入的文件" class="handle-dialog"  width="30vw">
        <el-upload
        style="text-align:center"  :before-upload="beforeUpload" drag action="">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
         <div class="el-upload__text" v-else>
          拖动文件至此处，<em>点击上传</em> 或
          <em><a href="static/download/MeasurementStation.xlsx" style="color:#3B6F9A;text-decoration:none;" download="测量站模版.xls" @click="downloadTemplate">模版下载</a></em>
        </div>
      </el-upload>
       <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importOnline">确 定</el-button>
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
      return this.isEdit ? '编辑测量站' : '新增测量站'
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
        this.$message.warning('文件类型必须是excel格式!')
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
        this.$message.warning('请上传需要导入的文件！')
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
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的测量站吗？')
        if (confirm) {
          let res = await this.$api.deleteMeasurementStation(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning('请选择要删除的测量站')
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
