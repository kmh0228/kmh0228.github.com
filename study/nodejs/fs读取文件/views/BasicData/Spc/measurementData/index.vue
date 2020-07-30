<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('measureMD_DataEntr')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('common_PleasEnteQuerCo')" style="width:35%;" v-model.trim="searchForm.keyWord" @keydown.enter.native="initData" size="mini"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter" @click="showMore = !showMore"></i>
        </el-button>
        <dict-select style="width:40%;float:right;" v-model="searchForm.itemStatus" :placeholder="$t('measureMD_ContrStatItem')" selectKey="dictCode" dictType="ControlItem_Status" clearable @change="selectChange"></dict-select>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-12">
            <el-select v-model="searchForm.MComMaterialfamilyId" @change="selectChange" clearable  filterable style="width:100%;">
              <el-option v-for="option in productList" :key="option.mComMaterialfamilyId" :label="option.mComMaterialfamilyName" :value="option.mComMaterialfamilyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_ContrName')" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.itemCode" :placeholder="$t('measureMD_enterAContName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_Line')" class="el-col el-col-12">
            <el-select v-model="searchForm.MPomLineId" @change="selectChange" clearable filterable style="width:100%" >
              <el-option v-for="option in lineList" :key="option.mPomLineId" :value="option.mPomLineId" :label="option.lineName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_PorN')" class="el-col el-col-11 el-col-offset-1">
            <material-select v-model="searchForm.MComMaterialId" style="width:100%" @change="selectChange"></material-select>
          </el-form-item>
          <el-form-item :label="$t('common_ContrChar')" class="el-col el-col-12">
            <dict-select style="width:100%;" v-model="searchForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode" @change="selectChange" clearable></dict-select>
          </el-form-item>
          <el-form-item :label="$t('common_MouldHoleNumb')" class="el-col el-col-11 el-col-offset-1">
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
          <el-button size="mini" icon="el-icon-search" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
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
          <el-table-column type="index" fixed="left" :label="$t('common_Number')" align="center"></el-table-column>
          <el-table-column prop="officeName" :label="$t('common_Department')" align="center" sortable></el-table-column>
          <el-table-column prop="itemCode" :label="$t('common_ContrName')" align="center" width="150" sortable></el-table-column>
          <el-table-column prop="itemDesc" :label="$t('common_ContrDesc')" align="center" width="180" sortable></el-table-column>
          <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center"  width="120" sortable></el-table-column>
          <el-table-column prop="materialRev" :label="$t('common_ItemNoRev')" align="center" width="100" sortable></el-table-column>
          <el-table-column prop="materialfamilyCode" :label="$t('common_ProduSeries')" width="100" align="center" sortable></el-table-column>
          <el-table-column prop="moldCavityNo" :label="$t('common_MouldHoleNumb')" width="140" align="center" sortable></el-table-column>
          <el-table-column prop="lineCode" :label="$t('common_Line')" width="110" align="center" sortable></el-table-column>
          <el-table-column prop="stationCode" label="测量站/实验室" width="140" align="center" sortable></el-table-column>
          <el-table-column prop="instrumentName" :label="$t('common_MeasuInst')" width="120" align="center" sortable></el-table-column>
          <el-table-column prop="controlChartType" :label="$t('common_ContrChar')" width="100" align="center" sortable></el-table-column>
          <el-table-column prop="itemStatusName" :label="$t('measureMD_ContrStat')" width="120" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" fixed="right" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.submitStatus === '0'">
                <handle-button @click="enterData(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('measureMD_DataEntr')"></handle-button>
                <handle-button @click="batchEnterData(scope.row)" iconClass='el-icon-upload' :placeholder="$t('measureMD_BatchImpo')"></handle-button>
                <handle-button @click="submitData(scope.row.tSpcControlItemId)" iconClass='el-icon-upload2' :placeholder="$t('common_Submit')"></handle-button>
              </div>
              <span v-else style="color:#E56048">{{$t('measureMD_UnablOperTemp')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  <el-dialog :visible.sync="dialogVisible" :title="this.$t('measureMD_ContrInfo')"  width="1000px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @confirm="confirm" @confirmAndClear="confirmAndClear" @cannel="cannel" :isEdit="isEdit" @getTableData="initData" ></dialog-form>
    <el-dialog
      width="50%"
      :title="$t('measureMD_ConfiBox')"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="mes-table">
       <el-row class="mes-table-handle" style="margin:5px">
          <el-col :span="12">
            <label>{{$t('measureMD_DateMeas')}}</label>
            <el-date-picker  v-model="measurementDt" type="date" :disabled = "true" value-format="yyyy-MM-dd"> </el-date-picker>
          </el-col>
          <el-col :span="12">
            <label>{{$t('measureMD_SubgrNumb')}}</label>
            <el-input  v-model.trim="subgroupNo" :disabled = "true" size="mini" style="width:60%;">
            </el-input>
          </el-col>
        </el-row>
        <div class="mes-table-content">
          <el-table :data="sampleData" border size="mini" highlight-current-row>
            <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
            <el-table-column prop="value" :label="$t('measureMD_SamplValu')" align="center"></el-table-column>
          </el-table>
        </div>
        <div style="color:red;margin:5px">{{$t('measureMD_ConfiThatDataDiscAddi')}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">{{$t('common_ok')}}</el-button>
        <el-button @click="innerVisible = false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
  <el-dialog :visible.sync="isUpload" :title="$t('measureMD_BatchImpo')" class="handle-dialog"  width="60vw">
      <el-form label-width="120px" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('common_Department')" prop="officeName" class="el-col el-col-11">
          <el-input v-model.trim="measurementInfo.officeName" :disabled="true" size="mini"></el-input>
        </el-form-item>
         <el-form-item :label="$t('common_ContrName')" prop="itemCode" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.itemCode" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_PorN')" prop="materialNo" class="el-col el-col-11">
          <el-input v-model.trim="measurementInfo.materialNo" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ItemNoRev')" prop="materialRev" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.materialRev" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="测量站/实验室" prop="stationCode" class="el-col el-col-11">
          <el-input v-model.trim="measurementInfo.stationCode" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Line')" prop="lineCode" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.lineCode" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_MouldHoleNumb')" prop="moldCavityNo" class="el-col el-col-11">
            <el-input v-model.trim="measurementInfo.moldCavityNo" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ContrChar')" prop="controlChartType" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="measurementInfo.controlChartType" :disabled="true" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        style="text-align:center"  :before-upload="beforeUpload" drag action="">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
         <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/MeasurementData.xlsx" style="color:#3B6F9A;text-decoration:none;" :download="$t('measureMD_MeasuDataTemp') + '.xlsx'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
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
        this.$message.warning(this.$t('measureMD_fileTypeExcel'))
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
          this.$confirm(msg, this.$t('measureMD_ConfiInfo'), {
            distinguishCancelAndClose: true,
            confirmButtonText: this.$t('common_save'),
            cancelButtonText: this.$t('common_cancel')
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
                message: this.$t('measureMD_CanceSucc')
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
        this.$message.warning(this.$t('measureMD_uploaFileBeImpo'))
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
      let confirmRes = await this.$myPrompt.confirm(this.$t('measureMD_AreYouSureSubmData') + ' ' + this.$t('measureMD_YouCannEnteAfteSubm'))
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
        this.$message.warning(this.$t('measureMD_MeasuDateCannBeEmpt'))
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
          this.$message.warning(this.$t('measureMD_inputDataFirs'))
          return
        }
        this.clear = false
        this.innerVisible = true
        this.sampleData = this.$refs.dialog.enterData
        this.measurementDt = this.$refs.dialog.dialogForm.measurementDt
        this.subgroupNo = this.$refs.dialog.dialogForm.tSpcControlItemId + '_' + this.measurementDt
      } else {
        this.$message.warning(this.$t('measureMD_MeasuDataErro'))
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
