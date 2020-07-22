<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary" plain size="mini" @click="saveData('DRAFT')">保存</el-button>
      <el-button type="primary" plain size="mini" @click="saveData('SUBMITTED')">提交</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
      <span class="status_class">状态：{{ firstCheckState }}</span>
    </div>
   <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh" size="mini">
        <el-form-item label="料号" prop="mComMaterialId" class="el-col el-col-7">
          <material-select v-model="infoData.mComMaterialId" @change="handleData" style="width:100%"></material-select>
        </el-form-item>
        <el-form-item label="产品系列" class="el-col el-col-7 el-col-offset-1">
          <el-select  v-model="infoData.model" style="width:100%" >
            <el-option v-for="(option,i) in modelList" :key="i" :label="optiossafsan.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产单位" class="el-col el-col-7 el-col-offset-1">
          <el-select v-model="infoData.productionUnit" style="width:100%" >
            <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单" class="el-col el-col-7">
          <el-select v-model="infoData.tPomJobOrderId" style="width:100%" >
            <el-option v-for="(option,i) in jobOrderList" :key="i" :label="option.DOC_NO" :value="option.T_POM_JOB_ORDER_ID" @click.native="changeOrderData(option.REQUEST_QTY)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单数量" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.jobOrderQty"></el-input>
        </el-form-item>
        <el-form-item label="SN" class="el-col el-col-7 el-col-offset-1">
          <el-input v-model="infoData.productSn" style="width:100%" placeholder="请输入SN号"></el-input>
        </el-form-item>
        <el-form-item label="线别" prop="mPomLineId" class="el-col el-col-7">
           <el-select style="width:100%" size="mini" clearable placeholder="请选择线别"  v-model="infoData.mPomLineId">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机台" class="el-col el-col-7 el-col-offset-1">
          <!-- <el-select v-model="infoData.machineCode" style="width:100%">
            <el-option v-for="(option,i) in eqpList" :key="i" :label="option.machineCode" :value="option.eqpId"></el-option>
          </el-select> -->
          <mes-select v-model="infoData.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
        </el-form-item>
        <el-form-item label="位置" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.location" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="班别"  prop="mPomShiftId" class="el-col el-col-7">
          <el-select style="width:100%" size="mini" clearable placeholder="请选择班别"  v-model="infoData.mPomShiftId">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验员"  prop="inspector" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item label="检验类别" prop="inspectCategory" class="el-col el-col-7 el-col-offset-1">
          <dict-select v-model="infoData.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
        </el-form-item>
        <el-form-item label="检验日期" class="el-col el-col-7">
           <el-date-picker  v-model="infoData.inspectDate"  type="date" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="异常通知人员" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.excepNotice" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
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
          <el-table-column prop="defectImage"  label="图位" align="center">
            <!-- <template slot-scope="scope" >
              <el-input v-model="scope.row.defectImage"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column  prop="inspectInfo" label="检测结果" align="center">
            <template slot-scope="scope" >
              <el-input v-model="scope.row.inspectInfo"></el-input>
                <!-- <span class="span_class" :contenteditable="true" @blur="spanChange($event,scope.$index)">{{scope.row.inspectInfo}}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="inspectResult" label="判定结果" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult" >
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option" @click.native="dispatchNg(scope.row,scope.$index)"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="ng页面"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog" :id="id" @cannel="cannel"></ng-dialog>
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
      firstCheckState: '',
      checkData: [],
      infoData: {
        docStatus: '',
        mComMaterialId: '',
        model: '',
        productionUnit: '',
        tPomJobOrderId: '',
        jobOrderQty: '',
        productSn: '',
        mPomLineId: '',
        machineCode: '',
        location: '',
        mPomShiftId: '',
        inspectDate: new Date(),
        inspector: '',
        inspectCategory: '',
        excepNotice: ''
      },
      modelList: [],
      machineList: [],
      productionUnitList: [],
      jobOrderList: [],
      lineList: [],
      shiftList: [],
      rules: {
        mComMaterialId: [{ required: true, message: '请选择料号' }],
        mPomLineId: [{ required: true, message: '请选择线别' }],
        mPomShiftId: [{ required: true, message: '请选择班别' }],
        inspector: [{ required: true, message: '请选择检验员' }]
        // inspectCategory: [{ required: true, message: '请选择检验类别' }]
      },
      resultArray: ['OK', 'NG', '空白'],
      sipNo: '',
      sipVer: ''
    }
  },
  methods: {
    dispatchNg (row, index) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.firstCheckState = this.$route.query.status === 'DRAFT' ? '未提交' : '已提交'
    },
    async  saveData (docStatus) {
      this.$refs.infoData.validate(async valid => {
        if (valid) {
          let data = this.infoData
          data.detailVmList = this.checkData
          data.sipNo = this.sipNo
          data.sipVer = this.sipVer
          data.docStatus = docStatus
          let res = await this.$api.insertMainAndDetailCheck(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    },
    closeCurrentPage () {
      this.$router.replace('/BasicData/Quality/FirstCheck')
    },
    async handleData () {
      let materialId = this.infoData.mComMaterialId
      let checkRes = await this.$api.getDetailCheck({ materialId })
      let productRes = await this.$api.getModelCheck({ materialId })
      this.checkData = []
      this.sipNo = ''
      this.sipVer = ''
      if (checkRes.data) {
        this.sipNo = checkRes.data.sipNo
        this.sipVer = checkRes.data.sipVer
        if (checkRes.data.detailDtoList.length > 0) {
          this.checkData = checkRes.data.detailDtoList
        }
      }
      this.infoData.model = ''
      if (productRes.data !== null) {
        this.modelList = [productRes.data]
      } else {
        this.modelList = this.machineList
      }
    },
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.machineList = res.data.list
    },
    // 获取生产单位
    async getProductionUnit () {
      let res = await this.$api.getProductionUnit()
      this.productionUnitList = res.data
    },
    // 获取工单数据列表
    async getWorkOrderList () {
      let data = {
        orderStatus: '',
        keyWord: '',
        sortDes: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getJobOrdersByArg(data)
      this.jobOrderList = res.data.list
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
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
    // 获取所有机台
    // async getEqp () {
    //   let res = await this.$api.getEqp()
    //   this.eqpList = res.data
    // },
    changeOrderData (qty) {
      this.infoData.jobOrderQty = qty
    }
    // spanChange (e, index) {
    //   this.checkData[index].inspectInfo = e.target.innerHTML
    // }
  },
  components: {
    materialSelect, ngDialog
  },
  created () {
    this.setStatus()
    this.getModelList()
    this.getProductionUnit()
    this.getWorkOrderList()
    this.getLineData()
    this.getShiftList()
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
