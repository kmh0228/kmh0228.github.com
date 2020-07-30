<template>
 <el-form :model="form" ref="form" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('troubleReason_proceMeth')" prop="method" class="el-col el-col-24">
      <el-input type="textarea" v-model="form.method" style="width:100%"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveFailReasonMethod">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        method: ''
      },
      rules: {
        method: [{ required: true, message: this.$t('troubleReason_ProceMethCannBeEmpt') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    mMomFailreasonId: [String, Number]
  },
  methods: {
    saveFailReasonMethod () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { isEdit, form, mMomFailreasonId } = this
          const data = Object.assign({ mMomFailreasonId }, form)
          const res = isEdit ? await this.$api.editFailReasonMethod(data) : await this.$api.addFailReasonMethod(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getFailReasonMethodList')
          })
        }
      })
    }
  }
}
</script>
