<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="供应商代码" prop="mWmsVendorCode" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="供应商名称" prop="mWmsVendorName" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="公司地址" prop="mWmsVendorAddress" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorAddress" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="城市" prop="mWmsVendorCity" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorCity" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="省州" prop="mWmsVendorProvince" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorProvince" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="国家" prop="mWmsVendorCountry" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorCountry" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="mWmsVendorUser" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorUser" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="mWmsVendorPhone" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorPhone" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="邮编" prop="mWmsVendorPostcode" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorPostcode" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="传真" prop="mWmsVendorFax" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorFax" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="handleVendor">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsVendorCode: '',
        mWmsVendorName: '',
        mWmsVendorAddress: '',
        mWmsVendorCity: '',
        mWmsVendorProvince: '',
        mWmsVendorCountry: '',
        mWmsVendorUser: '',
        mWmsVendorPhone: '',
        mWmsVendorPostcode: '',
        mWmsVendorFax: ''
      },
      rules: {
        mWmsVendorCode: [{ required: true, message: '供应商代码不能为空' }],
        mWmsVendorName: [{ required: true, message: '供应商名称不能为空' }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    handleVendor () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.editVendor(dialogForm) : await this.$api.createVendor(dialogForm)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getVendors')
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
