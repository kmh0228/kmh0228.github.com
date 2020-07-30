<template>
<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('packingRule_PackiRuleCode')" prop="ruleName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.ruleName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Enable')" prop="isInvalid" class="el-col el-col-24">
      <el-checkbox v-model="dialogForm.isInvalid"></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('packingRule_DescrPackRule')" prop="ruleDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model.trim="dialogForm.ruleDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveFrom">{{$t('common_save')}}</el-button>
        <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        ruleName: '',
        isInvalid: true,
        ruleDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        ruleName: [{ required: true, message: this.$t('packingRule_PackiRuleCodeCa') }]
      }
    }
  },
  props: {
    cannel: Function,
    getPackingRules: Function,
    isEdit: Boolean
  },
  methods: {
    async saveFrom () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let res = isEdit ? await this.$api.eidtPackingRule(dialogForm) : await this.$api.addPackingRule(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getPackingRules')
          })
        }
      })
    }
  },
  created () {

  }

}
</script>
