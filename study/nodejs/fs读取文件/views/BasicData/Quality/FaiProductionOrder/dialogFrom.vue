<template>
 <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_PorN')" prop="mComMaterialId" class="el-col el-col-11">
      <dialogTableSelect  v-model="dialogForm.mComMaterialId" style="width:100%" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" ></dialogTableSelect>
    </el-form-item>
    <el-form-item :label="$t('common_ProduSeries')" prop="model" class="el-col el-col-11  el-col-offset-1">
      <mes-select v-model="dialogForm.model" labelKey="mComMaterialfamilyCode" valueKey="mComMaterialfamilyId" method="getMachine"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_ProduUnit')" prop="productionUnit" class="el-col el-col-11">
      <mes-select v-model="dialogForm.productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_WorkOrde')" prop="tPomJobOrderId" class="el-col el-col-11 el-col-offset-1">
      <mes-select v-model="dialogForm.tPomJobOrderId" labelKey="DOC_NO" valueKey="T_POM_JOB_ORDER_ID" method="getJobOrdersByArg"  @optionClick="changeOrderData"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_WorkOrdeQuan')"  prop="jobOrderQty"  class="el-col el-col-11">
      <el-input  v-model="dialogForm.jobOrderQty"></el-input>
    </el-form-item>
    <el-form-item label="SN" prop="productSn" class="el-col el-col-11 el-col-offset-1">
       <el-input v-model="dialogForm.productSn" style="width:100%" :placeholder="$t('failProductO_enterSN')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Line')" prop="mPomLineId" class="el-col el-col-11">
      <mes-select v-model="dialogForm.mPomLineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_Machi')" prop="machineCode" class="el-col el-col-11 el-col-offset-1">
      <mes-select v-model="dialogForm.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_posit')" prop="location" class="el-col el-col-11">
       <el-input v-model="dialogForm.location" style="width:100%" :placeholder="$t('failProductO_enterLoca')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Shift')" prop="mPomShiftId" class="el-col el-col-11 el-col-offset-1">
      <mes-select v-model="dialogForm.mPomShiftId" labelKey="shiftName" valueKey="mPomShiftId" method="getShiftList"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('failProductO_InspeTime')" prop="sendTime" class="el-col el-col-11">
       <el-date-picker  v-model="dialogForm.sendTime"  type="datetime" :placeholder="$t('common_SelecDateTime')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('failProductO_TestiPers')" prop="sendBy" class="el-col el-col-11 el-col-offset-1">
     <mes-select v-model="dialogForm.sendBy" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_InspeCate')" prop="inspectCategory" class="el-col el-col-11">
      <dict-select v-model="dialogForm.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" :disabled="docStatus==='REGISTERED'"  @click="saveData('UN_REGISTER')">{{$t('common_save')}}</el-button>
      <el-button type="primary" size="mini" :disabled="docStatus==='REGISTERED'" @click="saveData('REGISTERED')">{{$t('common_Submit')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      materialColumns: [{
        key: 'materialNo',
        label: this.$t('common_PorN')
      }, {
        key: 'materialName',
        label: this.$t('common_MaterialName')
      }, {
        key: 'version',
        label: this.$t('common_Edition')
      }, {
        key: 'mComMaterialtypeCode',
        label: this.$t('common_MaterialType')
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      },
      dialogForm: {
        docStatus: '',
        mComMaterialId: '',
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
      materialNo: ''
    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.materialNo ? this.materialNo + ':' : ''
      const version = this.dialogForm.mComMaterialVersion ? this.dialogForm.mComMaterialVersion : ''
      return `${materialNo}${version}`
    },
    rules () {
      return {
        mComMaterialId: [{ required: true, message: this.$t('common_ItemNoCannBeEm') }]
      }
    }
  },
  props: {
    cannel: Function,
    isEdit: Boolean,
    findMainBillPage: Function,
    docStatus: String

  },
  methods: {
    changeOrderData (option) {
      this.dialogForm.jobOrderQty = option.REQUEST_QTY
    },
    saveData (docStatus) {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          this.dialogForm.docStatus = docStatus
          let { dialogForm, isEdit } = this
          let res = isEdit ? await this.$api.updateMainBill(dialogForm) : await this.$api.insertMainBill(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('findMainBillPage')
          })
        }
      })
    }

  },
  created () {
  },
  components: {
    dialogTableSelect
  }
}
</script>
