<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="计时器编码" prop="mComTimerCode" class="el-col el-col-24">
      <el-input v-model.trim="form.mComTimerCode" size="mini"></el-input>
    </el-form-item>

    <el-form-item label="类型" prop="mComTimerType" class="el-col el-col-24">
      <el-input v-model.trim="form.mComTimerType" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="isInvalid" class="el-col el-col-24">
      <el-checkbox v-model="isInvalid"></el-checkbox>
    </el-form-item>
    <el-form-item label="描述" prop="mComTimerDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model.trim="form.mComTimerDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: {
        mComTimerCode: '',
        mComTimerType: '',
        mComTimerDesc: '',
        isInvalid: false
      },
      isInvalid: true,
      rules: {
        mComTimerCode: [{ required: true, message: '计时器编码不能为空' }],
        mComTimerType: [{ required: true, message: '类型不能为空' }]
      }
    }
  },
  watch: {
    isInvalid (val) {
      this.form.isInvalid = !val
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(async valid => {
        const { isEdit, form } = this
        const res = isEdit ? await this.$api.eidtProducerTimer(form) : await this.$api.addPorducerTimer(form)
        this.$myPrompt.handleMsg(res, () => {
          this.$emit('cannel')
          this.$emit('get-producer-timers')
        })
      })
    }
  }
}
</script>
