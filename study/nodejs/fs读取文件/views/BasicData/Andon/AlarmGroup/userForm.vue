<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="人员" prop="uCode" class="el-col el-col-24">
      <el-select v-model="dialogForm.uCode" size="mini" style="width:100%;" placeholder="请选择人员">
        <el-option v-for="option in personList" :key="option.userCode" :label="option.userName" :value="option.userCode"></el-option>
        <!-- <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.employeeCardId"></el-option> -->
      </el-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveAlrmGroupUser">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        uCode: ''
      },
      rules: {
        uCode: [{ required: true, message: '请选择人员' }]
      },
      personList: []
    }
  },
  props: {
    mAlmGroupId: [String, Number],
    isEdit: Boolean
  },
  methods: {
    saveAlrmGroupUser () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, mAlmGroupId, isEdit } = this
          const data = Object.assign({ mAlmGroupId }, dialogForm)
          const res = isEdit ? await this.$api.editAndonGroupUser(data) : await this.$api.addAndonGroupUser(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAndonGroupUserList')
          })
        }
      })
    },
    // 获取人员信息
    // 获取所有人员
    async getPersonList () {
      const res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.personList = res.data
      } else {
        this.personList = []
      }
    }
  },
  created () {
    this.getPersonList()
  }
}
</script>
