<template>
<el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
  <el-form-item label="出库单号" prop="mWmsDeliveryNo" class="el-col el-col-24">
    <el-input v-model="dialogForm.mWmsDeliveryNo" ></el-input>
  </el-form-item>
  <el-form-item label="出库方式" prop="mWmsDeliveryTypeId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsDeliveryTypeId" dictType="DELIVERY_TYPE" placeholder="请选择出库方式" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item label="出库库房" prop="mWmsDeliveryWharehouseid" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsDeliveryWharehouseid" style="width:100%"  filterable placeholder="请选择出库库房">
      <el-option v-for="(option,i) in mWmsOutwarehouseList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="紧急程度" prop="mWmsDeliveryLevelId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsDeliveryLevelId" dictType="EMERGENCY_TYPE"  placeholder="请选择紧急程度" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item label="客户" prop="mWmsDeliveryCustomerId" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsDeliveryCustomerId" style="width:100%" filterable placeholder="请选择客户">
      <el-option v-for="(option,i) in mWmsCustomerList" :key="i" :label="option.mWmsCustomerName" :value="option.mWmsCustomerId"></el-option>
    </el-select>
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
        mWmsDeliveryNo: '',
        mWmsDeliveryTypeId: '',
        mWmsDeliveryWharehouseid: '',
        mWmsDeliveryLevelId: '',
        mWmsDeliveryCustomerId: ''
      },
      outOrderList: [],
      mWmsOutwarehouseList: [],
      mWmsEmergencyList: [
        {
          label: '一般',
          value: '一般'
        },
        {
          label: '紧急',
          value: '紧急'
        }
      ],
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
      },
      rules: {
        mWmsDeliveryNo: [{ required: true, message: '出库单号不能为空' }],
        mWmsDeliveryTypeId: [{ required: true, message: '请选择出库方式' }],
        mWmsDeliveryWharehouseid: [{ required: true, message: '请选择出库库房' }],
        mWmsDeliveryLevelId: [{ required: true, message: '请选择紧急程度' }],
        mWmsDeliveryCustomerId: [{ required: true, message: '请选择供应商' }]

      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getOutboundOrder: Function
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
