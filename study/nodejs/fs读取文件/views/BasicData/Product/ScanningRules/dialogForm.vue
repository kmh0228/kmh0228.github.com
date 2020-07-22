<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="140px" label-position="left" class="el-row mes-form-rule">
    <!-- <el-form-item :label="物料类别" prop="marerialClassId" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.marerialClassId" size="mini"></el-input>
    </el-form-item> -->
    <el-form-item :label="$t('common_PorN')" prop="mComMaterialId" class="el-col el-col-11">
      <dialogTableSelect ref="dialogTableSelect" v-model="dialogForm.mComMaterialId" :contentValue="materialNoVersion" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_ScanType')" prop="scanType" class="el-col el-col-11 el-col-offset-1">
      <dict-select v-model="dialogForm.scanType" dictType="COMPONENT_SCAN_TYPE" clearable></dict-select>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_BarcoChecType')" prop="bcCheck" class="el-col el-col-11">
      <dict-select v-model="dialogForm.bcCheck" dictType="BARCODE_CHECK_TYPE" clearable></dict-select>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_BarCodeLeng')" prop="pbcLength" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.pbcLength" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_BarCodeValu')" prop="bcValue" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.bcValue" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_AnalyBarCodeSta')" prop="pbcStart" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.pbcStart" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_AnalyBarCodeEnd')" prop="pbcEnd" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.pbcEnd" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_BarcoStar')" prop="bcStart" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.bcStart" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_EndBarCode')" prop="bcEnd" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.bcEnd" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_RuleDesc')" prop="parseRuleDesc" class="el-col el-col-11 el-col-offset-1">
      <el-input type="textarea" :rows="2" v-model="dialogForm.parseRuleDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('scanningRules_examp')" prop="parseRuleDesc" label-width="30px" class="el-col el-col-23">
      <p>{{$t('scanningRules_examDesc')}}</p>
    </el-form-item>
    <el-form-item :label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveLineInfo">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      dialogForm: {
        // marerialClassId: '',
        materialNo: '',
        version: '',
        mComMaterialId: '',
        scanType: '',
        bcCheck: '',
        pbcLength: '',
        bcValue: '',
        pbcStart: '',
        pbcEnd: '',
        bcStart: '',
        bcEnd: '',
        parseRuleDesc: ''
      },
      materialSearch: {
        materialNo: '',
        materialType: ''
      }
    }
  },
  computed: {
    materialColumns () {
      return [{
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
      }]
    },
    materialNoVersion () {
      const materialNo = this.dialogForm.materialNo ? this.dialogForm.materialNo + ':' : ''
      const version = this.dialogForm.version ? this.dialogForm.version : ''
      return `${materialNo}${version}`
    },
    rules () {
      const pbcLengthRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('scanningRules_PleasInpuBarcLe')))
        } else {
          if (/^[1-9]\d*$/.test(value)) {
            callback()
          } else {
            callback(new Error(this.$t('scanningRules_BarcoLengMustBe')))
          }
        }
      }
      const pbcStartRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('scanningRules_PleasEnteStarPo')))
        } else {
          if (/^[1-9]\d*$/.test(value)) {
            callback()
          } else {
            callback(new Error(this.$t('scanningRules_TheStarPosiPars')))
          }
        }
      }
      const pbcEndRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('scanningRules_PleasEnteEndPos')))
        } else {
          if (/^[1-9]\d*$/.test(value)) {
            callback()
          } else {
            callback(new Error(this.$t('scanningRules_TheEndPosiParsB')))
          }
        }
      }
      return {
        mComMaterialId: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        scanType: [{ required: true, message: this.$t('scanningRules_PleasSeleScanTy') }],
        bcCheck: [{ required: true, message: this.$t('scanningRules_PleasSeleBarcCh') }],
        pbcLength: [{ required: true, validator: pbcLengthRule, trigger: 'blur' }],
        bcValue: [{ required: true, message: this.$t('scanningRules_PleasEnteBarcVa') }],
        pbcStart: [{ required: true, validator: pbcStartRule, trigger: 'blur' }],
        pbcEnd: [{ required: true, validator: pbcEndRule, trigger: 'blur' }],
        bcStart: [{ required: true, message: this.$t('scanningRules_PleasEnteBarcSt') }],
        bcEnd: [{ required: true, message: this.$t('scanningRules_PleasEnteBarcEn') }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    saveLineInfo () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.editMaterialParseRule(dialogForm) : await this.$api.addMaterialParseRule(dialogForm)
          if (res.code === '200') {
            this.$message.success(res.msg)
            this.$emit('getMaterialParseRuleInfo')
            this.$emit('cannel')
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  },
  components: { dialogTableSelect }
}
</script>
