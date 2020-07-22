<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">数据录入</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="请输入查询内容" style="width:35%;" v-model.trim="searchForm.keyWord" @keydown.enter.native="initData" size="mini"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter" @click="showMore = !showMore"></i>
        </el-button>
        <dict-select style="width:40%;float:right;" v-model="searchForm.itemStatus" placeholder="控制项状态" selectKey="dictCode" dictType="ControlItem_Status" clearable @change="selectChange"></dict-select>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
          <el-form-item label="产品系列" class="el-col el-col-12">
            <el-select v-model="searchForm.MComMaterialfamilyId" @change="selectChange" clearable  filterable style="width:100%;">
              <el-option v-for="option in productList" :key="option.mComMaterialfamilyId" :label="option.mComMaterialfamilyName" :value="option.mComMaterialfamilyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="控制项名称" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.itemCode" placeholder="请输入控制项名称"></el-input>
          </el-form-item>
          <el-form-item label="线别" class="el-col el-col-12">
            <el-select v-model="searchForm.MPomLineId" @change="selectChange" clearable filterable style="width:100%" >
              <el-option v-for="option in lineList" :key="option.mPomLineId" :value="option.mPomLineId" :label="option.lineName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="料号" class="el-col el-col-11 el-col-offset-1">
            <material-select v-model="searchForm.MComMaterialId" style="width:100%" @change="selectChange"></material-select>
          </el-form-item>
          <el-form-item label="控制图" class="el-col el-col-12">
            <dict-select style="width:100%;" v-model="searchForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode" @change="selectChange" clearable></dict-select>
          </el-form-item>
          <el-form-item label="模穴号/零件位置" class="el-col el-col-11 el-col-offset-1">
            <el-select v-model="searchForm.moldCavityNo" clearable @change="selectChange" filterable style="width:100%" >
              <el-option v-for="(item,i) in moldList" :key="i" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="initData">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
              @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" highlight-current-row>
          <el-table-column type="index" fixed="left" label="序号" align="center"></el-table-column>
          <el-table-column prop="officeName" label="部门" align="center" sortable></el-table-column>
          <el-table-column prop="itemCode" label="控制项名称" align="center" width="150" sortable></el-table-column>
          <el-table-column prop="itemDesc" label="控制项描述" align="center" width="180" sortable></el-table-column>
          <el-table-column prop="materialNo" label="料号" align="center"  width="120" sortable></el-table-column>
          <el-table-column prop="materialRev" label="料号版次" align="center" width="100" sortable></el-table-column>
          <el-table-column prop="materialfamilyCode" label="产品系列" width="100" align="center" sortable></el-table-column>
          <el-table-column prop="moldCavityNo" label="模穴号/零件位置" width="140" align="center" sortable></el-table-column>
          <el-table-column prop="lineCode" label="线别" width="110" align="center" sortable></el-table-column>
          <el-table-column prop="stationCode" label="测量站/实验室" width="140" align="center" sortable></el-table-column>
          <el-table-column prop="instrumentName" label="测量仪器" width="120" align="center" sortable></el-table-column>
          <el-table-column prop="controlChartType" label="控制图" width="100" align="center" sortable></el-table-column>
          <el-table-column prop="itemStatusName" label="管控状态" width="120" align="center" sortable></el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.submitStatus === '0'">
                <handle-button @click="enterData(scope.row)" iconClass='el-icon-edit-outline' tipText="数据录入"></handle-button>
                <handle-button @click="batchEnterData(scope.row)" iconClass='el-icon-upload' tipText="批量导入"></handle-button>
                <handle-button @click="submitData(scope.row.tSpcControlItemId)" iconClass='el-icon-upload2' tipText="提交"></handle-button>
              </div>
              <span v-else style="color:#E56048">暂不能操作</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  <el-dialog :visible.sync="dialogVisible" :title="'控制项信息'"  width="1000px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @confirm="confirm" @confirmAndClear="confirmAndClear" @cannel="cannel" :isEdit="isEdit" @getTableData="initData" ></dialog-form>
    <el-dialog
      width="50%"
      title="确认框"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="mes-table">
       <el-row class="mes-table-handle" style="margin:5px">
          <el-col :span="12">
            <label>测量日期</label>
            <el-date-picker  v-model="measurementDt" type="date" :disabled = "true" value-format="yyyy-MM-dd"> </el-date-picker>
          </el-col>
          <el-col :span="12">
            <label>子组编号</label>
            <el-input  v-model.trim="subgroupNo" :disabled = "true" size="mini" style="width:60%;">
            </el-input>
          </el-col>
        </el-row>
        <div class="mes-table-content">
          <el-table :data="sampleData" border size="mini" highlight-current-row>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="value" label="样本值" align="center"></el-table-column>
          </el-table>
        </div>
        <div style="color:red;margin:5px">确定保存后将无法修改数据，请再次确认数据正确性，无误请确定，或取消放弃添加</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">确 定</el-button>
        <el-button @click="innerVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
  <el-dialog :visible.sync="isUpload" title="批量导入" class="handle-dialog"  width="60vw">
      <el-form label-width="120px" label-position="left" class="el-row mes-form-rule">
        <el-form-item label="部门" prop="officeName" class="el-col el-col-11">
          <el-input v-model.trim="measurementInfo.officeName" :disabled="true" size="mini"></el-input>
        </el-form-item>
         <el-form-item label="控制项名称" prop="itemCode" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.itemCode" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="料号" prop="materialNo" class="el-col el-col-11">
          <el-input v-model.trim="measurementInfo.materialNo" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="料号版次" prop="materialRev" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.materialRev" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="测量站/实验室" prop="stationCode" class="el-col el-col-11">
          <el-input v-model.trim="measurementInfo.stationCode" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="线别" prop="lineCode" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.lineCode" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="模穴号/零件位置" prop="moldCavityNo" class="el-col el-col-11">
            <el-input v-model.trim="measurementInfo.moldCavityNo" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="控制图" prop="controlChartType" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.controlChartType" :disabled="true" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        style="text-align:center"  :before-upload="beforeUpload" drag action="">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
         <div class="el-upload__text" v-else>
          拖动文件至此处，<em>点击上传</em> 或
          <em><a href="static/download/MeasurementData.xlsx" style="color:#3B6F9A;text-decoration:none;" download="测量数据模版.xlsx" @click="downloadTemplate">模版下载</a></em>
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
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import paging from '@/mixins/paging'
export default {
  mixins: [paging],
  data () {
    return {
      productList: [],
      lineList: [],
      moldList: [],
      innerVisible: false,
      showMore: false,
      isUpload: false,
      isEdit: false,
      tableData: [],
      dialogVisible: false,
      fileName: '',
      fileContent: '',
      searchForm: {
        itemStatus: '',
        itemCode: '',
        MPomLineId: '',
        MComMaterialId: '',
        MComMaterialfamilyId: '',
        controlChartType: '',
        keyWord: '',
        moldCavityNo: ''
      },
      clear: false,
      sampleData: [],
      measurementInfo: {},
      measurementDt: '',
      subgroupNo: '',
      rules: {
      }
    }
  },
  computed: {

  },
  methods: {
    buttonDisabled (submitStatus) {
      return submitStatus === '1'
    },
    // 获取所有产品系列
    async getProductList () {
      const params = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getMachine(params)
      const { code, data } = res
      if (code === '200') {
        this.productList = data.list
      } else {
        this.productList = []
      }
    },
    // 获取所有线别
    async getAllLine () {
      const params = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getLineList(params)
      const { code, data } = res
      if (code === '200') {
        this.lineList = data.list
      } else {
        this.lineList = []
      }
    },
    // 获取模穴号/零件位置
    async getSpcMoldCavityNo () {
      const res = await this.$api.getSpcMoldCavityNo()
      const { code, data } = res
      if (code === '200') {
        this.moldList = data
      } else {
        this.moldList = []
      }
    },

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
    // 取消按钮停止上传
    downloadTemplate (event) {
      event.stopPropagation()
    },
    async saveData () {
      let result = {}
      result.measurementDt = this.measurementDt
      result.tSpcControlItemId = this.$refs.dialog.dialogForm.tSpcControlItemId
      result.items = this.sampleData
      let res = await this.$api.saveMeasurementData(result)
      let { code, msg, data } = res
      if (code === '200') {
        if (!data) {
          this.$confirm(msg, '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '取消'
          })
            .then(() => {
              result.overwrite = true
              this.$api.saveMeasurementData(result).then(res => {
                let { code, msg } = res
                if (code === '200') {
                  this.innerVisible = false

                  this.dialogVisible = this.clear
                  if (this.clear) {
                    this.sampleData = []
                    this.$refs.dialog.enterData.forEach(function (item) {
                      item.value = ''
                    })
                    this.$refs.dialog.dialogForm.measurementDt = ''
                  }
                  this.$message.success(msg)
                } else {
                  this.$message.error(msg)
                }
              })
            }).catch(action => {
              this.innerVisible = false
              this.$message({
                type: 'info',
                message: '取消成功'
              })
            })
        } else {
          this.innerVisible = false
          this.dialogVisible = this.clear
          if (this.clear) {
            this.sampleData = []
            this.$refs.dialog.enterData.forEach(function (item) {
              item.value = ''
            })
            this.$refs.dialog.dialogForm.measurementDt = ''
          }
          this.$message.success(msg)
        }
      } else {
        this.$message.error(msg)
      }
    },
    // 提交按钮 进行上传
    async importOnline () {
      const { fileContent } = this
      if (fileContent) {
        const data = new FormData()
        data.append('file', fileContent)
        const res = await this.$api.importMeasurementData(data)
        this.$myPrompt.handleMsg(res, () => {
          this.closeUploadDialog()
          this.initData()
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
    selectChange () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.initData()
    },
    async initData () {
      const { page, searchForm } = this
      const params = Object.assign(page, searchForm)
      const res = await this.$api.getSpcMeasureDateList(params)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.initData()
    },
    enterData (selectObj) {
      if (selectObj) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogForm.measurementDt = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
      }
    },
    // 提交数据
    async submitData (tSpcControlItemId) {
      let confirmRes = await this.$myPrompt.confirm(`确定提交该条数据吗？ 提交后不能在进行录入！`)
      if (confirmRes) {
        let res = await this.$api.submitMeasurementData({ tSpcControlItemId })
        this.$myPrompt.handleMsg(res, () => {
          this.initData()
        })
      }
    },
    batchEnterData (selectObj) {
      this.isUpload = true
      if (selectObj) {
        this.measurementInfo = selectObj
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    async confirm () {
      if (!this.$refs.dialog.dialogForm.measurementDt) {
        this.$message.warning('测量日期不能为空')
      }
      if (this.$refs.dialog.enterData) {
        let flag = false
        for (let i in this.$refs.dialog.enterData) {
          if (this.$refs.dialog.enterData[i].value === '') {
            flag = true
            break
          }
        }
        if (flag) {
          this.$message.warning('请先录入完数据')
          return
        }
        this.clear = false
        this.innerVisible = true
        this.sampleData = this.$refs.dialog.enterData
        this.measurementDt = this.$refs.dialog.dialogForm.measurementDt
        this.subgroupNo = this.$refs.dialog.dialogForm.tSpcControlItemId + '_' + this.measurementDt
      } else {
        this.$message.warning('测量数据有误')
      }
    },
    async confirmAndClear () {
      await this.confirm()
      this.clear = true
    }
  },
  components: {
    dialogForm,
    materialSelect
  },
  created () {
    this.getProductList()
    this.getAllLine()
    this.getSpcMoldCavityNo()
    this.initData()
  }
}
</script>
