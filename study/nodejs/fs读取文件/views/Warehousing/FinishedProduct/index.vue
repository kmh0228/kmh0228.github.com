<template>
  <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain>入库完成</el-button>
    </div>
    <el-form style="margin-bottom:0;padding-bottom:0;" :model="formData" ref="formData" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item label="箱号/栈板号" class="el-col el-col-11" prop="boxPalletNo">
        <el-input placeholder="请在下方进行扫描"  v-model="formData.boxPalletNo" readonly clearable></el-input>
      </el-form-item>
      <el-form-item label="料号" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="formData.materialNo" disabled clearable></el-input>
      </el-form-item>
      <el-form-item label="数量" class="el-col el-col-11">
        <el-input v-model="formData.productQty" disabled clearable></el-input>
      </el-form-item>
      <el-form-item label="包装日期" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="formData.packageTime" disabled clearable></el-input>
      </el-form-item>
      <el-form-item label="仓库" class="el-col el-col-11">
        <mes-select v-model="formData.mWmsWarehouseWarehouseid" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" placeholder="请选择仓库" @change="warehouseChange"></mes-select>
      </el-form-item>
      <el-form-item label="储位" class="el-col el-col-11 el-col-offset-1">
        <mes-select v-model="formData.mWmsWarehouseBinId" ref="binSelect" isLinkage :params="warehouseBinParams" method="getBin" labelKey="mWmsWarehouseBinCode" valueKey="mWmsWarehouseBinId" placeholder="请选择储位"></mes-select>
      </el-form-item>
    </el-form>
    <div class="mes-work-order" style="padding-top:0;">
      <div class="mes-main-tabs">
        <el-tabs class="mes-table" v-model="activeTab">
          <el-tab-pane label="入库记录" name="record" class="mes-table-content">
            <el-table :data="recordList" border>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column label="包装号" align="center"></el-table-column>
              <el-table-column label="料号" align="center"></el-table-column>
              <el-table-column label="数量" align="center"></el-table-column>
              <el-table-column label="仓库" align="center"></el-table-column>
              <el-table-column label="储位" align="center"></el-table-column>
              <el-table-column label="作业人" align="center"></el-table-column>
              <el-table-column label="作业时间" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <scan-input scanType="箱号/栈板号" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
import scanInput from '@/views/Production/DataAcquisition/Module/scanInput'
export default {
  data () {
    return {
      formData: {
        boxPalletNo: '',
        materialNo: '',
        productQty: '',
        packageTime: '',
        mWmsWarehouseWarehouseid: '',
        mWmsWarehouseBinId: ''
      },
      warehouseBinParams: {
        mWmsWarehouseBinWarehouseid: ''
      },
      activeTab: 'record',
      recordList: [],
      rules: {}
    }
  },
  methods: {
    warehouseChange (val) {
      this.formData.mWmsWarehouseBinId = ''
      this.warehouseBinParams.mWmsWarehouseBinWarehouseid = val
      this.$refs.binSelect.getOptions()
    },
    async scanCode (boxPalletNo) {
      const res = await this.$api.getProductInfoByBoxPalletNo({ boxPalletNo })
      this.$myPrompt.handleMsg(res, (data) => {
        this.formData.boxPalletNo = data.boxPalletNo
        this.formData.materialNo = data.materialNo
        this.formData.productQty = data.productQty
        this.formData.packageTime = data.packageTime
      }, false)
    }
  },
  components: {
    scanInput
  }
}
</script>
