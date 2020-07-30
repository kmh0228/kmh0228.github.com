<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('common_SupplCode')" prop="mWmsVendorCode" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_SupplName')" prop="mWmsVendorName" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('vendor_CompaAddr')" prop="mWmsVendorAddress" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorAddress" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_city')" prop="mWmsVendorCity" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorCity" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ProviAndStat')" prop="mWmsVendorProvince" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorProvince" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_count')" prop="mWmsVendorCountry" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorCountry" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_conta')" prop="mWmsVendorUser" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorUser" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('vendor_Telep')" prop="mWmsVendorPhone" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorPhone" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('vendor_Postc')" prop="mWmsVendorPostcode" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.mWmsVendorPostcode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('vendor_Fax')" prop="mWmsVendorFax" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsVendorFax" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="handleVendor">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    }
  },
  computed: {
    rules () {
      return {
        mWmsVendorCode: [{ required: true, message: this.$t('vendor_SupplCodeCannBe') }],
        mWmsVendorName: [{ required: true, message: this.$t('vendor_SupplNameCannBe') }]
      }
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
