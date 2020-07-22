<template>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="基本资料" name="info">
      <el-form v-model="iqcInfo"  label-width="90px" label-position="left" class="el-row mes-form-rule"  >
        <el-form-item label="料号" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.mComMaterialNo" disabled></el-input>
        </el-form-item>
          <el-form-item label="供应商料号" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini"  v-model="iqcInfo.vendorMaterialNo"  disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.lotQty" disabled style="width:60%"></el-input>
          <el-input style="width:35%;float:right" v-model="iqcInfo.qtyUom" disabled size="mini"></el-input>
        </el-form-item>
          <el-form-item label="仓码" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.warehouseNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="物料类别" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.materialClassCode" disabled></el-input>
        </el-form-item>
          <el-form-item label="品名" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.productName" disabled></el-input>
        </el-form-item>
        <el-form-item label="入库单号" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.stockInNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.vendorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商代码" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.vendorCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="采购单号" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.poNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="检规编号" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.sipNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="检规版次" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.sipVer" disabled></el-input>
        </el-form-item>
        <el-form-item label="检验日期" class="el-col el-col-7">
          <el-date-picker v-model="infoData.inspectDate" type="date" size="mini" style="width:100%;" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="批号" class="el-col el-col-7 el-col-offset-1">
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
