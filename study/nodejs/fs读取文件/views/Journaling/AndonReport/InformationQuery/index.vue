<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">{{$t('inFormatQ_AlarmInfoQuer')}}</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
    </el-col>
    <el-col :span="12">
      <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
      </el-button>
       <el-select style="float:right;width:35%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="searchForm.mPomLineId">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
       </el-select>
    </el-col>
    <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('inFormatQ_AlarmType') + ' :'" class="el-col el-col-11" >
            <el-select style="width:100%" v-model="searchForm.mAlmTypeId" @focus="getAlarmType">
              <el-option v-for="(option,i) in alarmList" :key="i" :label="option.typeName" :value="option.mAlmTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('inFormatQ_AlarmStat') + ':'"   class="el-col el-col-11 el-col-offset-2">
            <el-input size="mini" v-model="searchForm.almStatus"></el-input>
          </el-form-item>
          <el-form-item :label="$t('inFormatQ_StartAndEndTimeAlar') + ' :'" class="el-col el-col-11">
            <el-date-picker  v-model="dateList"  type="daterange"  :range-separator="$t('common_to')"  start-:placeholder="$t('common_StartDate')" value-format="yyyy-MM-dd 00:00:00"  end-:placeholder="$t('common_EndDate')" style="width:100%"> </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-close" @click="colseDataStatus">{{$t('common_close')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon=" el-icon-delete-solid" @click="deleteTable('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange" @cell-click="cellClick">
        <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="officeName" sortable :label="$t('common_Factory')" align="center"  width="120"></el-table-column>
        <el-table-column prop="lineName" sortable :label="$t('common_Line')" align="center" width="120"></el-table-column>
        <el-table-column prop="typeName" sortable :label="$t('inFormatQ_AlarmNumb')" align="center" width="100"></el-table-column>
        <el-table-column prop="almStatus" sortable :label="$t('inFormatQ_AlarmStat')" align="center" width="100"></el-table-column>
        <el-table-column prop="typeName" sortable :label="$t('inFormatQ_AlarmType')" align="center" width="100"></el-table-column>
        <el-table-column prop="failName" sortable :label="$t('common_AlarmProb')" align="center" width="100"></el-table-column>
        <el-table-column prop="almLevel" sortable :label="$t('inFormatQ_SeverLeve')" align="center" width="100"></el-table-column>
        <el-table-column prop="almIp" sortable :label="$t('inFormatQ_AlarmTermIP')" align="center" width="110"></el-table-column>
        <el-table-column prop="createdDt" sortable :label="$t('inFormatQ_AlarmTime')" align="center" width="150"></el-table-column>
        <el-table-column prop="employeeName" sortable :label="$t('inFormatQ_Polic')" align="center" width="100"></el-table-column>
        <el-table-column prop="remark" sortable :label="$t('common_remarks')" width="120" align="center"></el-table-column>
        <el-table-column prop="reponseLength" sortable :label="$t('inFormatQ_RespoTimeMin')" align="center" width="130"></el-table-column>
        <el-table-column prop="handleLength" sortable :label="$t('inFormatQ_ProceTimeMin')" align="center" width="130"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <!-- <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button> -->
            <handle-button @click="deleteTable(scope.row.mAlmAlarmlistId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
   <div class="mes-main-tabs" v-if="dataDetail">
      <el-tabs v-model="activeName" >
      <el-tab-pane :label="$t('inFormatQ_ProceReco')" name="processRecord">
          <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12" style="float:right">
                <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                    layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                  @current-change="handleCurrentChange1"   @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
             <div class="mes-table-content">
              <el-table :data="checkDetailData" border highlight-current-row size="mini">
                <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
                <el-table-column prop="workItem" sortable :label="$t('inFormatQ_WorkCont')" align="center"></el-table-column>
                <el-table-column prop="employeeName" sortable :label="$t('common_opera')" align="center"></el-table-column>
                <el-table-column prop="operateTime" sortable :label="$t('inFormatQ_OperaTime')" align="center" :formatter="dateFormatter"></el-table-column>
                <el-table-column prop="failReason" sortable :label="$t('inFormatQ_AbnorCaus')" align="center"></el-table-column>
                <el-table-column prop="remark" sortable :label="$t('common_remarks')" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
      </el-tab-pane>
    </el-tabs>
   </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      isEdit: false,
      tableData: [],
      checkDetailData: [],
      dialogVisible: false,
      searchForm: {
        officeCode: '',
        mPomLineId: '',
        mAlmTypeId: '',
        almStatus: '',
        startTime: '',
        endTime: ''
      },
      selectList: [],
      showMoreConditon: false,
      lineList: [],
      dateList: [],
      dataDetail: false,
      activeName: 'processRecord',
      alarmList: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (size) {
      this.page1.pageSize = size
      this.getAlmDetailListById()
    },
    handleSizeChange1 (index) {
      this.page1.pageIndex = index
      this.getAlmDetailListById()
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      } else {
        this.lineList = []
      }
    },
    // 获取报警类型
    async getAlarmType () {
      let { officeCode } = this.searchForm
      if (officeCode) {
        const data = {
          officeCode: officeCode,
          pageIndex: 1,
          pageSize: 1000
        }
        let res = await this.$api.getAlarmType(data)
        if (res.code === '200') {
          this.alarmList = res.data.list
        } else {
          this.alarmList = []
        }
      } else {
        this.$message.warning(this.$t('inFormatQ_selecFactFirs'))
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mAlmAlarmlistId)
      })
    },
    cellClick (row, column, cellValue, index) {
      this.dataDetail = true
      this.getAlmDetailListById(row.mAlmAlarmlistId)
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    async getTableData () {
      let { searchForm, page, dateList } = this
      searchForm.startTime = dateList[0] || ''
      searchForm.endTime = dateList[1] || ''
      const params = Object.assign(searchForm, page)
      const res = await this.$api.findAllAlmList(params)
      this.$myPrompt.handleMsg(res, data => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    refreshPage () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.dateList = []
      this.getTableData()
    },
    // 获取处理记录信息
    async getAlmDetailListById (mAlmAlarmlistId) {
      let { page1 } = this
      const data = Object.assign(page1, { mAlmAlarmlistId })
      let res = await this.$api.getAlmDetailListById(data)
      if (res.code === '200') {
        this.checkDetailData = res.data.list
        this.total1 = res.data.totalNum
      } else {
        this.checkDetailData = []
        this.total1 = 0
      }
    },
    // 关闭状态
    async colseDataStatus () {
      let { selectList } = this
      if (selectList.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('inFormatQ_AreYouSureSAlarInfo'))
        if (confirm) {
          let res = await this.$api.updateAlmStatus(selectList)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning(this.$t('inFormatQ_selecAlarInfoClosFirs'))
      }
    },
    // 删除报警信息
    async deleteTable (mAlmAlarmlistId) {
      let { selectList } = this
      let ids = mAlmAlarmlistId ? [mAlmAlarmlistId] : selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('inFormatQ_AreYouSureDAlarInfo'))
        if (confirm) {
          let res = await this.$api.deleteAlmStatus(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning(this.$t('inFormatQ_selecAlarInfoBeDele'))
      }
    }

  },
  created () {
    let { mPomLineId, sDate, eDate } = this.$route.query
    if (this.$route.query.mPomLineId) {
      this.searchForm.mPomLineId = mPomLineId
      this.dateList = [sDate, eDate]
    }
    this.getTableData()
    this.getLineData()
  }
}
</script>
