<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">零件工单拆分</h3>
    <div class="mes-handle-group">
      <el-button size="mini" @click="splitPartWorkOrder">拆分</el-button>
      <span class="split-line">|</span>
      <el-button size="mini" @click="confirm">确定</el-button>
      <!-- <span class="split-line">|</span>
      <el-button size="mini">批量打印</el-button> -->
    </div>
    <el-form :model="form" ref="form" size="mini" label-position="left" label-width="30%" class="el-row work-order-info mes-form-rule" :rules="rules">
      <el-form-item label="工单号" prop="docNo" class="el-col el-col-12" >
        <el-select v-model="form.docNo" size="mini" filterable clearable class="mes-form-item" placeholder="请选择工单号">
          <el-option v-for="option in workOrderList" :key="option.tpomJobOrderId" :label="option.docNo" :value="option.docNo" @click.native="setWorkOorderData(option)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="料号" prop="materialNo" class="el-col el-col-12" >
        <el-input v-model="form.materialNo" disabled size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item label="工单需求数量" prop="requestQty" class="el-col el-col-12" >
        <el-input v-model="form.requestQty" disabled size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item label="生产日期" prop="productDate" class="el-col el-col-12" >
        <el-date-picker v-model="form.productDate" type="datetime" size="mini" placeholder="选择日期" class="mes-form-item"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="原料LOT" prop="lot" class="el-col el-col-12" >
        <el-input v-model="form.lot" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item label="模号" prop="model" class="el-col el-col-12" >
        <el-input v-model="form.model" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item label="机台" prop="mcomEqpId" class="el-col el-col-12" >
        <el-select v-model="form.mcomEqpId" filterable clearable size="mini" class="mes-form-item">
          <el-option v-for="option in eqpList" :key="option.eqpId" :label="option.machineCode" :value="option.eqpId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拆分总数量" prop="splitQty" class="el-col el-col-12" >
        <el-input v-model="form.splitQty" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item label="入库单号" prop="inputNo" class="el-col el-col-12" >
        <el-input v-model="form.inputNo" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item label="每包带数量" prop="packageQty" class="el-col el-col-12" >
        <el-input v-model="form.packageQty" size="mini" class="mes-form-item"></el-input>
      </el-form-item>
    </el-form>
    <div class="mes-main-tabs">
      <el-tabs v-model="tabAciveName">
        <el-tab-pane label="拆分结果" name="result">
          <div class="mes-table">
            <el-table :data="tableData" border highlight-current-row size="mini">
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column label="料号" prop="materialNo" align="center"></el-table-column>
              <el-table-column label="工单号" prop="docNo" align="center"></el-table-column>
              <el-table-column label="序列号" prop="productSn" align="center"></el-table-column>
              <el-table-column label="拆分时间" prop="splitDate"  align="center"></el-table-column>
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
      rules: {
        docNo: [{ required: true, message: '请选择工单号', trigger: 'blur' }],
        lot: [{ required: true, message: '原料LOT不能为空', trigger: 'blur' }],
        mcomEqpId: [{ required: true, message: '请选择机台', trigger: 'blur' }],
        splitQty: [{ required: true, message: '拆分总数量不能为空', trigger: 'blur' }],
        packageQty: [{ required: true, message: '每包带数量不能为空', trigger: 'blur' }]
      },
      tabAciveName: 'result',
      tableData: []
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
