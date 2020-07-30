<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary"  plain size="mini" @click="saveData('UN_REGISTER')" :disabled="buttonDisabled">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini" @click="saveData('REGISTERED')" :disabled="buttonDisabled">{{$t('failProductO_regis')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{$t('failProductO_Statu')}}{{ faiProductionOrderState }}</span>
    </div>
   <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh" size="mini">
        <el-form-item :label="$t('common_PorN')"  prop="mComMaterialId" class="el-col el-col-7">
          <el-input :disabled="true" v-model="infoData.materialNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true" v-model="infoData.modelCode" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduUnit')" prop="productionUnit" class="el-col el-col-7  el-col-offset-1">
          <mes-select v-model="infoData.productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_WorkOrde')" prop="tPomJobOrderId" class="el-col el-col-7">
          <mes-select v-model="infoData.tPomJobOrderId" labelKey="DOC_NO" valueKey="T_POM_JOB_ORDER_ID" method="getJobOrdersByArg" ></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_WorkOrdeQuan')" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.jobOrderQty"></el-input>
        </el-form-item>
        <el-form-item label="SN" class="el-col el-col-7 el-col-offset-1">
          <el-input v-model="infoData.productSn" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Line')" prop="mPomLineId" class="el-col el-col-7">
          <mes-select v-model="infoData.mPomLineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_Machi')" prop="machineCode" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_posit')" class="el-col el-col-7 el-col-offset-1">
          <el-input   v-model="infoData.location" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Shift')" prop="mPomShiftId" class="el-col el-col-7">
          <mes-select v-model="infoData.mPomShiftId" labelKey="shiftName" valueKey="mPomShiftId" method="getShiftList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('failProductO_InspeTime')" prop="sendTime" class="el-col el-col-7 el-col-offset-1">
          <el-date-picker  v-model="infoData.sendTime"  type="datetime" :placeholder="$t('common_SelecDateTime')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('failProductO_TestiPers')" prop="sendBy" class="el-col el-col-7  el-col-offset-1">
        <mes-select v-model="infoData.sendBy" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_InspeCate')" prop="inspectCategory" class="el-col el-col-7 ">
          <dict-select v-model="infoData.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
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
          <span style="margin-right:15px">{{$t('failProductO_InspeReguNo')}}</span>
          <el-input :disabled="true" v-model="sipNo" size="mini" style="width:40%"></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-right:15px">{{$t('failProductO_RevisInspRegu')}}</span>
          <el-input :disabled="true" v-model="sipVer" size="mini" style="width:40%"></el-input>
          </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="checkData" border size="mini">
          <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
          <el-table-column prop="inspectItem" :label="$t('common_AuditItem')" align="center"></el-table-column>
          <el-table-column prop="inspectContent"  :label="$t('common_AuditCont')" align="center"></el-table-column>
          <el-table-column prop="spec"  :label="$t('common_Speci')" align="center"></el-table-column>
          <!-- <el-table-column prop="defectImage"  :label="$t('common_MapLoca')" align="center">
            <template slot-scope="scope" >
              <el-input v-model="scope.row.defectImage"></el-input>
            </template>
          </el-table-column>
          <el-table-column  prop="inspectInfo" :label="$t('common_detecResu')" align="center">
            <template slot-scope="scope" >
              <el-input v-model="scope.row.inspectInfo"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="inspectResult" :label="$t('common_JudgmResu')" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult" >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option" @click.native="dispatchNg(scope.row)"></el-option>
                </el-select>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="ng页面"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog"  @cannel="cannel" :detailId="detailId"></ng-dialog>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import ngDialog from '../Components/ngDialog'
export default {
  data () {
    return {
      dialogVisible: false,
      faiProductionOrderState: '',
      checkData: [],
      infoData: {
        docStatus: '',
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
        sendTime: '',
        sendBy: '',
        inspectCategory: ''
      },
      modelList: [],
      machineList: [],
      rules: {
        mComMaterialId: [{ required: true, message: this.$t('common_PleaseSelectPN') }]
      },
      resultArray: ['OK', 'NG', this.$t('common_blank')],
      sipNo: '',
      sipVer: '',
      detailId: ''
    }
  },
  computed: {
    buttonDisabled () {
      return this.faiProductionOrderState === this.$t('failProductO_Regis')
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
      this.faiProductionOrderState = this.$route.query.status === 'UN_REGISTER' ? this.$t('failProductO_unreg') : this.$t('failProductO_Regis')
    },
    async  saveData (docStatus) {
      this.$refs.infoData.validate(async valid => {
        if (valid) {
          let data = this.infoData
          data.detailVmList = this.checkData
          data.sipNo = this.sipNo
          data.sipVer = this.sipVer
          data.docStatus = docStatus
          data.tQomFaiMainId = this.tQomFaiMainId
          let res = await this.$api.updateMainBill(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    },
    closeCurrentPage () {
      this.$router.replace('/Quality/FaiProductionOrder')
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
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.machineList = res.data.list
    }
  },
  components: {
    materialSelect, ngDialog
  },
  created () {
    this.setStatus()
    this.getModelList()
    this.setDefaultData()
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
