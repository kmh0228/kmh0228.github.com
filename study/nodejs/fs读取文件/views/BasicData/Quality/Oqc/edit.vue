<template>
<div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button  :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('DRAFT')">保存</el-button>
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="saveData('SUBMITTED')">提交</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
      <span class="status_class">单号：{{infoData.batchNo}}</span>
      <span class="status_class" style="margin-left:3vw">状态：{{ oqcState }}</span>
    </div>
     <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
        <el-form-item label="销货单号:" prop="soNo" class="el-col el-col-7">
          <mes-select v-model="infoData.soNo" labelKey="mWmsDeliveryNo" valueKey="mWmsDeliveryId" method="getOutboundOrder" clearable :disabled="true"></mes-select>
        </el-form-item>
        <!-- <el-form-item label="销货单项次" prop="soItem" class="el-col el-col-7 el-col-offset-1">
           <el-input v-model="infoData.soItem" disabled ></el-input>
        </el-form-item> -->
        <el-form-item label="客户采购单" prop="cpoNo" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.cpoNo"></el-input>
        </el-form-item>
        <el-form-item label="稽核班次" prop="inspectionShift" class="el-col el-col-7 el-col-offset-1">
          <el-select style="width:100%" size="mini" clearable placeholder="请选择班别"  v-model="infoData.inspectionShift">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="料号:" prop="mComMaterialId" class="el-col el-col-7">
          <el-input v-model="materialNo" disabled ></el-input>
        </el-form-item>
        <el-form-item label="品名" prop="productName" class="el-col el-col-7 el-col-offset-1">
           <el-input disabled  v-model="infoData.productName"></el-input>
        </el-form-item>
        <el-form-item label="客户料号" prop="custMaterialNo" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.custMaterialNo"></el-input>
        </el-form-item>
        <el-form-item label="数量:"  class="el-col el-col-7">
         <el-input  v-model="infoData.qty" style="width:60%"></el-input>
         <el-input   v-model="infoData.qtyUom" style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item label="箱数" prop="boxQty" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.boxQty"></el-input>
        </el-form-item>
        <el-form-item label="总数量" prop="soTotalQty" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.soTotalQty"></el-input>
        </el-form-item>
        <el-form-item label="毛重:" prop="grossWeight" class="el-col el-col-7">
          <el-input  v-model="infoData.grossWeight" style="width:60%"></el-input>
          <el-input  v-model="infoData.weightUom"  style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item label="净重" prop="netWeight" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.netWeight" style="width:60%"></el-input>
           <el-input  v-model="infoData.weightUom"  style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item label="栈板状态" prop="palletStatus" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.palletStatus" ></el-input>
        </el-form-item> -->
        <el-form-item label="检验日期:" prop="inspectDate" class="el-col el-col-7">
         <el-date-picker  v-model="infoData.inspectDate" type="date"  placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="检验员" prop="inspector" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item label="客户代码:" prop="customerCode" class="el-col el-col-7 el-col-offset-1">
         <el-input v-model="infoData.customerCode" disabled  ></el-input>
        </el-form-item>
        <el-form-item label="需要出货报告:" class="el-col el-col-23">
          <el-radio-group v-model="infoData.isReportRequired">
            <el-radio :label="true">Y</el-radio>
            <el-radio :label="false">N</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" class="el-col el-col-23">
         <el-input  v-model="infoData.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
   </el-card>
   <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
      <div slot="header" class="clearfix">
      <span>料号信息</span>
      </div>
      <div class="mes-table">
        <div class="mes-table-content">
          <el-table :data="materialTable" border size="mini">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="materialNo" label="料号" align="center"></el-table-column>
            <el-table-column prop="productName" label="品名" align="center"></el-table-column>
            <el-table-column prop="custMaterialNo"  label="客户料号" align="center"></el-table-column>
            <el-table-column prop="qty" label="数量" align="center"></el-table-column>
            <el-table-column prop="qtyUom" label="数量单位" align="center"></el-table-column>
            <el-table-column prop="boxQty" label="箱数" align="center"></el-table-column>
            <el-table-column prop="judgeResult" label="判定结果" align="center">
              <template slot-scope="scope">
                  <el-select style="width:100%" size="mini" v-model="scope.row.judgeResult"  >
                    <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"></el-option>
                  </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
   <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
    <div slot="header" class="clearfix">
    <span>检规记录</span>
    </div>
    <div class="mes-table">
      <div class="mes-table-content">
        <el-table :data="checkData" border size="mini">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="inspectItem" label="类型" align="center"></el-table-column>
          <el-table-column prop="inspectItem" label="检验项目" align="center"></el-table-column>
          <el-table-column prop="inspectContent"  label="检验内容" align="center"></el-table-column>
          <el-table-column prop="inspectResult" label="判定结果" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult"  >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"  @click.native="dispatchNg(scope.row)"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" title="ng页面"  width="800px" class="handle-dialog">
        <ng-dialog v-if="dialogVisible" ref="dialog" :detailId="detailId" @cannel="cannel"></ng-dialog>
      </el-dialog>
    </div>
  </el-card>
</div>
</template>

<script>
import ngDialog from '../Components/ngDialog'

import { mapActions } from 'vuex'
export default {
  data () {
    return {
      oqcState: '',
      infoData: {
        batchNo: '',
        soNo: '',
        cpoNo: '',
        inspectDate: this.$dayjs().format('YYYY-MM-DD'),
        inspector: '',
        inspectionShift: '',
        customerCode: '',
        remark: ''
      },
      materialNo: '',
      rules: {
        soNo: [{ required: true, message: '请输入销货单号' }],
        mComMaterialId: [{ required: true, message: '请选择料号' }],
        customerCode: [{ required: true, message: '请选择客户代码' }],
        qty: [{ required: true, message: '请输入数量' }],
        inspectDate: [{ required: true, message: '请选择检验日期' }]
      },
      resultArray: ['OK', 'NG', '空白'],
      checkData: [],
      shiftList: [],
      dialogVisible: false,
      detailId: '',
      materialTable: []
    }
  },
  computed: {
    buttonDisabled () {
      return this.oqcState === '已提交'
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
        this.detailId = row.tQomOqcDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    ...mapActions(['changeQmsStatus']),
    setStatus () {
      this.oqcState = this.$route.query.status === 'DRAFT' ? '未提交' : '已提交'
    },
    saveData (docStatus) {
      this.$refs.infoData.validate(async valid => {
        if (valid) {
          let tQomOqcMainId = this.$route.query.id
          let { infoData, checkData, materialTable } = this
          let items = checkData
          let parts = materialTable
          let data = Object.assign({ items, tQomOqcMainId, parts }, infoData)
          data.docStatus = docStatus
          let res = await this.$api.updateOqc(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    },
    // 获取班别列表
    async getShiftList () {
      const data = {
        shiftName: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getShiftList(data)
      this.shiftList = res.data.list
    },
    async setDefaultData () {
      const tQomOqcMainId = this.$route.query.id
      const res = await this.$api.findOqc({ tQomOqcMainId })
      const { code, data } = res
      if (code === '200') {
        let keys = Object.keys(this.infoData)
        keys.forEach(key => {
          this.infoData[key] = data[key]
        })
        this.infoData.inspectDate = this.$dayjs(this.infoData.inspectDate).format('YYYY-MM-DD')
        this.materialNo = data.materialNo
        this.checkData = data.items
        this.materialTable = data.parts
      } else {
        this.$message.warning('获取数据失败，请关闭后再试！')
      }
    },
    closeCurrentPage () {
      this.changeQmsStatus(true)
      this.$router.replace('/BasicData/Quality/Oqc')
    }
  },
  created () {
    this.setStatus()
    this.setDefaultData()
    this.getShiftList()
  },
  components: {
    ngDialog
  }
}
</script>

<style lang="scss">
.span_class {
  display: block;
  height: 100%;
  width: 100%;
}
.status_class {
  font-size: 1vw;
  margin-left: 20vw;
  color: #3b6f9a;
}
</style>
