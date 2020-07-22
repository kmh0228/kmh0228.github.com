<template>
  <el-form :model="dialogFrom"  ref="dialogFrom" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item label="配置项编码" prop="configureCode" class="el-col el-col-24">
      <el-input :disabled="isEdit" v-model="dialogFrom.configureCode" placeholder="请输入配置项编码" ></el-input>
    </el-form-item>
    <el-form-item label="配置项名称" prop="configureName" class="el-col el-col-24">
      <el-input v-model="dialogFrom.configureName" dictType="DELIVERY_TYPE" placeholder="请输入配置项名称"></el-input>
    </el-form-item>
    <el-form-item label="配置项值" prop="configureValue" class="el-col el-col-24">
      <el-input v-model="dialogFrom.configureValue" style="width:100%"   placeholder="请输入配置项值"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark" class="el-col el-col-24">
      <el-input type="textarea"  :rows="2" v-model="dialogFrom.remark"></el-input>
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
      dialogFrom: {
        configureCode: '',
        configureName: '',
        configureValue: '',
        remark: ''
      },
      rules: {
        configureCode: [{ required: true, message: '请输入配置项编码' }],
        configureName: [{ required: true, message: '请输入配置项名称' }],
        configureValue: [{ required: true, message: '请输入配置项值' }]
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
      this.$refs.dialogFrom.validate(async valid => {
        if (valid) {
          let { dialogFrom } = this
          let res = this.isEdit ? await this.$api.updateConfigure(dialogFrom) : await this.$api.insertConfigure(dialogFrom)
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
