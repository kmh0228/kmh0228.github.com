<template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item label="检规编号" prop="sipNo" class="el-col-24">
    <el-input size="mini" v-model="dialogForm.sipNo"></el-input>
  </el-form-item>
  <el-form-item label="检规版次" prop="sipVersion" class="el-col-24">
    <el-input size="mini" v-model="dialogForm.sipVersion"></el-input>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
    <el-button size="mini" @click="$emit('cannel')">取消</el-button>
  </el-form-item>

</el-form>

</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        sipNo: '',
        sipVersion: ''
      },
      rules: {
        sipNo: [{ required: true, message: '请选择检规编号' }],
        sipVersion: [{ required: true, message: '请选择检规版次' }]
      }
    }
  },
  props: {
    cannel: {
      type: Function
    },
    initData: {
      type: Function
    },
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    // 新增检规
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let res = this.isEdit ? await this.$api.updSipMain(this.dialogForm) : await this.$api.addSipMain(this.dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('initData')
          })
        }
      })
    }
  }

}
</script>
