<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="140px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="原因代码" prop="defectReasonCode" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.defectReasonCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="原因代码名称" prop="defectReasonName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.defectReasonName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="原因代码类型" prop="defectReasonCodeType" class="el-col el-col-24">
      <dict-select v-model="dialogForm.defectReasonCodeType" dictType="DEFECT_CODE_TYPE"></dict-select>
    </el-form-item>
    <el-form-item label="子节点" prop="isLeaf" class="el-col el-col-24">
      <el-switch v-model.trim="dialogForm.isLeaf" :active-value="true" :inactive-value="false" @change="isLeafChange" active-text="是" inactive-text="否"></el-switch>
    </el-form-item>
    <el-form-item label="上级节点" class="el-col el-col-24"  v-if="!isEdit">
      <el-cascader v-model="defectReasonCodeParentId" expand-trigger="hover" :disabled="parentIdDisabled" change-on-select clearable :show-all-levels="false" style="width:100%" size="mini" :options="defectReasonOptions" :props="cascaderProps">
      </el-cascader>
    </el-form-item>
    <el-form-item label="原因描述" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.defectReasonDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        defectReasonCode: '',
        defectReasonName: '',
        defectReasonCodeType: '',
        isLeaf: true,
        defectReasonDesc: ''
      },
      rules: {
        defectReasonCode: [{ required: true, message: '原因代码不能为空' }],
        defectReasonName: [{ required: true, message: '原因代码名称不能为空' }],
        defectReasonCodeType: [{ required: true, message: '请选择原因代码类型！' }]
      },
      defectReasonCodeParentId: [],
      cascaderProps: {
        label: 'defectReasonCode',
        value: 'mQomDefectReasonId',
        children: 'children'
      }
    }
  },
  computed: {
    parentIdDisabled () {
      const { isLeaf } = this.dialogForm
      return !isLeaf
    }
  },
  props: {
    defectReasonPid: {
      type: String
    },
    isEdit: {
      type: Boolean
    },
    defectReasonTypeList: {
      type: Array
    },
    defectReasonOptions: {
      type: Array
    }
  },
  methods: {
    isLeafChange (val) {
      if (!val) {
        this.defectReasonCodeParentId = []
      }
    },
    submitForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let len = this.defectReasonCodeParentId.length
          let defectReasonPid = len > 0 ? this.defectReasonCodeParentId[len - 1] : ''
          const { isLeaf } = this.dialogForm
          if (isLeaf) {
            if (!defectReasonPid) {
              return this.$message.warning('当前节点选择为子节点，上级节点不能为空！')
            }
          }
          let data = isEdit ? dialogForm : Object.assign({ defectReasonPid }, dialogForm)
          let res = isEdit ? await this.$api.editDefectReasonCode(data) : await this.$api.addDefectReasonCode(data)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getAllDefectReason')
            this.$emit('cannel')
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  }
}
</script>
