<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary" plain size="mini"  @click="saveData('DRAFT')">保存</el-button>
      <el-button type="primary" plain size="mini" @click="saveData('SUBMITTED')">提交</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
      <span class="status_class">状态：{{ checkState }}</span>
    </div>
   <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <el-form :model="infoData" :rules="rules" ref="infoForm"   label-width="120px" label-position="left"  class="el-row mes-form-rule"  style="margin-top:1vh" size="mini">
        <el-form-item label="料号" prop="mComMaterialId" class="el-col el-col-7">
          <material-select v-model="infoData.mComMaterialId" @change="handleData" style="width:100%"></material-select>
        </el-form-item>
        <el-form-item label="产品系列" class="el-col el-col-7 el-col-offset-1">
          <el-select v-model="infoData.model" filterable style="width:100%" >
            <el-option v-for="(option,i) in modelList" :key="i" :label="option.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产单位" class="el-col el-col-7 el-col-offset-1">
          <el-select v-model="infoData.productionUnit" filterable style="width:100%">
            <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SN"  class="el-col el-col-7">
          <el-input v-model="infoData.productSn" style="width:100%" placeholder="请输入SN号"></el-input>
        </el-form-item>
        <el-form-item label="工单" class="el-col el-col-7 el-col-offset-1">
          <el-select v-model="infoData.tPomJobOrderId" filterable style="width:100%">
            <el-option v-for="(option,i) in jobOrderList" :key="i" :label="option.DOC_NO" :value="option.T_POM_JOB_ORDER_ID" @click.native="changeOrderData(option.REQUEST_QTY)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单数量" class="el-col el-col-7 el-col-offset-1">
          <el-input  v-model="infoData.jobOrderQty"></el-input>
        </el-form-item>
        <el-form-item label="线别" prop="mPomLineId" class="el-col el-col-7">
          <el-select style="width:100%" size="mini" filterable clearable placeholder="请选择线别"  v-model="infoData.mPomLineId">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机台" class="el-col el-col-7 el-col-offset-1">
          <!-- <el-select v-model="infoData.machineCode" filterable style="width:100%">
            <el-option v-for="(option,i) in eqpList" :key="i" :label="option.machineCode" :value="option.eqpId"></el-option>
          </el-select> -->
          <mes-select v-model="infoData.machineCode" labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
        </el-form-item>
        <el-form-item label="位置" class="el-col el-col-7 el-col-offset-1">
          <el-input v-model="infoData.location" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="班别"  prop="mPomShiftId" class="el-col el-col-7">
          <el-select style="width:100%" size="mini" clearable placeholder="请选择班别"  v-model="infoData.mPomShiftId">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验员"  prop="inspector" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="infoData.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item label="检验日期" prop="inspectDate" class="el-col el-col-7 el-col-offset-1" >
          <el-date-picker  v-model="infoData.inspectDate"  type="date" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="检验类别" prop="inspectCategory" class="el-col el-col-7">
          <dict-select v-model="infoData.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
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
          <el-input :disabled="true" v-model="sipVer" style="width:40%"></el-input>
          </el-col>
      </el-row>
      <el-divider></el-divider>
      <div class="mes-table-content" v-for="(option,i) in tQomTourListVms" :key="i" style="margin-top:3vh">
        <div style="overflow:hidden;">
          <div class="table-header" style="float:left">
            <span> 巡检时间：</span>
            <el-time-select  placeholder="起始时间" v-model="option.timeFrom"  :picker-options="{start: setDefaultTime(i),  step: '00:30',  end: '24:00'}" size="mini"></el-time-select>
            <span>—</span>
            <el-time-select  placeholder="结束时间"  v-model="option.timeTo"  :picker-options="{start: setDefaultTime(i),  step: '00:30',  end: '24:00', minTime: option.timeFrom}" size="mini"></el-time-select>
          </div>
          <div class="table-header" style="float:right">
            <span style="padding-right:1vw">第 {{i+1}} 次巡检</span>
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deletetQomTourListVms(i)"></el-button>
          </div>
        </div>
        <el-table :data="option.tQomTourDetailList " border size="mini" style="margin-top:1.5vh">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="inspectItem" label="稽核项目" align="center"></el-table-column>
          <el-table-column prop="inspectContent" label="稽核内容" align="center"></el-table-column>
          <el-table-column prop="spec" label="规格" align="center">
            <!-- <template slot-scope="scope" >
              <el-input v-model="scope.row.spec"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="defectImage" label="图位" align="center">
            <!-- <template slot-scope="scope" >
              <el-input v-model="scope.row.defectImage"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="inspectInfo" label="检测结果" align="center">
            <template slot-scope="scope" >
                <!-- <span class="span_class" :contenteditable="true" @blur="spanChange(i,$event,scope.$index)">{{scope.row.inspectInfo}}</span> -->
                 <el-input v-model="scope.row.inspectInfo" ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="inspectResult" label="判定结果" align="center">
             <template slot-scope="scope">
                <el-select style="width:100%" size="mini" v-model="scope.row.inspectResult"  @change="inspectChange(scope.row.inspectResult)">
                  <el-option v-for="(option,i) in resultArray" :key="i" :label="option" :value="option"></el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button style="margin-top:1.5vh" @click="addtQomTourListVms">添加</el-button>
    </div>
  </el-card>
</div>

</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
export default {
  data () {
    return {
      checkState: '',
      checkData: {
        id: '1'
      },
      infoData: {
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
        inspector: '',
        inspectCategory: '',
        inspectDate: this.$dayjs().format('YYYY-MM-DD'),
        excepNotice: ''
      },
      tQomTourListVms: [
        {
          timeFrom: '',
          timeTo: '',
          timeSeq: '',
          tQomTourDetailList: [{}]
        }
      ],
      modelList: [],
      machineList: [],
      productionUnitList: [],
      jobOrderList: [],
      lineList: [],
      shiftList: [],
      value1: '',
      sipNo: '',
      sipVer: '',
      resultArray: ['OK', 'NG', '空白'],
      rules: {
        mComMaterialId: [{ required: true, message: '请选择料号' }],
        mPomLineId: [{ required: true, message: '请选择料号' }],
        mPomShiftId: [{ required: true, message: '请选择线别' }],
        inspector: [{ required: true, message: '请选择检验员' }],
        inspectCategory: [{ required: true, message: '请选择检验类别' }],
        inspectDate: [{ required: true, message: '请选择检验日期' }]
      },
      defaultTime: true,
      otherData: []
    }
  },
  computed: {

  },
  methods: {
    setStatus () {
      this.checkState = this.$route.query.status === 'DRAFT' ? '未提交' : '已提交'
    },
    setDefaultTime (i) {
      return i === 0 ? '00:00' : this.tQomTourListVms[i - 1].timeTo
    },
    inspectChange (option) {
      if (option === 'NG') {
        this.$message.warning('请先进行保存，再录入NG详情！')
      }
    },
    // 保存信息
    saveData (docStatus) {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          let { tQomTourListVms, sipNo, sipVer } = this
          let status
          tQomTourListVms.forEach(item => {
            if (item.timeTo && item.timeFrom) {
              status = 'ok'
            } else {
              status = 'fail'
            }
          })
          if (status === 'ok') {
            tQomTourListVms.forEach((item, $index) => {
              item.timeSeq = $index + 1
            })
            let data = Object.assign(this.infoData, { tQomTourListVms, docStatus, sipNo, sipVer })
            let res = await this.$api.insertSiteMainAndDetail(data)
            this.$myPrompt.handleMsg(res, () => {
              this.closeCurrentPage()
            })
          } else {
            this.$message.warning('请选择巡检时间')
          }
        }
      })
    },
    closeCurrentPage () {
      this.$router.replace('/BasicData/Quality/OnSiteCheck')
    },
    async addtQomTourListVms () {
      if (this.infoData.mComMaterialId) {
        let addListDetail = this.otherData
        let obj = {
          timeFrom: '',
          timeTo: '',
          timeSeq: '',
          tQomTourDetailList: addListDetail
        }
        this.tQomTourListVms.push(obj)
      } else {
        this.$message.warning('请先选择料号')
      }
    },
    async deletetQomTourListVms (index) {
      let confirm = await this.$myPrompt.confirm('确定删除当前巡检记录吗')
      if (confirm) {
        this.tQomTourListVms.splice(index, 1)
      }
    },
    // 设置初始数组
    async  setArray () {
      let mComMaterialId = this.infoData.mComMaterialId
      let checkRes = await this.$api.getSipByMaterial({ mComMaterialId })
      if (checkRes.code === '200') {
        this.otherData = checkRes.data.tourDetailDtoList
      } else {
        this.otherData = []
      }
    },
    // 根据料号获取信息
    async handleData () {
      let mComMaterialId = this.infoData.mComMaterialId
      let checkRes = await this.$api.getSipByMaterial({ mComMaterialId })
      let productRes = await this.$api.getModelByMaterialId({ mComMaterialId })
      if (productRes.data.length > 0) {
        this.modelList = productRes.data
      } else {
        this.modelList = this.machineList
      }
      this.sipNo = checkRes.data.sipNo
      this.sipVer = checkRes.data.sipVersion
      this.tQomTourListVms[0].tQomTourDetailList = checkRes.data.tourDetailDtoList
      this.setArray()
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
    changeOrderData (qty) {
      this.infoData.jobOrderQty = qty
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
    }
    // spanChange (i, e, index) {
    //   // console.log(i, index)
    //   // this.tQomTourListVms[i].tQomTourDetailList[index].inspectInfo = e.target.innerHTML
    //   this.tQomTourListVms[i].tQomTourDetailList[index].inspectInfo = e.target.textContent
    //   // this.$set(this.tourDetailDtoList[i].tQomTourDetailList[index], 'inspectInfo', e.target.innerHTML)
    // }
  },
  created () {
    this.setStatus()
    this.getWorkOrderList()
    this.getProductionUnit()
    this.getModelList()
    this.getLineData()
    this.getShiftList()
  },
  components: {
    materialSelect
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
.flex-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0;
  .el-form-item {
    width: 32%;
    margin-right: 1%;
  }
  .table-header {
    width: 50%;
  }
}
</style>
