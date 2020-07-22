<template>
  <el-form :model="form" ref="form" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="通过意见" prop="passWord" class="el-col el-col-24" v-if="signatureType==='pass'">
      <el-input v-model="form.passWord" type="textarea"  :rows="2"  placeholder="输入通过意见"></el-input>
    </el-form-item>
    <el-form-item label="驳回意见" prop="rejectWord" class="el-col el-col-24" v-else>
      <el-input v-model="form.rejectWord" type="textarea"  :rows="2"  placeholder="请输入驳回意见"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" v-if="signatureType==='pass'" size="mini" @click="saveEsopDoc">通过</el-button>
      <el-button type="danger" v-else size="mini" @click="saveEsopDoc">驳回</el-button>
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        passWord: '',
        rejectWord: ''
      },
      rules: {
        rejectWord: [{ required: true, message: '请输入驳回意见' }]
      }
    }
  },
  props: {
    id: String,
    signatureType: String,
    cancel: Function,
    findExamList: Function
  },
  methods: {
    saveEsopDoc () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let { form, id } = this
          let mQomAuditRemark = form.rejectWord ? form.rejectWord : form.passWord
          let mQomAuditResult = this.signatureType
          const data = Object.assign({ id, mQomAuditRemark, mQomAuditResult })
          const res = await this.$api.handleExam(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cancel')
            this.$emit('findExamList')
          })
        }
      })
    }
  }
}
</script>
