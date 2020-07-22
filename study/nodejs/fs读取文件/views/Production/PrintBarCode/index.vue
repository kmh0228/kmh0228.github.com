<template>
  <div class="mes-main">
     <div style="background-color:#F0F5F9;padding:15px 0 15px 15px;">
      <el-button type="primary" plain="" size="mini" @click="printBarCodes">打印</el-button>
    </div>
    <el-row :gutter="30" class="barcode-info" style="padding:15px;">
      <el-col :span="8" class="el-row" v-for="(item,i) in infoLabel" :key="i" style="margin-bottom:1.5vh;font-size:0.8vw;">
        <p class="el-col el-col-8">{{ item.label }}：</p>
        <p class="el-col el-col-16"></p>
      </el-col>
    </el-row>
    <el-form :model="printFrom" ref="printFrom" class="el-row mes-form-rule" :rules="rule" label-width="10vw" label-position="left" style="padding-top:15px;margin:0 15px;border-top:1px solid #d4d4d4;">
      <el-form-item label="SN/箱号/栈板号" prop="sn" class="el-col el-col-11">
        <el-input v-model.trim="printFrom.sn" placeholder="请输入SN/箱号/栈板号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="条码名称" prop="mPomWorkMasPrintTmplId" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="printFrom.mPomWorkMasPrintTmplId" style="width:100%" clearable>
          <el-option v-for="(option,i) in barCodeList" :key="i" :label="option.fileName" :value="option.mPomWorkMasPrintTmplId" @click.native="setPrintNumber(option.printCopies)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印机" prop="mPomLineStationPrinterId" class="el-col el-col-11">
        <el-select v-model="printFrom.mPomLineStationPrinterId" placeholder="请选择" style="width:100%" size="mini" filterable clearable>
          <el-option v-for="(option,i) in printerList" :key="i" :label="option.printerName" :value="option.mComPrinterId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印数量" prop="printCopies" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model.trim="printFrom.printCopies" placeholder="请输入打印数量" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <div class="mes-main-tabs" style="padding:15px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="打印记录" name="record">
          <el-table :data="recordList" border size="mini">
            <el-table-column label="SN/箱号/栈板号" align="center"></el-table-column>
            <el-table-column label="条码类型" align="center"></el-table-column>
            <el-table-column label="打印机" align="center"></el-table-column>
            <el-table-column label="打印数量" align="center"></el-table-column>
            <el-table-column label="打印时间" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const printCopiesRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入打印数量'))
      } else {
        if (/^[1-9][0-9]*$/.test(value)) {
          callback()
        } else {
          callback(new Error('打印数量必须为正整数'))
        }
      }
    }
    return {
      infoLabel: [{
        label: '产品系列',
        key: ''
      }, {
        label: '成品料号',
        key: ''
      }, {
        label: '工单号',
        key: ''
      }, {
        label: '线别',
        key: ''
      }, {
        label: '当前工站',
        key: ''
      }],
      infoValue: {},
      printFrom: {
        sn: '',
        mPomWorkMasPrintTmplId: '',
        mPomLineStationPrinterId: '',
        printCopies: 1
      },
      rule: {
        sn: [{ required: true, message: '请输入SN/箱号/栈板号' }],
        mPomWorkMasPrintTmplId: [{ required: true, message: '请选择条码名称' }],
        mPomLineStationPrinterId: [{ required: true, message: '请选择打印机' }],
        printCopies: [{ required: true, validator: printCopiesRule }]
      },
      printerList: [],
      barCodeList: [],
      activeName: 'record',
      recordList: []
    }
  },
  methods: {
    // 获取所有打印机
    async getPrinterList () {
      let data = {
        keyWord: '',
        pageIndex: 1,
        pageSize: 20
      }
      let res = await this.$api.getPrinters(data)
      if (res.code === '200') {
        this.printerList = res.data.list
      }
    },
    // 获取所有条码名称
    async getBarCodes () {
      let data = {
        keyWord: '',
        pageIndex: 1,
        pageSize: 20
      }
      let res = await this.$api.getPrintBarCodeType(data)
      if (res.code === '200') {
        this.barCodeList = res.data.list
      }
    },
    // 选择条码名称后，设置打印数量
    setPrintNumber (num) {
      this.printFrom.printCopies = num
    },
    // 打印条码
    printBarCodes () {
      this.$refs.printFrom.validate(async valid => {
        if (valid) {

        }
      })
    }
  },
  created () {
    this.getPrinterList()
    this.getBarCodes()
  }
}
</script>
