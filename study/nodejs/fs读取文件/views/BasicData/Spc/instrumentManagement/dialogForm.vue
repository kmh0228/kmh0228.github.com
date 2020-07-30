<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('common_Department')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" type="2" :placeholder="$t('common_PleasSeleDepa')" :disabled="isEdit" style="width:100%;"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('common_MeasuStat')+'/'+$t('common_labor')" prop="mSpcMeasurementStationId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mSpcMeasurementStationId" size="mini" style="width:100%;" :disabled="isEdit" :placeholder="$t('instrumentM_selecMeasStat')+'/'+$t('common_labor')">
        <el-option v-for="option in measurementStationList" :key="option.mSpcMeasurementStationId" :label="option.stationCode" :value="option.mSpcMeasurementStationId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_MeasuInst')" prop="instrumentName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.instrumentName" style="width:100%" :disabled="isEdit" :placeholder="$t('instrumentM_inputNameMeasInst')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('instrumentM_InstrAccu')" prop="precision" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.precision" style="width:100%" :placeholder="$t('instrumentM_inputInstPrec')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('instrumentM_UnitMeas')" prop="uom" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.uom" style="width:100%" :placeholder="$t('instrumentM_enterMeasUnit')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Description')" prop="instrumentDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model.trim="dialogForm.instrumentDesc" style="width:100%" :placeholder="$t('instrumentM_enterADesc')"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveInstrument">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        mSpcMeasurementStationId: '',
        instrumentName: '',
        precision: '',
        uom: '',
        instrumentDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleDepa') }],
        mSpcMeasurementStationId: [{ required: true, message: this.$t('instrumentM_selecMeasStat') + '/' + this.$t('common_labor') }],
        instrumentName: [{ required: true, message: this.$t('instrumentM_inputNameMeasInst') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    measurementStationList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    saveInstrument () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editSpcInstrument(dialogForm) : await this.$api.addSpcInstrument(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getSpcInstrumentList')
          })
        }
      })
    }
  }
}
</script>
