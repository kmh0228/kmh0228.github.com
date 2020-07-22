<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="部门" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" type="2" style="width:100%" size="mini" placeholder="请选择部门"></cascader-select>
    </el-form-item>
    <el-form-item label="出货单号" prop="docNo" class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.docNo"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="docStatus"  class="el-col el-col-24">
      <el-input size="mini" :disabled="true" v-model="dialogForm.docStatus"></el-input>
    </el-form-item>
    <el-form-item label="销售单号" prop="tpomSalesOrderId"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.tpomSalesOrderId"></el-input>
    </el-form-item>
    <el-form-item label="出货国家" prop="city"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.city"></el-input>
    </el-form-item>
      <el-form-item label="运输方式" prop="shipToPartyName"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.shipToPartyName"></el-input>
    </el-form-item>
    <el-form-item label="出货地址" prop="shipToAddress"  class="el-col el-col-24">
      <el-input size="mini" v-model="dialogForm.shipToAddress"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
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
        docNo: '',
        docStatus: '',
        tpomSalesOrderId: '',
        city: '',
        shipToPartyName: '',
        shipToAddress: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择部门' }],
        docNo: [{ required: true, message: '出货单号不能为空' }]
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
