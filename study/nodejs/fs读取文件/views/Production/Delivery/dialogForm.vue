<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('common_Department')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" type="2" style="width:100%" size="mini" :placeholder="$t('common_PleasSeleDepa')"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('delivery_ShippOrdeNo')" prop="docNo" class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.docNo"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Status')" prop="docStatus"  class="el-col el-col-24">
      <el-input size="mini" :disabled="true" v-model="dialogForm.docStatus"></el-input>
    </el-form-item>
    <el-form-item :label="$t('delivery_SalesOrdeNo')" prop="tpomSalesOrderId"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.tpomSalesOrderId"></el-input>
    </el-form-item>
    <el-form-item :label="$t('delivery_ShippCoun')" prop="city"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.city"></el-input>
    </el-form-item>
      <el-form-item :label="$t('delivery_typeShip')" prop="shipToPartyName"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.shipToPartyName"></el-input>
    </el-form-item>
    <el-form-item :label="$t('delivery_ShippAddr')" prop="shipToAddress"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.shipToAddress"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        docNo: '',
        docStatus: '',
        tpomSalesOrderId: '',
        city: '',
        shipToPartyName: '',
        shipToAddress: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleDepa') }],
        docNo: [{ required: true, message: this.$t('delivery_ShippOrdeNoBeEmpt') }]
      }
    }
  },
  props: {
    cannel: {
      type: Function
    },
    isEdit: {
      type: Boolean
    },
    getShipOrder: {
      type: Function
    }
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let res = this.isEdit ? await this.$api.updateShipOrder(this.dialogForm) : await this.$api.insertShipOrder(this.dialogForm)
          console.log(res)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getShipOrder')
          })
        }
      })
    }
  },
  created () {
  }
}
</script>
