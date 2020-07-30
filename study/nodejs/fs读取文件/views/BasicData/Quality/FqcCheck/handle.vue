<template>
  <div class="mes-main mes-work-order mes-handle">
    <div class="mes-main-header_bg" style="color:#3B6F9A"></div>
      <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" @click="saveIqc('DRAFT')" :disabled="buttonDisabled">{{$t('common_save')}}</el-button>
          <el-button type="primary" plain size="mini" @click="saveIqc('SUBMITTED')" :disabled="buttonDisabled">{{$t('common_Submit')}}</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
           <span class="status_class">{{$t('fqcCheck_Statu')}}{{ fqcState }}</span>
           <span v-if="userType === 2" class="status_class"  style="margin-left:3vw">{{$t('fqcCheck_OddNumb')}}{{unitNumber}}</span>
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
        <el-tabs v-model="activeName" >
          <el-tab-pane :label="$t('common_BasicInfo')" name="info">
            <el-form :model="iqcInfo" ref="iqcInfo" :rules="rules" label-width="110px" label-position="left" class="el-row mes-form-rule" size="mini">
              <el-form-item :label="$t('common_StockInNo')" class="el-col el-col-7" prop="stockInNo">
                <!-- <el-input size="mini" v-model="iqcInfo.stockInNo" :disabled="userType !== 1"></el-input> -->
                <mes-select v-model="iqcInfo.stockInNo" labelKey="mWmsEntrylistNo" valueKey="mWmsEntrylistNo" method="getInboundOrder" clearable :disabled="userType !== 1"></mes-select>
                <!-- <el-col :lg="{span:13}" :xl="{span:16}">
                  <el-input v-model="iqcInfo.stockInNo" :placeholder="$t('fqcCheck_generStocInNo')" size="mini"></el-input>
                </el-col>
                <el-col :lg="{span:10,offset:1}" :xl="{span:7,offset:1}">
                  <el-button type="primary" plain size="mini" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" @click="createBatchNo">{{$t('fqcCheck_GenerWorkOrdeAccoRule')}}</el-button>
                </el-col> -->
              </el-form-item>
              <el-form-item :label="$t('common_BatchNumb')" class="el-col el-col-7 el-col-offset-1" prop="lotNo">
                <el-input size="mini" v-model="iqcInfo.lotNo" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('common_PorN')" class="el-col el-col-7 el-col-offset-1" prop="materialNo">
                <material-select v-model="iqcInfo.materialNo" @change="handleData" v-if="userType === 1" style="width:100%" selectkey="materialNo"></material-select>
                <el-input disabled v-else v-model="iqcInfo.materialNo" :placeholder="$t('common_PleasEnteItemNu')"></el-input>
              </el-form-item>
                <el-form-item :label="$t('fqcCheck_StoraQuan')" class="el-col el-col-7" prop="stockInQty">
                <el-input size="mini" v-model.number="iqcInfo.stockInQty" style="width:60%" ></el-input>
                <el-input style="width:35%;float:right" v-model="iqcInfo.qtyUom" size="mini"></el-input>
              </el-form-item>
              <el-form-item :label="$t('common_custo')" class="el-col el-col-7 el-col-offset-1" prop="customer">
                <el-input size="mini" v-model="iqcInfo.customer" ></el-input>
              </el-form-item>
                <el-form-item :label="$t('fqcCheck_CustoItemNo')" class="el-col el-col-7 el-col-offset-1" prop="custMaterialNo">
                <el-input size="mini" v-model="iqcInfo.custMaterialNo" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('fqcCheck_ProduLine')" class="el-col el-col-7" prop="mPomLineId">
                <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="iqcInfo.mPomLineId">
                  <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('fqcCheck_place')" class="el-col el-col-7 el-col-offset-1" prop="location">
                <el-input size="mini" v-model="iqcInfo.location" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('fqcCheck_WarehDate')" class="el-col el-col-7 el-col-offset-1" prop="stockInDate">
                <!-- <el-date-picker  v-model="iqcInfo.stockInDate" type="date"  :placeholder="$t('common_SelecDate')" style="width:100%"></el-date-picker> -->
                <el-date-picker  v-model="iqcInfo.stockInDate"  type="date"  :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('common_InspeDate')" class="el-col el-col-7" prop="inspectDate">
                <el-date-picker  v-model="iqcInfo.inspectDate"  type="date"  :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('common_examiCler')" class="el-col el-col-7 el-col-offset-1" prop="inspector">
                <!-- <el-select  v-model="iqcInfo.inspector" style="width:100%">
                  <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.mComEmployeeId"></el-option>
                </el-select> -->
                <mes-select v-model="iqcInfo.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
              </el-form-item>
              <el-form-item :label="$t('common_AbnorNotiPers')" class="el-col el-col-7 el-col-offset-1">
                <mes-select v-model="iqcInfo.excepNotice" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <settings ref="settings" :stockInQty="iqcInfo.stockInQty"></settings>
         <el-tabs v-model="activeName1">
          <el-tab-pane :label="$t('common_InspeRecord')" name='record'>
            <el-table :data="fqcDetailList" border>
              <el-table-column prop="sortNo" :label="$t('common_item')" align="center"></el-table-column>
              <el-table-column :label="$t('common_InspeItem')" prop="inspectItem" align="center" ></el-table-column>
              <el-table-column :label="$t('common_InspeCont')" prop="inspectContent" align="center"></el-table-column>

              <!-- 设计取消掉了 但是以免再加上   -->
              <!-- <el-table-column :label="$t('fqcCheck_upperLimi')" prop="maxValue" align="center"></el-table-column>
              <el-table-column :label="$t('fqcCheck_lowerLimi')" prop="minValue" align="center"></el-table-column>
              <el-table-column :label="$t('common_Unit')" prop="specUom" align="center"></el-table-column>
              <el-table-column :label="$t('common_MapLoca')" align="center">
                <template slot-scope="scope" >
                  <el-input v-model="scope.row.locationContent"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('fqcCheck_TestNumb')" prop="testNo" align="center">
                <template slot-scope="scope" >
                  <el-input v-model="scope.row.testNo"></el-input>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('fqcCheck_testResu')" align="center">
                <template slot-scope="scope">
                  <el-input size="mini" v-model.trim="scope.row.inspectInfo"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common_JudgmResu')" align="center">
                <template slot-scope="scope">
                  <el-select size="mini" v-model.trim="scope.row.inspectResult">
                    <el-option v-for="(option,i) in statusList" :key="i" :label="option" :value="option"  @click.native="dispatchNg(scope.row)"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <bad-type ref="badType"></bad-type>
        <determine ref="determine"></determine>
        <el-dialog :visible.sync="dialogVisible" :title="'ng'+$t('common_page')"  width="800px" class="handle-dialog">
          <ng-dialog v-if="dialogVisible" ref="dialog" :detailId="detailId" @cannel="cannel"></ng-dialog>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import settings from './components/settings'
import badType from './components/badType'
import determine from './components/determine'
import ngDialog from '../Components/ngDialog'

export default {
  data () {
    return {
      fqcState: '',
      unitNumber: '',
      isShow: true,
      activeName: 'info',
      iqcInfo: {
        batchNo: '',
        stockInNo: '',
        stockInDate: '',
        materialNo: '',
        qtyUom: '',
        customer: '',
        custMaterialNo: '',
        mPomLineId: '',
        location: '',
        lotNo: '',
        inspectDate: '',
        inspector: '',
        stockInQty: '',
        testNo: '',
        excepNotice: ''
      },
      rules: {
        stockInNo: [{ required: true, message: this.$t('fqcCheck_selecStocInNo') }],
        materialNo: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        stockInQty: [{ required: true, message: this.$t('fqcCheck_enterStocInQuan') }],
        mPomLineId: [{ required: true, message: this.$t('fqcCheck_selecProdLine') }],
        inspectDate: [{ required: true, message: this.$t('fqcCheck_enterInspDate') }]
      },
      lineList: [],
      userList: [],
      fqcDetailList: [],
      activeName1: 'record',
      statusList: ['OK', 'NG', this.$t('common_blank')],
      dialogVisible: false,
      detailId: ''
    }
  },
  props: {
    userType: Number
  },
  computed: {
    buttonDisabled () {
      return this.fqcState === this.$t('common_Submitted')
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG' && this.userType === 2) {
        this.dialogVisible = true
        this.detailId = row.tQomFqcDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.fqcState = this.$route.query.status === 'DRAFT' ? this.$t('common_NotSubm') : this.$t('common_Submitted')
      this.unitNumber = this.$route.query.unitNumber
    },
    async createBatchNo () {
      let res = await this.$api.getJobOrderNo('workOrder', 1)
      this.iqcInfo.stockInNo = res.data
    },
    async saveIqc (status) {
      this.$refs.iqcInfo.validate(async valid => {
        if (valid) {
          let obj = {}
          if (this.$refs.settings.inspectCategory === 'noInspection') {
            obj.aqlStandard = this.$refs.settings.aqlStandard
            obj.aql = this.$refs.settings.aql
            obj.inspectionLevel = this.$refs.settings.inspectionLevel
            obj.sampleQty = this.$refs.settings.samplingForm.sampleQty
            obj.defectQty = this.$refs.settings.samplingForm.defectQty ? this.$refs.settings.samplingForm.defectQty : ''
            obj.defectRate = this.$refs.settings.defectRate ? this.$refs.settings.samplingForm.defectRate : ''
            obj.inspectCategory = this.$refs.settings.inspectCategory
          } else {
            obj.aqlStandard = ''
            obj.aql = ''
            obj.inspectionLevel = ''
            obj.sampleQty = ''
            obj.defectQty = ''
            obj.defectRate = ''
            obj.inspectCategory = this.$refs.settings.inspectCategory
          }
          const { iqcInfo, fqcDetailList } = this
          const fqcDefectList = this.$refs.badType.tQomIqcDefectVmList
          const { decideForm, inspectResult } = this.$refs.determine
          const data = Object.assign(iqcInfo, obj, decideForm, { fqcDefectList, fqcDetailList, inspectResult })
          data.status = status
          if (this.userType === 2) {
            data.tQomFqcMainId = this.$route.query.id
          }
          let res = await this.$api.saveFqcCheck(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    // 获取人员信息
    async getUsers () {
      let data = {
        keyWords: '',
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.userList = res.data.list
      } else {
        this.userList = []
      }
    },
    async handleData () {
      let materialNo = this.iqcInfo.materialNo
      let res = await this.$api.getInspectContentByMaterialNo({ materialNo })
      if (res.code === '200') {
        this.fqcDetailList = res.data
      } else {
        this.fqcDetailList = []
      }
    },
    async setDefaultData () {
      if (this.userType === 2) {
        let tQomFqcMainId = this.$route.query.id
        let res = await this.$api.getFqcById({ tQomFqcMainId })
        let keys = Object.keys(this.iqcInfo)
        keys.forEach(key => {
          this.iqcInfo[key] = res.data[key]
        })
        this.$refs.badType.tQomIqcDefectVmList = res.data.fqcDefectList
        this.fqcDetailList = res.data.fqcDetailList
        this.$refs.determine.inspectResult = res.data.result
        let deterKeys = Object.keys(this.$refs.determine.decideForm)
        deterKeys.forEach(key => {
          this.$refs.determine.decideForm[key] = res.data[key]
        })
        this.$refs.settings.inspectCategory = res.data.inspectCategory
        this.$refs.settings.aqlStandard = res.data.aqlStandard
        this.$refs.settings.aql = res.data.aql
        this.$refs.settings.inspectionLevel = res.data.inspectionLevel
        this.$refs.settings.samplingForm.sampleQty = res.data.sampleQty
        this.$refs.settings.samplingForm.defectQty = res.data.defectQty
        this.$refs.settings.defectRate = res.data.defectRate
      }
    },
    closeCurrentPage () {
      this.$router.push('/BasicData/Quality/FqcCheck')
    }
  },
  components: {
    materialSelect,
    settings,
    badType,
    determine,
    ngDialog
  },
  created () {
    this.setDefaultData()
    this.getUsers()
    this.getLineData()
    this.setStatus()
  }
}
</script>

<style lang="scss" >
.status_class {
  font-size: 1vw;
  margin-left: 20vw;
  color: #3b6f9a;
}
</style>
