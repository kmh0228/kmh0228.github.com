<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('jobSplit_PartsWorkOrdeSpli')}}</h3>
    <div class="mes-handle-group">
      <el-button size="mini" @click="splitPartWorkOrder">{{$t('jobSplit_split')}}</el-button>
      <span class="split-line">|</span>
      <el-button size="mini" @click="confirm">{{$t('common_ok')}}</el-button>
      <!-- <span class="split-line">|</span>
      <el-button size="mini">{{$t('jobSplit_BatchPrin')}}</el-button> -->
    </div>
    <el-form :model="form" ref="form" size="mini" label-position="left" label-width="30%" class="el-row work-order-info mes-form-rule" :rules="rules">
      <el-form-item :label="$t('common_WorkOrdeNo')" prop="docNo" class="el-col el-col-12" >
        <el-select v-model="form.docNo" size="mini" filterable clearable class="mes-form-item" :placeholder="$t('jobSplit_selecWorkOrdeNo')">
          <el-option v-for="option in workOrderList" :key="option.tpomJobOrderId" :label="option.docNo" :value="option.docNo" @click.native="setWorkOorderData(option)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common_PorN')" prop="materialNo" class="el-col el-col-12" >
        <el-input v-model="form.materialNo" disabled size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('jobSplit_WorkOrdeDemaQuan')" prop="requestQty" class="el-col el-col-12" >
        <el-input v-model="form.requestQty" disabled size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_dateManu')" prop="productDate" class="el-col el-col-12" >
        <el-date-picker v-model="form.productDate" type="datetime" size="mini" :placeholder="$t('common_SelecDate')" class="mes-form-item"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('jobSplit_rawMateLOT')" prop="lot" class="el-col el-col-12" >
        <el-input v-model="form.lot" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('jobSplit_ModulNumb')" prop="model" class="el-col el-col-12" >
        <el-input v-model="form.model" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_Machi')" prop="mcomEqpId" class="el-col el-col-12" >
        <el-select v-model="form.mcomEqpId" filterable clearable size="mini" class="mes-form-item">
          <el-option v-for="option in eqpList" :key="option.eqpId" :label="option.machineCode" :value="option.eqpId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('jobSplit_TotalSpliQuan')" prop="splitQty" class="el-col el-col-12" >
        <el-input v-model="form.splitQty" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_StockInNo')" prop="inputNo" class="el-col el-col-12" >
        <el-input v-model="form.inputNo" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('jobSplit_QuantPerBag')" prop="packageQty" class="el-col el-col-12" >
        <el-input v-model="form.packageQty" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
    </el-form>
    <div class="mes-main-tabs">
      <el-tabs v-model="tabAciveName">
        <el-tab-pane :label="$t('jobSplit_SplitResu')" name="result">
          <div class="mes-table">
            <el-table :data="tableData" border highlight-current-row size="mini">
              <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
              <el-table-column :label="$t('common_PorN')" prop="materialNo" align="center"></el-table-column>
              <el-table-column :label="$t('common_WorkOrdeNo')" prop="docNo" align="center"></el-table-column>
              <el-table-column :label="$t('jobSplit_seriaNumb')" prop="productSn" align="center"></el-table-column>
              <el-table-column :label="$t('jobSplit_SplitTime')" prop="splitDate"  align="center"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
       </el-tabs>
    </div>
 </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        docNo: '',
        mcomMaterialId: '',
        meterialNo: '',
        requestQty: '',
        productDate: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        lot: '',
        model: '',
        mcomEqpId: '',
        splitQty: '',
        inputNo: '',
        packageQty: '',
        tpomJobOrderId: ''
      },
      workOrderList: [],
      eqpList: [],
      tabAciveName: 'result',
      tableData: []
    }
  },
  computed: {
    rules () {
      return {
        docNo: [{ required: true, message: this.$t('jobSplit_selecWorkOrdeNo'), trigger: 'blur' }],
        lot: [{ required: true, message: this.$t('jobSplit_RawCannotEmpty'), trigger: 'blur' }],
        mcomEqpId: [{ required: true, message: this.$t('jobSplit_selecMach'), trigger: 'blur' }],
        splitQty: [{ required: true, message: this.$t('jobSplit_TotalSpliQuanBeEmpt'), trigger: 'blur' }],
        packageQty: [{ required: true, message: this.$t('jobSplit_quantEachBagBeEmpt'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getPartWorkOrderList () {
      const res = await this.$api.getPartWorkOrderList()
      const { code, data } = res
      if (code === '200') {
        this.workOrderList = data
      } else {
        this.workOrderList = []
      }
    },
    // 获取所有机台
    async getEqp () {
      const res = await this.$api.getEqp()
      const { code, data } = res
      if (code === '200') {
        this.eqpList = data
      } else {
        this.eqpList = []
      }
    },
    setWorkOorderData (info) {
      this.form.materialNo = info.materialNo
      this.form.mcomMaterialId = info.mcomMaterialId
      this.form.requestQty = info.requestQty
      this.form.tpomJobOrderId = info.tpomJobOrderId
    },
    splitPartWorkOrder () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await this.$api.splitPartWorkOrder(this.form)
          const { code, data, msg } = res
          if (code === '200') {
            this.tableData = data
          } else {
            this.tableData = []
            this.$message.error(msg)
          }
        }
      })
    },
    confirm () {
      this.tableData = []
      this.$refs.form.resetFields()
    }
  },
  created () {
    this.getEqp()
    this.getPartWorkOrderList()
  }
}
</script>
