<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-24">
       <cascader-select v-model="dialogForm.officeCode" style="width:100%;"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('common_EquipCateName')" prop="mMomResourceTypeId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mMomResourceTypeId" size="mini" style="width:100%;" :placeholder="$t('troubleReason_selecDeviCate')">
        <el-option v-for="option in deviceTypeList" :key="option.mMomResourceTypeId" :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('troubleReason_FaultCode')" prop="mmomFailcodeId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mmomFailcodeId" size="mini" style="width:100%;" :placeholder="$t('troubleReason_selecFaulCode')">
        <el-option v-for="option in failCodeList" :key="option.mMomFailcodeId" :label="option.failCode" :value="option.mMomFailcodeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('troubleReason_CauseFail')" prop="failReason" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.failReason" style="width:100%" :placeholder="$t('troubleReason_inputFaulReas')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('troubleReason_IsItPred')" prop="isPredefined" class="el-col el-col-24">
      <el-checkbox v-model="dialogForm.isPredefined"></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('troubleReason_FailuCausDesc')" prop="failDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.failDesc" :placeholder="$t('troubleReason_enterFaulCausDesc')"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveFailReason">{{$t('common_save')}}</el-button>
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
        mMomResourceTypeId: '',
        mmomFailcodeId: '',
        failReason: '',
        isPredefined: true,
        failDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        mMomResourceTypeId: [{ required: true, message: this.$t('troubleReason_selecDeviCate') }],
        mmomFailcodeId: [{ required: true, message: this.$t('troubleReason_selecFaulCode') }],
        failReason: [{ required: true, message: this.$t('troubleReason_inputFaulReas') }],
        failDesc: [{ required: true, message: this.$t('troubleReason_enterFaulCausDesc') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    deviceTypeList: Array,
    failCodeList: Array
  },
  methods: {
    saveFailReason () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editTpmFailReason(dialogForm) : await this.$api.addTpmFailReason(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTpmFailReasonList')
          })
        }
      })
    }
  }
}
</script>
