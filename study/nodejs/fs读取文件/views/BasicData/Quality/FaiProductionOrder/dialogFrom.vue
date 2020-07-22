<template>
 <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="料号" prop="mComMaterialId" class="el-col el-col-11">
      <dialogTableSelect  v-model="dialogForm.mComMaterialId" style="width:100%" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" ></dialogTableSelect>
    </el-form-item>
    <el-form-item label="产品系列" prop="model" class="el-col el-col-11  el-col-offset-1">
      <mes-select v-model="dialogForm.model" labelKey="mComMaterialfamilyCode" valueKey="mComMaterialfamilyId" method="getMachine"></mes-select>
    </el-form-item>
    <el-form-item label="生产单位" prop="productionUnit" class="el-col el-col-11">
      <mes-select v-model="dialogForm.productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select>
    </el-form-item>
    <el-form-item label="工单" prop="tPomJobOrderId" class="el-col el-col-11 el-col-offset-1">
      <mes-select v-model="dialogForm.tPomJobOrderId" labelKey="DOC_NO" valueKey="T_POM_JOB_ORDER_ID" method="getJobOrdersByArg"  @optionClick="changeOrderData"></mes-select>
    </el-form-item>
    <el-form-item label="工单数量"  prop="jobOrderQty"  class="el-col el-col-11">
      <el-input  v-model="dialogForm.jobOrderQty"></el-input>
    </el-form-item>
    <el-form-item label="SN" prop="productSn" class="el-col el-col-11 el-col-offset-1">
       <el-input v-model="dialogForm.productSn" style="width:100%" placeholder="请输入SN号"></el-input>
    </el-form-item>
    <el-form-item label="线别" prop="mPomLineId" class="el-col el-col-11">
      <mes-select v-model="dialogForm.mPomLineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
    </el-form-item>
    <el-form-item label="机台" prop="machineCode" class="el-col el-col-11 el-col-offset-1">
      <mes-select v-model="dialogForm.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
    </el-form-item>
    <el-form-item label="位置" prop="location" class="el-col el-col-11">
       <el-input v-model="dialogForm.location" style="width:100%" placeholder="请输入位置"></el-input>
    </el-form-item>
    <el-form-item label="班别" prop="mPomShiftId" class="el-col el-col-11 el-col-offset-1">
      <mes-select v-model="dialogForm.mPomShiftId" labelKey="shiftName" valueKey="mPomShiftId" method="getShiftList"></mes-select>
    </el-form-item>
    <el-form-item label="送检时间" prop="sendTime" class="el-col el-col-11">
       <el-date-picker  v-model="dialogForm.sendTime"  type="datetime" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
    </el-form-item>
    <el-form-item label="送测人员" prop="sendBy" class="el-col el-col-11 el-col-offset-1">
     <mes-select v-model="dialogForm.sendBy" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
    </el-form-item>
    <el-form-item label="检验类别" prop="inspectCategory" class="el-col el-col-11">
      <dict-select v-model="dialogForm.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" :disabled="docStatus==='REGISTERED'"  @click="saveData('UN_REGISTER')">保存</el-button>
      <el-button type="primary" size="mini" :disabled="docStatus==='REGISTERED'" @click="saveData('REGISTERED')">提交</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
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
      rules: {
        mComMaterialId: [{ required: true, message: '料号不能为空' }]
      },
      materialNo: ''
    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.materialNo ? this.materialNo + ':' : ''
      const version = this.dialogForm.mComMaterialVersion ? this.dialogForm.mComMaterialVersion : ''
      return `${materialNo}${version}`
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
