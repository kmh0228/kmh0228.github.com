<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini"  @click="saveData('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{$t('onsitecheck_OddNumb')}}{{unitNumber}}</span>
      <span class="status_class" style="margin-left:3vw">{{$t('onsitecheck_Statu')}}{{ checkState }}</span>
    </div>
   <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <el-form :model="infoData" :rules="rules" ref="infoForm"  label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
        <el-form-item :label="$t('common_PorN')"  prop="mComMaterialId" class="el-col el-col-7">
          <el-input :disabled="true" v-model="infoData.materialNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true" v-model="infoData.modelCode" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduUnit')" class="el-col el-col-7 el-col-offset-1">
          <el-select v-model="infoData.productionUnit" style="width:100%"  :disabled="true">
            <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_WorkOrde')" class="el-col el-col-7">
          <el-select v-model="infoData.tPomJobOrderId" style="width:100%"  :disabled="true">
            <el-option v-for="(option,i) in jobOrderList" :key="i" :label="option.DOC_NO" :value="option.T_POM_JOB_ORDER_ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_WorkOrdeQuan')" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true"  v-model="infoData.jobOrderQty"></el-input>
        </el-form-item>
        <el-form-item label="SN" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true" v-model="infoData.productSn" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Line')"  prop="mPomLineId" class="el-col el-col-7">
           <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="infoData.mPomLineId"  :disabled="true">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_Machi')" class="el-col el-col-7 el-col-offset-1">
           <!-- <el-select v-model="infoData.machineCode" style="width:100%"  :disabled="true">
            <el-option v-for="(option,i) in eqpList" :key="i" :label="option.machineCode" :value="option.eqpId"></el-option>
          </el-select> -->
          <mes-select v-model="infoData.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_posit')" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true"  v-model="infoData.location" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Shift')"  prop="mPomShiftId" class="el-col el-col-7">
          <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleClas')"  v-model="infoData.mPomShiftId"  :disabled="true">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_examiCler')"   prop="inspector" class="el-col el-col-7 el-col-offset-1">
           <mes-select v-model="infoData.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
       <el-form-item :label="$t('common_InspeDate')" prop="inspectDate"  class="el-col el-col-7 el-col-offset-1">
          <el-date-picker  v-model="infoData.inspectDate"  type="date" :placeholder="$t('common_SelecDateTime')" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common_InspeCate')" prop="inspectCategory" class="el-col el-col-7">
          <dict-select v-model="infoData.inspectCategory" dictType='QMS_CHECK-TYPE'  disabled></dict-select>
        </el-form-item>
        <el-form-item :label="$t('common_AbnorNotiPers')" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.excepNotice" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
      </el-form>
 </el-card>

  <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
    <div slot="header" class="clearfix">
    <span>{{$t('common_InspeRegRecord')}}</span>
    </div>
    <div class="mes-table" style="padding:20px">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <span style="margin-right:15px">{{$t('onsitecheck_InspeReguNo')}}</span>
          <el-input disabled size="mini" style="width:40%" v-model="sipNo"></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-right:15px">{{$t('onsitecheck_RevisInspRegu')}}</span>
          <el-input disabled size="mini" style="width:40%" v-model="sipVer"></el-input>
          </el-col>
      </el-row>
      <el-divider></el-divider>
       <div class="mes-table-content" v-for="(option,i) in tQomTourListVms" :key="i" style="margin-top:3vh">
       <div style="overflow:hidden;">
          <div class="table-header" style="float:left">
            <span> 巡检时间：</span>
            <el-time-select :placeholder="$t('common_StartTime')" v-model="option.timeFrom"  :picker-options="{start: setDefaultTime(i),  step: '00:30',  end: '24:00'}" size="mini"></el-time-select>
            <span>—</span>
            <el-time-select  :placeholder="$t('common_endTime')"  v-model="option.timeTo"  :picker-options="{start: setDefaultTime(i),  step: '00:30',  end: '24:00', minTime: option.timeFrom}" size="mini"></el-time-select>
        </div>
          <div class="table-header" style="float:right">
             <span style="padding-right:1vw">{{$t('onsitecheck_first')}} {{i+1}} {{$t('onsitecheck_Inspe')}}</span>
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deletetQomTourListVms(i)"></el-button>
        </div>
        </div>
        <el-table  :data="option.tQomTourDetailList" border size="mini" style="margin-top:1.5vh">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
          <el-table-column prop="inspectItem" :label="$t('common_AuditItem')" align="center"></el-table-column>
          <el-table-column prop="inspectContent" :label="$t('common_AuditCont')" align="center"></el-table-column>
          <el-table-column prop="spec" :label="$t('common_Speci')" align="center">
            <!-- <template slot-scope="scope" >
              <el-input v-model="scope.row.spec"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="defectImage" :label="$t('common_MapLoca')" align="center"></el-table-column>
          <el-table-column prop="inspectInfo" :label="$t('common_detecResu')" align="center">
            <template slot-scope="scope" >
                <!-- <span class="span_class" :contenteditable="true" @blur="spanChange(i,$event,scope.$index)">{{scope.row.inspectInfo}}</span> -->
                 <el-input v-model="scope.row.inspectInfo"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="inspectResult" :label="$t('common_JudgmResu')" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult">
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option" @click.native="dispatchNg(scope.row)"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button style="margin-top:1.5vh" @click="addtQomTourListVms">{{$t('common_add')}}</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="'ng'+$t('common_page')"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog" :detailId="detailId" @cannel="cannel"></ng-dialog>
  </el-dialog>
  </el-card>
</div>

</template>

<script>
import ngDialog from '../Components/ngDialog'
export default {
  data () {
    return {
      checkState: '',
      unitNumber: '',
      checkData: {
        id: '1'
      },
      infoData: {
        mComMaterialId: '',
        materialNo: '',
        modelCode: '',
        model: '',
        productionUnit: '',
        tPomJobOrderId: '',
        jobOrderQty: '',
        productSn: '',
        mPomLineId: '',
        machineCode: '',
        location: '',
        mPomShiftId: '',
        inspectDate: '',
        inspector: '',
        inspectCategory: '',
        excepNotice: ''
      },
      tableArray: [[], []],
      value1: '',
      productionUnitList: [],
      jobOrderList: [],
      lineList: [],
      shiftList: [],
      otherData: [],
      sipNo: '',
      sipVer: '',
      resultArray: ['OK', 'NG', this.$t('common_blank')],
      tQomTourListVms: [],
      dialogVisible: false,
      detailId: ''
    }
  },
  computed: {
    buttonDisabled () {
      return this.checkState === this.$t('common_Submitted')
    },
    rules () {
      return {
        mComMaterialId: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        mPomLineId: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        mPomShiftId: [{ required: true, message: this.$t('common_PleasSeleLineTy') }],
        inspector: [{ required: true, message: this.$t('onsitecheck_selecInsp') }],
        inspectCategory: [{ required: true, message: this.$t('onsitecheck_selecInspCate') }]
      }
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
        this.detailId = row.tQomTourDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.checkState = this.$route.query.status === 'DRAFT' ? this.$t('common_NotSubm') : this.$t('common_Submitted')
      this.unitNumber = this.$route.query.unitNumber
    },
    setDefaultTime (i) {
      return i === 0 ? '00:00' : this.tQomTourListVms[i - 1].timeTo
    },
    saveData (docStatus) {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          let { tQomTourListVms, tQomTourMainId } = this
          let data = Object.assign(this.infoData, { tQomTourListVms, tQomTourMainId })
          data.docStatus = docStatus
          let res = await this.$api.updateMainById(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    },
    async addtQomTourListVms () {
      let addListDetail = this.otherData
      let obj = {
        timeFrom: '',
        timeTo: '',
        timeSeq: '',
        tQomTourDetailList: addListDetail
      }
      this.tQomTourListVms.push(obj)
    },
    async deletetQomTourListVms (index) {
      let confirm = await this.$myPrompt.confirm(this.$t('onsitecheck_AreYouSurePatrReco'))
      if (confirm) {
        this.tQomTourListVms.splice(index, 1)
      }
    },
    closeCurrentPage () {
      this.$router.replace('/BasicData/Quality/OnSiteCheck')
    },
    // 设置默认数据
    async setDefaultData () {
      let tQomTourMainId = this.$route.query.id
      this.tQomTourMainId = tQomTourMainId
      let res = await this.$api.getMainAndDetailById({ tQomTourMainId })
      let arr = []
      for (let i in this.infoData) {
        arr.push(i)
      }
      arr.forEach(item => {
        this.infoData[item] = res.data[item]
      })
      this.sipVer = res.data.sipVer
      this.sipNo = res.data.sipNo
      this.tQomTourListVms = res.data.tourListDtoList
      this.setArray()
    },
    async  setArray () {
      let mComMaterialId = this.infoData.mComMaterialId
      let checkRes = await this.$api.getSipByMaterial({ mComMaterialId })
      if (checkRes.code === '200') {
        this.otherData = checkRes.data.tourDetailDtoList
      } else {
        this.otherData = []
      }
    },
    // 获取生产单位
    async getProductionUnit () {
      let res = await this.$api.getProductionUnit()
      this.productionUnitList = res.data
    },
    // 获取工单数据列表
    async getWorkOrderList () {
      let data = {
        orderStatus: '',
        keyWord: '',
        sortDes: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getJobOrdersByArg(data)
      this.jobOrderList = res.data.list
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    // 获取班别列表
    async getShiftList () {
      const data = {
        shiftName: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getShiftList(data)
      this.shiftList = res.data.list
    }
  },
  created () {
    this.setStatus()
    this.setDefaultData()
    this.getProductionUnit()
    this.getWorkOrderList()
    this.getLineData()
    this.getShiftList()
  },
  components: {
    ngDialog
  }
}
</script>

<style lang="scss">
.span_class {
  display: block;
  height: 100%;
  width: 100%;
}
.status_class {
  font-size: 1vw;
  margin-left: 20vw;
  color: #3b6f9a;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0;
  .el-form-item {
    width: 32%;
    margin-right: 1%;
  }
  .table-header {
    width: 50%;
  }
}
</style>
