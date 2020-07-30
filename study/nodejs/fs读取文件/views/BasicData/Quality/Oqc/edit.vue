<template>
<div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button  :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{$t('oqc_OddNumb')}}{{infoData.batchNo}}</span>
      <span class="status_class" style="margin-left:3vw">{{$t('oqc_Statu')}}{{ oqcState }}</span>
    </div>
     <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
        <el-form-item :label="$t('oqc_SalesOrdeNo') + ':'" prop="soNo" class="el-col el-col-7">
          <mes-select v-model="infoData.soNo" labelKey="mWmsDeliveryNo" valueKey="mWmsDeliveryId" method="getOutboundOrder" clearable :disabled="true"></mes-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('oqc_SinglSale')" prop="soItem" class="el-col el-col-7 el-col-offset-1">
           <el-input v-model="infoData.soItem" disabled ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('oqc_CustoPurcOrde')" prop="cpoNo" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.cpoNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_AuditShif')" prop="inspectionShift" class="el-col el-col-7 el-col-offset-1">
          <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleClas')"  v-model="infoData.inspectionShift">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="料号:" prop="mComMaterialId" class="el-col el-col-7">
          <el-input v-model="materialNo" disabled ></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduName')" prop="productName" class="el-col el-col-7 el-col-offset-1">
           <el-input disabled  v-model="infoData.productName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_CustoItemNo')" prop="custMaterialNo" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.custMaterialNo"></el-input>
        </el-form-item>
        <el-form-item label="数量:"  class="el-col el-col-7">
         <el-input  v-model="infoData.qty" style="width:60%"></el-input>
         <el-input   v-model="infoData.qtyUom" style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_NumbeCase')" prop="boxQty" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.boxQty"></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_TotalQuan')" prop="soTotalQty" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.soTotalQty"></el-input>
        </el-form-item>
        <el-form-item label="毛重:" prop="grossWeight" class="el-col el-col-7">
          <el-input  v-model="infoData.grossWeight" style="width:60%"></el-input>
          <el-input  v-model="infoData.weightUom"  style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_NetWeig')" prop="netWeight" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.netWeight" style="width:60%"></el-input>
           <el-input  v-model="infoData.weightUom"  style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_PalleStat')" prop="palletStatus" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.palletStatus" ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('common_InspeDate') + ':'" prop="inspectDate" class="el-col el-col-7">
         <el-date-picker  v-model="infoData.inspectDate" type="date"  :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common_examiCler')" prop="inspector" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_CustoCode') + ':'" prop="customerCode" class="el-col el-col-7 el-col-offset-1">
         <el-input v-model="infoData.customerCode" disabled  ></el-input>
        </el-form-item>
        <el-form-item :label="$t('oqc_ShippRepoRequ') + ':'" class="el-col el-col-23">
          <el-radio-group v-model="infoData.isReportRequired">
            <el-radio :label="true">Y</el-radio>
            <el-radio :label="false">N</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common_remarks') + ':'" prop="remark" class="el-col el-col-23">
         <el-input  v-model="infoData.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
   </el-card>
   <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
      <div slot="header" class="clearfix">
      <span>{{$t('oqc_ItemNumbInfo')}}</span>
      </div>
      <div class="mes-table">
        <div class="mes-table-content">
          <el-table :data="materialTable" border size="mini">
            <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
            <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center"></el-table-column>
            <el-table-column prop="productName" :label="$t('common_ProduName')" align="center"></el-table-column>
            <el-table-column prop="custMaterialNo"  :label="$t('oqc_CustoItemNo')" align="center"></el-table-column>
            <el-table-column prop="qty" :label="$t('common_numbe')" align="center"></el-table-column>
            <el-table-column prop="qtyUom" :label="$t('oqc_UnitQuan')" align="center"></el-table-column>
            <el-table-column prop="boxQty" :label="$t('oqc_NumbeCase')" align="center"></el-table-column>
            <el-table-column prop="judgeResult" :label="$t('common_JudgmResu')" align="center">
              <template slot-scope="scope">
                  <el-select style="width:100%" size="mini" v-model="scope.row.judgeResult"  >
                    <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"></el-option>
                  </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
   <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
    <div slot="header" class="clearfix">
    <span>{{$t('common_InspeRegRecord')}}</span>
    </div>
    <div class="mes-table">
      <div class="mes-table-content">
        <el-table :data="checkData" border size="mini">
          <el-table-column type="index" :label="$t('common_Number')"></el-table-column>
          <el-table-column prop="inspectItem" :label="$t('common_type')" align="center"></el-table-column>
          <el-table-column prop="inspectItem" :label="$t('common_InspeItem')" align="center"></el-table-column>
          <el-table-column prop="inspectContent"  :label="$t('common_InspeCont')" align="center"></el-table-column>
          <el-table-column prop="inspectResult" :label="$t('common_JudgmResu')" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult"  >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"  @click.native="dispatchNg(scope.row)"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" :title="'ng' + $t('common_page')"  width="800px" class="handle-dialog">
        <ng-dialog v-if="dialogVisible" ref="dialog" :detailId="detailId" @cannel="cannel"></ng-dialog>
      </el-dialog>
    </div>
  </el-card>
</div>
</template>

<script>
import ngDialog from '../Components/ngDialog'

import { mapActions } from 'vuex'
export default {
  data () {
    return {
      oqcState: '',
      infoData: {
        batchNo: '',
        soNo: '',
        cpoNo: '',
        inspectDate: this.$dayjs().format('YYYY-MM-DD'),
        inspector: '',
        inspectionShift: '',
        customerCode: '',
        remark: ''
      },
      materialNo: '',
      rules: {
        soNo: [{ required: true, message: this.$t('oqc_enterSaleOrdeNo') }],
        mComMaterialId: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        customerCode: [{ required: true, message: this.$t('oqc_selecCustCode') }],
        qty: [{ required: true, message: this.$t('oqc_inputQuan') }],
        inspectDate: [{ required: true, message: this.$t('oqc_selecInspDate') }]
      },
      resultArray: ['OK', 'NG', this.$t('common_blank')],
      checkData: [],
      shiftList: [],
      dialogVisible: false,
      detailId: '',
      materialTable: []
    }
  },
  computed: {
    buttonDisabled () {
      return this.oqcState === this.$t('common_Submitted')
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
        this.detailId = row.tQomOqcDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    ...mapActions(['changeQmsStatus']),
    setStatus () {
      this.oqcState = this.$route.query.status === 'DRAFT' ? this.$t('common_NotSubm') : this.$t('common_Submitted')
    },
    saveData (docStatus) {
      this.$refs.infoData.validate(async valid => {
        if (valid) {
          let tQomOqcMainId = this.$route.query.id
          let { infoData, checkData, materialTable } = this
          let items = checkData
          let parts = materialTable
          let data = Object.assign({ items, tQomOqcMainId, parts }, infoData)
          data.docStatus = docStatus
          let res = await this.$api.updateOqc(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
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
    },
    async setDefaultData () {
      const tQomOqcMainId = this.$route.query.id
      const res = await this.$api.findOqc({ tQomOqcMainId })
      const { code, data } = res
      if (code === '200') {
        let keys = Object.keys(this.infoData)
        keys.forEach(key => {
          this.infoData[key] = data[key]
        })
        this.infoData.inspectDate = this.$dayjs(this.infoData.inspectDate).format('YYYY-MM-DD')
        this.materialNo = data.materialNo
        this.checkData = data.items
        this.materialTable = data.parts
      } else {
        this.$message.warning(this.$t('oqc_FaileGetDataTryAgai'))
      }
    },
    closeCurrentPage () {
      this.changeQmsStatus(true)
      this.$router.replace('/BasicData/Quality/Oqc')
    }
  },
  created () {
    this.setStatus()
    this.setDefaultData()
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
