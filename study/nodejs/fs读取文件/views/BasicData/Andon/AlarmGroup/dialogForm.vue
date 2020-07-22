<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="部门" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" type="2" style="width:100%" size="mini" placeholder="请选择部门"></cascader-select>
    </el-form-item>
    <el-form-item label="群组代码" prop="groupCode" class="el-col el-col-24">
      <el-input v-model="dialogForm.groupCode" placeholder="请输入报警群组代码"></el-input>
    </el-form-item>
    <el-form-item label="群组名称" prop="groupName" class="el-col el-col-24">
      <el-input v-model="dialogForm.groupName" placeholder="请输入报警群组名称"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.remark" placeholder="请输入备注信息"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveAlrmGroup">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        groupCode: '',
        groupName: '',
        remark: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择工厂' }],
        groupCode: [{ required: true, message: '请输入群组代码' }],
        groupName: [{ required: true, message: '请输入群组名称' }]
      }
    }
  },
  props: {
    isEdit: Boolean
  },
  methods: {
    saveAlrmGroup () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editAndonGroup(dialogForm) : await this.$api.addAndonGroup(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAndonGroupList')
          })
        }
      })
    }
  }
}
</script>
