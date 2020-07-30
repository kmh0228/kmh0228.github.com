<template>
<el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="160px" class="el-row mes-form-rule" :rules="rules">
  <el-form-item :label="$t('OutboundOrder_DeliveryOrderNo')" prop="mWmsDeliveryNo" class="el-col el-col-24">
    <el-input v-model="dialogForm.mWmsDeliveryNo" ></el-input>
  </el-form-item>
  <el-form-item :label="$t('OutboundOrder_DeliveryMode')" prop="mWmsDeliveryTypeId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsDeliveryTypeId" dictType="DELIVERY_TYPE" :placeholder="$t('OutboundOrder_PleaseSelectDeliveryMethod')" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item :label="$t('OutboundOrder_WarehouseOut')" prop="mWmsDeliveryWharehouseid" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsDeliveryWharehouseid" style="width:100%"  filterable :placeholder="$t('OutboundOrder_PleaseSelectWarehouseOut')">
      <el-option v-for="(option,i) in mWmsOutwarehouseList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item :label="$t('OutboundOrder_DegreeOfUrgency')" prop="mWmsDeliveryLevelId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsDeliveryLevelId" dictType="EMERGENCY_TYPE"  :placeholder="$t('OutboundOrder_PleaseSelectTheEmergencyLevel')" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item :label="$t('OutboundOrder_Customer')" prop="mWmsDeliveryCustomerId" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsDeliveryCustomerId" style="width:100%" filterable :placeholder="$t('OutboundOrder_PleaseSelectCustomer')">
      <el-option v-for="(option,i) in mWmsCustomerList" :key="i" :label="option.mWmsCustomerName" :value="option.mWmsCustomerId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDeliveryList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
  </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsDeliveryNo: '',
        mWmsDeliveryTypeId: '',
        mWmsDeliveryWharehouseid: '',
        mWmsDeliveryLevelId: '',
        mWmsDeliveryCustomerId: ''
      },
      outOrderList: [],
      mWmsOutwarehouseList: [],
      mWmsCustomerList: [],
      searchForm: {
        pageIndex: 1,
        pageSize: 1000,
        keywords: ''
      },
      // 供应商查询条件
      searchVendors: {
        pageIndex: 1,
        pageSize: 1000,
        mWmsCustomerCode: ''
      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getOutboundOrder: Function
  },
  computed: {
    mWmsEmergencyList () {
      return [
        {
          label: this.$t('OutboundOrder_Commonly'),
          value: this.$t('OutboundOrder_Commonly')
        },
        {
          label: this.$t('OutboundOrder_urgent'),
          value: this.$t('OutboundOrder_urgent')
        }
      ]
    },
    rules () {
      return {
        mWmsDeliveryNo: [{ required: true, message: this.$t('OutboundOrder_Tips6') }],
        mWmsDeliveryTypeId: [{ required: true, message: this.$t('OutboundOrder_PleaseSelectDeliveryMethod') }],
        mWmsDeliveryWharehouseid: [{ required: true, message: this.$t('OutboundOrder_PleaseSelectWarehouseOut') }],
        mWmsDeliveryLevelId: [{ required: true, message: this.$t('OutboundOrder_PleaseSelectTheEmergencyLevel') }],
        mWmsDeliveryCustomerId: [{ required: true, message: this.$t('OutboundOrder_PleaseSelectSupplier') }]

      }
    }
  },
  methods: {
    async getCustomers () {
      let data = Object.assign(this.searchVendors)
      let res = await this.$api.getCustomers(data)
      this.mWmsCustomerList = res.data.list
    },
    async getWarehouses () {
      let { searchForm } = this
      let data = Object.assign(searchForm)
      let res = await this.$api.getWarehouses(data)
      this.mWmsOutwarehouseList = res.data.list
    },
    saveDeliveryList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let data = Object.assign(dialogForm)
          let res = isEdit ? await this.$api.editOutOrder(data) : await this.$api.addOutOrder(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getOutboundOrder')
          })
        }
      })
    }
  },
  created () {
    this.getWarehouses()
    this.getCustomers()
  }

}
</script>
