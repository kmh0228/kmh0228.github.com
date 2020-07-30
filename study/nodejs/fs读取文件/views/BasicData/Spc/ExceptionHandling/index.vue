<template>
  <div class="mes-main mes-work-order">
    <a href id="downloadFile" download style="visibility: hidden;"></a>
  <div class="mes-main-title">{{$t('exceptHand_CountForAbnoHand')}}</div>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="16">
      <el-select v-model="searchForm.alertStatus"  @change="selectChange" style="width:30%;">
        <el-option :value="$t('exceptHand_Pendi')" :label="$t('exceptHand_Pendi')"></el-option>
        <el-option :value="$t('exceptHand_Proce')"  :label="$t('exceptHand_Proce')"></el-option>
      </el-select>
      <el-date-picker
        style="width:60%;"
        v-model="timeArr"
        type="daterange"
        :range-separator="$t('common_to')"
        start-:placeholder="$t('common_StartDate')"
        end-:placeholder="$t('common_EndDate')"
        value-format="yyyy-MM-dd"
        @change="selectChange">
      </el-date-picker>
    </el-col>
    <el-col :span="8">
      <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
        <i class="fa fa-filter"></i>
      </el-button>
      <el-input size="mini" :placeholder="$t('common_PleasEnteQuerCo')" v-model="searchForm.keyWord" style="width:60%;float:right;" @keydown.enter.native="selectChange">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="selectChange"></i>
      </el-input>
    </el-col>
    <el-col :span="24" style="padding-top:1vh;" v-show="showMoreConditon">
      <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
        <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11">
          <mes-select v-model="searchForm.MComMaterialfamilyId" method="getMachine" labelKey="mComMaterialfamilyName" valueKey="mComMaterialfamilyId" ></mes-select>
        </el-form-item>
         <el-form-item :label="$t('common_ContrName')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="searchForm.itemCode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Line')" prop="MPomLineId" class="el-col el-col-11 ">
          <mes-select v-model="searchForm.MPomLineId" method="getLineList" labelKey="lineName" valueKey="mPomLineId"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_PorN')" class="el-col el-col-11 el-col-offset-1">
          <material-select v-model="searchForm.MComMaterialId" style="width:100%" ></material-select>
        </el-form-item>
        <el-form-item :label="$t('common_ContrChar')" class="el-col el-col-11 ">
          <dict-select style="width:100%;" v-model="searchForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode"  clearable></dict-select>
        </el-form-item>
        <el-form-item :label="$t('common_MouldHoleNumb')" class="el-col el-col-11 el-col-offset-1">
          <el-select v-model="searchForm.moldCavityNo" clearable filterable style="width:100%">
            <el-option v-for="(item,i) in moldList" :key="i" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
     </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12" >
        <el-button icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button @click="showExceptionHandling">{{$t('exceptHand_handl')}}</el-button>
        <!-- <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-download" @click="exportAccessories">{{$t('common_Export')}}</el-button> -->
      </el-col>
      <el-col :span="12" >
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center" fixed ></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed></el-table-column>
        <el-table-column prop="dept" sortable :label="$t('common_Department')" align="center"></el-table-column>
        <el-table-column prop="itemCode" sortable :label="$t('common_ContrName')" align="center" width="150">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor: pointer;" @click="viewControlChart(scope.row.tSpcControlItemId)">
              {{scope.row.itemCode}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="itemDesc" sortable :label="$t('common_ContrDesc')" align="center" width="180"></el-table-column>
        <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center" width="120"></el-table-column>
        <el-table-column prop="materialRev" sortable :label="$t('common_ItemNoRev')" align="center" width="100"></el-table-column>
        <el-table-column prop="moldCavityNo" sortable :label="$t('common_MouldHoleNumb')" align="center" width="160"></el-table-column>
        <el-table-column prop="lineCode" sortable :label="$t('common_Line')" align="center"></el-table-column>
        <el-table-column prop="exceptionValue" sortable :label="$t('exceptHand_Outli')" align="center" width="120"></el-table-column>
        <el-table-column prop="exceptionDesc" sortable :label="$t('exceptHand_ExcepDesc')" align="center" width="120"></el-table-column>
        <el-table-column prop="alertDt" sortable :label="$t('exceptHand_AlarmTime')" align="center" width="120"></el-table-column>
        <el-table-column prop="receiver" sortable :label="$t('exceptHand_PolicRece')" align="center" width="120"></el-table-column>
        <el-table-column prop="alertStatus" sortable :label="$t('exceptHand_AbnorStat')" align="center" width="120"></el-table-column>
        <el-table-column :label="$t('common_enclo')" align="center"  width="80" fixed="right">
          <template slot-scope="scope">
            <handle-button  iconClass='el-icon-paperclip' :placeholder="$t('common_enclo')" @click="downloadFile(scope.row.attachmentId)" v-if="scope.row.attachmentId"></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="$t('exceptHand_handl')"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form :model="popForm" :rules="rules"  ref="popForm" label-width="100px" label-position="left" class="el-row mes-form-rule" >
        <el-form-item :label="$t('exceptHand_ExcepType')" prop="exceptionType">
          <dict-select style="width:100%;" v-model="popForm.exceptionType" dictType="SPC_EXC_TYPE" selectKey="dictCode" clearable></dict-select>
        </el-form-item>
         <el-form-item :label="$t('exceptHand_CauseAndCoun')" prop="alertResult">
          <el-input type="textarea" :rows="3" v-model="popForm.alertResult" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_enclo')" >
          <upload-file ref="uploadFile" fileType=" " :defaultFileArr="[]"></upload-file>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('common_cancel')}}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitProcessing">{{$t('exceptHand_ConfiSubm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import uploadFile from '@/components/Module/uploadFile'

export default {
  data () {
    return {
      timeArr: [],
      dialogVisible: false,
      submitLoading: false,
      searchForm: {
        alertStatus: this.$t('exceptHand_Pendi'),
        keyWord: '',
        itemCode: '',
        MComMaterialfamilyId: '',
        MPomLineId: '',
        MComMaterialId: '',
        controlChartType: '',
        moldCavityNo: ''
      },
      popForm: {
        alertResult: '',
        exceptionType: ''
      },
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      // productList: [],
      // lineList: [],
      moldList: [],
      tableData: [],
      selectList: []
    }
  },
  computed: {
    rules () {
      return {
        exceptionType: [{ required: true, message: this.$t('exceptHand_selecExceType') }],
        alertResult: [{ required: true, message: this.$t('exceptHand_CauseCounCannBeEmpt') }]
      }
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 下载附件
    async downloadFile (id) {
      const res = await this.$api.getFileData(id)
      let { code, data } = res
      if (code === '200') {
        let a = this.$el.querySelector('#downloadFile')
        a.href = data.fileFullPath
        a.download = data.fileName
        a.click()
      }
    },
    // 提交
    submitProcessing () {
      this.$refs['popForm'].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          let fileList = this.$refs.uploadFile.getFileData()
          const formData = new FormData()
          let recordId = this.selectList[0] || ''
          formData.append('alertResult', this.popForm.alertResult)
          formData.append('exceptionType', this.popForm.exceptionType)
          formData.append('recordId', recordId)
          formData.append('file', fileList.length ? fileList[0].raw : '')

          const res = await this.$api.ExceptionHandling(formData)
          if (res.code === '200') {
            this.submitLoading = false
            this.dialogVisible = false
            this.getTableData()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    selectChange () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getTableData()
    },
    showExceptionHandling () {
      if (!this.selectList.length) {
        this.$message.warning(this.$t('exceptHand_selecAnItemProc'))
        return false
      }
      if (this.selectList.length > 1) {
        this.$message.warning(this.$t('exceptHand_OnlySingProcIsSupp'))
        return false
      }
      this.dialogVisible = true
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
    async getTableData () {
      let { page, searchForm } = this
      let data = Object.assign(searchForm, page)
      data.startDate = this.timeArr && this.timeArr.length ? this.timeArr[0] : ''
      data.endDate = this.timeArr && this.timeArr.length ? this.timeArr[1] : ''
      const res = await this.$api.getExceptionHandlingList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    tableSelectionChange (selection) {
      this.selectList = selection.map(item => item.recordId)
    },
    viewControlChart (tSpcControlItemId) {
      this.$router.push(`/ControlChart/Home/Control?id=${tSpcControlItemId}`)
    },
    exportAccessories () {
      console.log(this.$t('exceptHand_ExporAtta'))
    }
  },
  created () {
    // this.getProductList()
    this.getSpcMoldCavityNo()
    this.getTableData()
  },
  components: {
    materialSelect,
    uploadFile
  }

}
</script>
