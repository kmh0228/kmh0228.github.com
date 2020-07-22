<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item label="部门" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" type="2" placeholder="请选择部门" :disabled="isEdit" style="width:100%;"></cascader-select>
    </el-form-item>
    <el-form-item label="量测站/实验室" prop="mSpcMeasurementStationId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mSpcMeasurementStationId" size="mini" style="width:100%;" :disabled="isEdit" placeholder="请选择量测站/实验室">
        <el-option v-for="option in measurementStationList" :key="option.mSpcMeasurementStationId" :label="option.stationCode" :value="option.mSpcMeasurementStationId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="测量仪器" prop="instrumentName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.instrumentName" style="width:100%" :disabled="isEdit" placeholder="请输入测量仪器名称"></el-input>
    </el-form-item>
    <el-form-item label="仪器精度" prop="precision" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.precision" style="width:100%" placeholder="请输入仪器精度"></el-input>
    </el-form-item>
    <el-form-item label="测量单位" prop="uom" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.uom" style="width:100%" placeholder="请输入测量单位"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="instrumentDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model.trim="dialogForm.instrumentDesc" style="width:100%" placeholder="请输入描述"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveInstrument">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
      },
      rules: {
        officeCode: [{ required: true, message: '请选择部门' }],
        mSpcMeasurementStationId: [{ required: true, message: '请选择量测站/实验室' }],
        instrumentName: [{ required: true, message: '请输入测量仪器名称' }]
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
