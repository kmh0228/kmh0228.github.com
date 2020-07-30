<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{$t('firstCheck_OddNumb')}}{{unitNumber}}</span>
      <span class="status_class" style="margin-left:3vw">{{$t('firstCheck_Statu')}}{{ firstCheckState }}</span>
    </div>
   <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
        <el-form-item :label="$t('common_PorN')"  prop="mComMaterialId" class="el-col el-col-7">
          <el-input :disabled="true" v-model="infoData.materialNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true" v-model="infoData.modelCode" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduUnit')" class="el-col el-col-7 el-col-offset-1" >
          <el-select v-model="infoData.productionUnit" style="width:100%" :disabled="true">
            <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_WorkOrde')" class="el-col el-col-7">
          <el-select v-model="infoData.tPomJobOrderId" style="width:100%" :disabled="true">
            <el-option v-for="(option,i) in jobOrderList" :key="i" :label="option.DOC_NO" :value="option.T_POM_JOB_ORDER_ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_WorkOrdeQuan')" class="el-col el-col-7 el-col-offset-1">
          <el-input :disabled="true"  v-model="infoData.jobOrderQty"></el-input>
        </el-form-item>
        <el-form-item label="SN" class="el-col el-col-7 el-col-offset-1">
          <el-input :disabled="true" v-model="infoData.productSn" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Line')"  prop="mPomLineId" class="el-col el-col-7">
           <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="infoData.mPomLineId" :disabled="true">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_Machi')" class="el-col el-col-7 el-col-offset-1">
           <!-- <el-select v-model="infoData.machineCode" style="width:100%" :disabled="true">
            <el-option v-for="(option,i) in eqpList" :key="i" :label="option.machineCode" :value="option.eqpId"></el-option>
          </el-select> -->
          <mes-select v-model="infoData.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_posit')" class="el-col el-col-7 el-col-offset-1" :disabled="true">
          <el-input  :disabled="true" v-model="infoData.location" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Shift')"  prop="mPomShiftId" class="el-col el-col-7" :disabled="true">
          <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleClas')"  v-model="infoData.mPomShiftId" :disabled="true">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_examiCler')"   prop="inspector" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_InspeCate')"  prop="inspectCategory" class="el-col el-col-7 el-col-offset-1">
          <dict-select :disabled="true" v-model="infoData.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
        </el-form-item>
        <el-form-item :label="$t('common_InspeDate')" class="el-col el-col-7">
           <el-date-picker  v-model="infoData.inspectDate"  type="date" :placeholder="$t('common_SelecDateTime')" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
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
          <span style="margin-right:15px">{{$t('firstCheck_InspeReguNo')}}</span>
          <el-input :disabled="true" v-model="sipNo" size="mini" style="width:40%"></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-right:15px">{{$t('firstCheck_RevisInspRegu')}}</span>
          <el-input :disabled="true" v-model="sipVer" size="mini" style="width:40%"></el-input>
          </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="checkData" border size="mini">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
          <el-table-column prop="inspectItem" :label="$t('common_AuditItem')" align="center"></el-table-column>
          <el-table-column prop="inspectContent"  :label="$t('common_AuditCont')" align="center"></el-table-column>
          <el-table-column prop="spec"  :label="$t('common_Speci')" align="center"></el-table-column>
          <el-table-column prop="defectImage"  :label="$t('common_MapLoca')" align="center">
            <!-- <template slot-scope="scope" >
              <el-input v-model="scope.row.defectImage"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column  prop="inspectInfo" :label="$t('common_detecResu')" align="center">
            <template slot-scope="scope" >
              <el-input v-model="scope.row.inspectInfo"></el-input>
                <!-- <span class="span_class" :contenteditable="true" @blur="spanChange($event,scope.$index)">{{scope.row.inspectInfo}}</span> -->
            </template>
          </el-table-column>
           <el-table-column  prop="inspectResult" :label="$t('common_JudgmResu')" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult"  >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"  @click.native="dispatchNg(scope.row)"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
  <el-dialog :visible.sync="dialogVisible" :title="'ng'+$t('common_page')"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog" :detailId="detailId" @cannel="cannel"></ng-dialog>
  </el-dialog>
</div>

</template>

<script>
import ngDialog from '../Components/ngDialog'

export default {
  data () {
    return {
      firstCheckState: '',
      unitNumber: '',
      checkData: [],
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
      sipNo: '',
      sipVer: '',
      productionUnitList: [],
      jobOrderList: [],
      lineList: [],
      shiftList: [],
      rules: {
        mComMaterialId: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        mPomLineId: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        mPomShiftId: [{ required: true, message: this.$t('common_PleasSeleLineTy') }],
        inspector: [{ required: true, message: this.$t('firstCheck_selecInsp') }]
      },
      tQomFaiMainId: '',
      resultArray: ['OK', 'NG', this.$t('common_blank')],
      dialogVisible: false,
      detailId: ''
    }
  },
  computed: {
    buttonDisabled () {
      return this.firstCheckState === this.$t('common_Submitted')
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
        this.detailId = row.tQomFaiDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.firstCheckState = this.$route.query.status === 'DRAFT' ? this.$t('common_NotSubm') : this.$t('common_Submitted')
      this.unitNumber = this.$route.query.unitNumber
    },
    async  saveData (docStatus) {
      let data = this.infoData
      data.detailVmList = this.checkData
      data.sipNo = this.sipNo
      data.sipVer = this.sipVer
      data.docStatus = docStatus
      data.tqomFaiMainId = this.tQomFaiMainId
      let res = await this.$api.updateMainAndDetailCheck(data)
      this.$myPrompt.handleMsg(res, () => {
        this.closeCurrentPage()
      })
    },
    async  setDefaultData () {
      this.tQomFaiMainId = this.$route.query.id
      let { tQomFaiMainId } = this
      let res = await this.$api.getInfoAndDetailCheck({ tQomFaiMainId })
      let { infoData } = this
      let arr = []
      for (let i in infoData) {
        arr.push(i)
      }
      arr.forEach(item => {
        infoData[item] = res.data[item]
      })
      this.sipVer = res.data.sipVer
      this.sipNo = res.data.sipNo
      this.checkData = res.data.detailList
    },
    closeCurrentPage () {
      this.$router.replace('/BasicData/Quality/FirstCheck')
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
    // spanChange (e, index) {
    //   this.checkData[index].inspectInfo = e.target.innerHTML
    // }
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
</style>
