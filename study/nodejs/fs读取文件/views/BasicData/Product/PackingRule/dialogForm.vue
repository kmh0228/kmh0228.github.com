<template>
<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="包装规则代码" prop="ruleName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.ruleName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="isInvalid" class="el-col el-col-24">
      <el-checkbox v-model="dialogForm.isInvalid"></el-checkbox>
    </el-form-item>
    <el-form-item label="包装规则描述" prop="ruleDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model.trim="dialogForm.ruleDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveFrom">保存</el-button>
        <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
      },
      rules: {
        ruleName: [{ required: true, message: '包装规则代码不能为空' }]
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
