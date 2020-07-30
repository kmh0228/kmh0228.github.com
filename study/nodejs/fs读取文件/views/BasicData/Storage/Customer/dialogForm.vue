<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule" :isEdit="isEdit">
  <el-form-item :label="$t('common_CustoCode')" prop="mWmsCustomerCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerCode" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('customer_CustoName')" prop="mWmsCustomerName" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerName" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('customer_CompaAddr')" prop="mWmsCustomerAddress" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerAddress" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_city')" prop="mWmsCustomerCity" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerCity" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_ProviAndStat')" prop="mWmsCustomerProvince" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerProvince" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_count')" prop="mWmsCustomerCountry" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerCountry" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_conta')" prop="mWmsCustomerUser" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerUser" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('customer_Telep')" prop="mWmsCustomerPhone" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerPhone" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('customer_Postc')" prop="mWmsCustomerPostcode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.mWmsCustomerPostcode" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('customer_Fax')" prop="mWmsCustomerFax" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.mWmsCustomerFax" size="mini"></el-input>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveCustomer">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
  computed: {
    rules () {
      return {
        mWmsCustomerCode: [{ required: true, message: this.$t('customer_CustoCodeCannBe') }],
        mWmsCustomerName: [{ required: true, message: this.$t('customer_CustoNameCannBe') }]
      }
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
