<template>
  <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item label="抽样计划" prop="planName">
      <el-input size="mini" v-model.trim="mainForm.planName"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="planDesc">
      <el-input size="mini" v-model.trim="mainForm.planDesc"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="isActive">
      <el-checkbox v-model="mainForm.isActive" true-label="true" false-label="false"></el-checkbox>
    </el-form-item>
     <el-form-item label-width="0" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveLevel">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      mainForm: {
        planName: '',
        planDesc: '',
        isActive: true
      },
      rules: {
        planName: [{ required: true, message: '检查水平不能为空' }]
      }
    }
  },
  props: {
    isEdit: Boolean
  },
  methods: {
    saveLevel () {
      this.$refs.mainForm.validate(async valid => {
        if (valid) {
          const { isEdit, mainForm } = this
          const res = isEdit ? await this.$api.editAqlplan(mainForm) : await this.$api.addAqlplan(mainForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getPlanList')
          })
        }
      })
    }
  }
}
</script>
