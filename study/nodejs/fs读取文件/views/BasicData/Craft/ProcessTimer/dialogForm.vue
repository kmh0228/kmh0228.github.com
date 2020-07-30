<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('processTimer_TimerNum')" prop="mComTimerCode" class="el-col el-col-24">
      <el-input v-model.trim="form.mComTimerCode" size="mini"></el-input>
    </el-form-item>

    <el-form-item :label="$t('common_type')" prop="mComTimerType" class="el-col el-col-24">
      <el-input v-model.trim="form.mComTimerType" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Enable')" prop="isInvalid" class="el-col el-col-24">
      <el-checkbox v-model="isInvalid"></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('common_Description')" prop="mComTimerDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model.trim="form.mComTimerDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="submitForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
      isInvalid: true
    }
  },
  computed: {
    rules () {
      return {
        mComTimerCode: [{ required: true, message: this.$t('processTimer_TimerCodeCannBe') }],
        mComTimerType: [{ required: true, message: this.$t('processTimer_TypeCannBeEmpt') }]
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
