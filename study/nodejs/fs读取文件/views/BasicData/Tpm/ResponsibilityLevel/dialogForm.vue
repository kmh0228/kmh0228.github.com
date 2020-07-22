<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item label="工厂" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item label="责任层级代码" prop="hierarchyCode" class="el-col el-col-24">
      <el-input v-model="dialogForm.hierarchyCode" dictType="DELIVERY_TYPE" placeholder="请输入责任层级代码"></el-input>
    </el-form-item>
    <el-form-item label="责任层级名称" prop="hierarchyName" class="el-col el-col-24">
      <el-input v-model="dialogForm.hierarchyName" style="width:100%"   placeholder="请输入责任层级名称"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description" class="el-col el-col-24">
      <el-input type="textarea"  :rows="2" v-model="dialogForm.description"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDeliveryList">保存</el-button>
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
        hierarchyCode: '',
        hierarchyName: '',
        description: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择工厂' }],
        hierarchyCode: [{ required: true, message: '请输入责任层级代码' }],
        hierarchyName: [{ required: true, message: '请输入责任层级名称' }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getTableData: Function
  },
  methods: {
    saveDeliveryList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          console.log(dialogForm)
          let res = this.isEdit ? await this.$api.modifyHierarchy(dialogForm) : await this.$api.saveHierarchy(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTableData')
          })
        }
      })
    }
  }
}
</script>
