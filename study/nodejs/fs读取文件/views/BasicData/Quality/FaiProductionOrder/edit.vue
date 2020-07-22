<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary"  plain size="mini" @click="saveData('UN_REGISTER')" :disabled="buttonDisabled">保存</el-button>
      <el-button type="primary" plain size="mini" @click="saveData('REGISTERED')" :disabled="buttonDisabled">登记</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
      <span class="status_class">状态：{{ faiProductionOrderState }}</span>
    </div>
   <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh" size="mini">
        <el-form-item label="料号"  prop="mComMaterialId" class="el-col el-col-7">
          <el-input :disabled="true" v-model="infoData.materialNo"></el-input>
        </el-form-item>
        <el-form-item label="产品系列" class="el-col el-col-7 el-col-offset-1">
          <el-input  :disabled="true" v-model="infoData.modelCode" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="生产单位" prop="productionUnit" class="el-col el-col-7  el-col-offset-1">
          <mes-select v-model="infoData.productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select>
        </el-form-item>
        <el-form-item label="工单" prop="tPomJobOrderId" class="el-col el-col-7">
          <mes-select v-model="infoData.tPomJobOrderId" labelKey="DOC_NO" valueKey="T_POM_JOB_ORDER_ID" method="getJobOrdersByArg" ></mes-select>
        </el-form-item>
        <el-form-item label="工单数量" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.jobOrderQty"></el-input>
        </el-form-item>
        <el-form-item label="SN" class="el-col el-col-7 el-col-offset-1">
          <el-input v-model="infoData.productSn" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="线别" prop="mPomLineId" class="el-col el-col-7">
          <mes-select v-model="infoData.mPomLineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
        </el-form-item>
        <el-form-item label="机台" prop="machineCode" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
        </el-form-item>
        <el-form-item label="位置" class="el-col el-col-7 el-col-offset-1">
          <el-input   v-model="infoData.location" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="班别" prop="mPomShiftId" class="el-col el-col-7">
          <mes-select v-model="infoData.mPomShiftId" labelKey="shiftName" valueKey="mPomShiftId" method="getShiftList"></mes-select>
        </el-form-item>
        <el-form-item label="送检时间" prop="sendTime" class="el-col el-col-7 el-col-offset-1">
          <el-date-picker  v-model="infoData.sendTime"  type="datetime" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="送测人员" prop="sendBy" class="el-col el-col-7  el-col-offset-1">
        <mes-select v-model="infoData.sendBy" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item label="检验类别" prop="inspectCategory" class="el-col el-col-7 ">
          <dict-select v-model="infoData.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
        </el-form-item>
      </el-form>
 </el-card>
  <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
    <div slot="header" class="clearfix">
    <span>检规记录</span>
    </div>
    <div class="mes-table" style="padding:20px">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <span style="margin-right:15px">检规编号</span>
          <el-input :disabled="true" v-model="sipNo" size="mini" style="width:40%"></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-right:15px">检规版次</span>
          <el-input :disabled="true" v-model="sipVer" size="mini" style="width:40%"></el-input>
          </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="checkData" border size="mini">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="inspectItem" label="稽核项目" align="center"></el-table-column>
          <el-table-column prop="inspectContent"  label="稽核内容" align="center"></el-table-column>
          <el-table-column prop="spec"  label="规格" align="center"></el-table-column>
          <!-- <el-table-column prop="defectImage"  label="图位" align="center">
            <template slot-scope="scope" >
              <el-input v-model="scope.row.defectImage"></el-input>
            </template>
          </el-table-column>
          <el-table-column  prop="inspectInfo" label="检测结果" align="center">
            <template slot-scope="scope" >
              <el-input v-model="scope.row.inspectInfo"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="inspectResult" label="判定结果" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult" >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option" @click.native="dispatchNg(scope.row)"></el-option>
                </el-select>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="ng页面"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog"  @cannel="cannel" :detailId="detailId"></ng-dialog>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import ngDialog from '../Components/ngDialog'
export default {
  data () {
    return {
      dialogVisible: false,
      faiProductionOrderState: '',
      checkData: [],
      infoData: {
        docStatus: '',
        mComMaterialId: '',
        materialNo: '',
        modelCode: '',
        model: '',
        productionUnit: '',
        tPomJobOrderId: '',
        jobOrderQty: '',
        productSn: '',
        mPomLineId: '',
        machineCode: '',
        location: '',
        mPomShiftId: '',
        sendTime: '',
        sendBy: '',
        inspectCategory: ''
      },
      modelList: [],
      machineList: [],
      rules: {
        mComMaterialId: [{ required: true, message: '请选择料号' }]
      },
      resultArray: ['OK', 'NG', '空白'],
      sipNo: '',
      sipVer: '',
      detailId: ''
    }
  },
  computed: {
    buttonDisabled () {
      return this.faiProductionOrderState === '已登记'
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
        this.detailId = row.tQomFaiDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.faiProductionOrderState = this.$route.query.status === 'UN_REGISTER' ? '未登记' : '已登记'
    },
    async  saveData (docStatus) {
      this.$refs.infoData.validate(async valid => {
        if (valid) {
          let data = this.infoData
          data.detailVmList = this.checkData
          data.sipNo = this.sipNo
          data.sipVer = this.sipVer
          data.docStatus = docStatus
          data.tQomFaiMainId = this.tQomFaiMainId
          let res = await this.$api.updateMainBill(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    },
    closeCurrentPage () {
      this.$router.replace('/Quality/FaiProductionOrder')
    },
    async  setDefaultData () {
      this.tQomFaiMainId = this.$route.query.id
      let { tQomFaiMainId } = this
      let res = await this.$api.getInfoAndDetailCheck({ tQomFaiMainId })
      let { infoData } = this
      let arr = []
      for (let i in infoData) {
        arr.push(i)
      }
      arr.forEach(item => {
        infoData[item] = res.data[item]
      })
      this.sipVer = res.data.sipVer
      this.sipNo = res.data.sipNo
      this.checkData = res.data.detailList
    },
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.machineList = res.data.list
    }
  },
  components: {
    materialSelect, ngDialog
  },
  created () {
    this.setStatus()
    this.getModelList()
    this.setDefaultData()
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
