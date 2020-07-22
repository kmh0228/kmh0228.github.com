<template>
<div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary" plain size="mini" @click="saveData('DRAFT')">保存</el-button>
      <el-button type="primary" plain size="mini" @click="saveData('SUBMITTED')">提交</el-button>
      <el-button type="primary" plain size="mini" @click="closePage">关闭</el-button>
       <span class="status_class">状态：{{ oqcState }}</span>
    </div>
     <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
        <el-form-item label="销货单号:" prop="soNo" class="el-col el-col-7">
          <mes-select v-model="infoData.soNo" labelKey="mWmsDeliveryNo" valueKey="mWmsDeliveryId" method="getOutboundOrder" clearable @change="getPartInfo"></mes-select>
        </el-form-item>
        <!-- <el-form-item label="销货单项次" prop="soItem" class="el-col el-col-7 el-col-offset-1">
           <el-input v-model="infoData.soItem"></el-input>
        </el-form-item> -->
        <el-form-item label="客户采购单" prop="cpoNo" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model="infoData.cpoNo"></el-input>
        </el-form-item>
        <el-form-item label="稽核班次" prop="inspectionShift" class="el-col el-col-7 el-col-offset-1">
          <el-select style="width:100%" size="mini" clearable placeholder="请选择班别"  v-model="infoData.inspectionShift" >
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="料号:" prop="mComMaterialId" class="el-col el-col-7">
          <material-select  v-model="infoData.mComMaterialId"  style="width:100%" @change="getProductName" ></material-select>
        </el-form-item>
        <el-form-item label="品名" prop="productName" class="el-col el-col-7 el-col-offset-1">
           <el-input disabled  v-model="infoData.productName"></el-input>
        </el-form-item>
        <el-form-item label="客户料号" prop="custMaterialNo" class="el-col el-col-7 el-col-offset-1">
          <el-input v-model="infoData.custMaterialNo" ></el-input>
        </el-form-item>
        <el-form-item label="数量:" prop="qty" class="el-col el-col-7">
         <el-input  v-model.number="infoData.qty" style="width:60%"></el-input>
         <el-input   v-model="infoData.qtyUom" style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item label="箱数" prop="boxQty" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model.number="infoData.boxQty"></el-input>
        </el-form-item>
        <el-form-item label="总数量" prop="soTotalQty" class="el-col el-col-7 el-col-offset-1">
           <el-input  v-model.number="infoData.soTotalQty"></el-input>
        </el-form-item>
        <el-form-item label="毛重:" prop="grossWeight" class="el-col el-col-7">
          <el-input  v-model="infoData.grossWeight" style="width:60%" :blur="checkNumber(infoData.grossWeight)"></el-input>
          <el-input  v-model="infoData.weightUom"  style="width:35%;float:right"></el-input>
        </el-form-item>
        <el-form-item label="净重" prop="netWeight" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.netWeight" style="width:60%" :blur="checkNumber(infoData.netWeight)"></el-input>
          <el-input   v-model="infoData.weightUom" style="width:35%;float:right"></el-input>
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
         <el-autocomplete v-model="infoData.customerCode" :fetch-suggestions="querySearchAsync" value-key="mWmsCustomerCode" @blur="findCustomCheckitem" placeholder="请输入" style="width:100%;" ></el-autocomplete>
        </el-form-item>
        <el-form-item label="需要出货报告:" class="el-col el-col-23">
          <el-radio-group v-model="isReportRequired">
            <el-radio :label="1">Y</el-radio>
            <el-radio :label="0">N</el-radio>
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
          <el-table-column prop="itemTypeDictName" label="类型" align="center"></el-table-column>
          <el-table-column prop="inspectItem" label="检验项目" align="center"></el-table-column>
          <el-table-column prop="inspectContent"  label="检验内容" align="center"></el-table-column>
          <el-table-column prop="inspectResult" label="判定结果" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult"  >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      oqcState: '',
      infoData: {
        soNo: '',
        cpoNo: '',
        inspectDate: this.$dayjs().format('YYYY-MM-DD'),
        inspector: '',
        inspectionShift: '',
        customerCode: '',
        remark: ''
      },
      isReportRequired: '',
      rules: {
        soNo: [{ required: true, message: '请输入销货单号' }],
        mComMaterialId: [{ required: true, message: '请选择料号' }],
        customerCode: [{ required: true, message: '请选择客户代码' }],
        qty: [{ required: true, message: '请输入数量' }],
        inspectDate: [{ required: true, message: '请选择检验日期' }]
      },
      resultArray: ['OK', 'NG', '空白'],
      checkData: [],
      defaultArray: [],
      liveState: false,
      isNumber: true,
      shiftList: [],
      materialTable: []
    }
  },
  methods: {
    ...mapActions(['changeQmsStatus', 'closeCurrentPage']),
    setStatus () {
      this.oqcState = this.$route.query.status === 'DRAFT' ? '未提交' : '已提交'
    },
    async getPartInfo () {
      let deliveryId = this.infoData.sono
      let res = await this.$api.findPartInfo({ deliveryId })
      if (res.code === '200') {
        this.materialTable = res.data
      } else {
        this.materialTable = []
      }
    },
    async saveData (status) {
      this.$refs.infoData.validate(async valid => {
        if (valid) {
          let { infoData, isReportRequired, checkData, isNumber, materialTable } = this
          if (isNumber) {
            const items = checkData
            const parts = materialTable
            let data = Object.assign({ isReportRequired, items, parts }, infoData)
            data.docStatus = status
            let res = await this.$api.saveOqc(data)
            this.$myPrompt.handleMsg(res, () => {
              this.closePage()
            })
          } else {
            this.$message.warning('请检查输入毛重和净重是否正确')
          }
        }
      })
    },
    clearData () {
      // let { infoData } = this
      // let keys = Object.keys(infoData)
      // keys.forEach(key => {
      //   infoData[key] = ''
      // })
      this.$refs.infoData.resetFields()
      this.isReportRequired = ''
      this.checkData = []
      this.infoData.qtyUom = ''
      this.infoData.weightUom = ''
    },
    checkNumber (value) {
      if (value) {
        let r = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
        if (r.test(Number(value))) {
          this.isNumber = true
        } else {
          this.isNumber = false
          this.$message.warning('请重新输入非负数  且保留两位小数')
        }
      }
    },
    querySearchAsync (query, callback) {
      const parmas = {
        mWmsCustomerCode: query,
        pageIndex: 1,
        pageSize: 1000
      }
      this.$api.getCustomers(parmas).then(res => {
        callback(res.data.list)
      })
    },
    // 获取默认检验代码
    async getDefaultItem () {
      const data = {
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.findCheckitem(data)
      this.checkData = res.data.list
      this.defaultArray = res.data.list
    },
    async findCustomCheckitem () {
      let data = {
        customerCode: this.infoData.customerCode,
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.findCustomCheckitem(data)
      this.checkData = [...this.defaultArray, ...res.data.list]
    },
    // // 获取检规列表
    // async findOqc () {
    //   let res = await this.$api.findOqc()
    // },
    async getProductName () {
      let partId = this.infoData.mComMaterialId
      let res = await this.$api.getTypeAndNameByPartNo({ partId })
      if (res.code === '200') {
        this.infoData.productName = res.data.productName
      } else {
        this.infoData.productName = ''
      }
    },
    closePage () {
      this.liveState = true
      this.changeQmsStatus(true)
      let title = this.$route.meta.title
      let data = { title, url: '/BasicData/Quality/Oqc/add' }
      this.closeCurrentPage(data)
      this.$router.replace('/BasicData/Quality/Oqc')
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
    }
  },
  components: {
    materialSelect
  },
  created () {
    this.setStatus()
    this.getShiftList()
    this.getDefaultItem()
  }
  // beforeRouteEnter (to, from, next) {
  //   console.log(to.meta.keepAlive, 2)
  //   next()
  // },
  // beforeRouteLeave (to, from, next) {
  //   to.meta.keepAlive = false
  //   console.log(to.meta.keepAlive, 3)
  //   next()
  // }

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
