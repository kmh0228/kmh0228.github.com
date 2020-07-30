<template>
  <el-tabs v-model="activeName" >
    <el-tab-pane :label="$t('common_BasicInfo')" name="info">
      <el-form v-model="iqcInfo"  label-width="150px" label-position="left" class="el-row mes-form-rule"  >
        <el-form-item :label="$t('common_PorN')" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.mComMaterialNo" disabled></el-input>
        </el-form-item>
          <el-form-item :label="$t('IqcList_SupplierItemNo')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini"  v-model="iqcInfo.vendorMaterialNo"  disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_numbe')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.lotQty" disabled style="width:60%"></el-input>
          <el-input style="width:35%;float:right" v-model="iqcInfo.qtyUom" disabled size="mini"></el-input>
        </el-form-item>
          <el-form-item :label="$t('IqcList_WarehouseCode')" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.warehouseNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IqcList_MaterialCategory')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.materialClassCode" disabled></el-input>
        </el-form-item>
          <el-form-item :label="$t('common_ProduName')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.productName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_StockInNo')" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.stockInNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_SupplName')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.vendorName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_SupplCode')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.vendorCode" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IqcList_PurchaseOrderNo')" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.poNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IqcList_InspectionSpecificationNo')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.sipNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IqcList_InspectionRegulationRevision')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.sipVer" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_InspeDate')" class="el-col el-col-7">
          <el-date-picker v-model="infoData.inspectDate" type="date" size="mini" style="width:100%;" :placeholder="$t('common_SelecDate')"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common_BatchNumb')" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="infoData.lotNo"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'info',
      infoData: {
        inspectDate: '',
        lotNo: ''
      }
    }
  },
  props: {
    iqcInfo: Object
  },
  methods: {
    setInfoData () {
      const keys = Object.keys(this.infoData)
      keys.forEach(key => {
        this.infoData[key] = this.iqcInfo[key]
      })
    }
  },
  created () {
    this.setInfoData()
  }
}
</script>
