<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule" :isEdit="isEdit">
  <el-form-item label="客户代码" prop="mWmsCustomerCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerCode" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="客户名称" prop="mWmsCustomerName" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerName" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="公司地址" prop="mWmsCustomerAddress" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerAddress" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="城市" prop="mWmsCustomerCity" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerCity" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="省州" prop="mWmsCustomerProvince" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerProvince" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="国家" prop="mWmsCustomerCountry" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerCountry" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="联系人" prop="mWmsCustomerUser" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerUser" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mWmsCustomerPhone" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerPhone" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="邮编" prop="mWmsCustomerPostcode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerPostcode" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="传真" prop="mWmsCustomerFax" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerFax" size="mini"></el-input>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveCustomer">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsCustomerCode: '',
        mWmsCustomerName: '',
        mWmsCustomerAddress: '',
        mWmsCustomerCity: '',
        mWmsCustomerProvince: '',
        mWmsCustomerCountry: '',
        mWmsCustomerUser: '',
        mWmsCustomerPhone: '',
        mWmsCustomerPostcode: '',
        mWmsCustomerFax: ''
      },
      rules: {
        mWmsCustomerCode: [{ required: true, message: '客户代码不能为空' }],
        mWmsCustomerName: [{ required: true, message: '客户名称不能为空' }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    },
    getCustomer: {
      type: Function
    }
  },
  methods: {
    saveCustomer () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.updateBasicCustomer(dialogForm) : await this.$api.insertBasicCustomer(dialogForm)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getCustomer')
          } else {
            this.$message.error(msg)
          }
          this.$emit('cannel')
        }
      })
    }

  }
}
</script>
