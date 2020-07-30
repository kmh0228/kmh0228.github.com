<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary" plain size="mini" @click="insertMainAndDetail('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini" @click="insertMainAndDetail('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
      <span class="span_class">{{$t('ipqcAudit_Statu')}}{{ ipqcState }}</span>
    </div>
    <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm"  label-width="150px" label-position="left"  class="el-row mes-form-rule" size="mini">
        <el-form-item :label="$t('common_ProduSeries')" prop="model" class="el-col el-col-7">
          <el-select v-model="dialogForm.model" clearable :placeholder="$t('common_PleasSeleProdSe')" style="width:100%" @change="getItemAndContent">
            <el-option v-for="(option,i) in machineList" :key="i" :label="option.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_ProduUnit')"  prop="productionUnit" class="el-col el-col-7 el-col-offset-1">
          <el-select v-model="dialogForm.productionUnit" clearable :placeholder="$t('ipqcAudit_selecProdUnit')" style="width:100%"  @change="getItemAndContent">
            <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_posit')" class="el-col el-col-7 el-col-offset-1">
          <el-input v-model="dialogForm.location"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Line')" class="el-col el-col-7">
           <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="dialogForm.mPomLineId">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_Shift')" class="el-col el-col-7 el-col-offset-1">
           <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleClas')"  v-model="dialogForm.mPomShiftId">
            <el-option v-for="(option,i) in shiftList" :key="i" :label="option.shiftName" :value="option.mPomShiftId"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label="$t('common_AuditDate')" class="el-col el-col-7 el-col-offset-1">
           <el-date-picker  v-model="dialogForm.inspectDate"  type="date"  :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('ipqcAudit_Audit')" class="el-col el-col-7">
           <!-- <el-select  v-model="dialogForm.inspector" style="width:100%">
            <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.mComEmployeeId"></el-option>
          </el-select> -->
          <mes-select v-model="dialogForm.inspector" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
        <el-form-item :label="$t('common_AbnorNotiPers')" class="el-col el-col-7 el-col-offset-1">
          <mes-select v-model="dialogForm.excepNotice" labelKey="userName" valueKey="userCode" method="getPersonList"></mes-select>
        </el-form-item>
      </el-form>
    </el-card>

     <el-card class="box-card"  shadow="never"  style="margin-top:1.5vh">
      <div slot="header" class="clearfix">
        <span>{{$t('common_InspeRecord')}}</span>
      </div>
      <!-- <el-row class="mes-table-handle">
        <el-col :span="12">
          <div  v-if="editDetail" >
            <el-button @click="addCheckRow">{{$t('common_add')}}</el-button>
            <span class="split-line">|</span>
          </div>
            <el-button  v-else type="primary" plain size="mini" @click="editDetail = true">{{$t('common_Edit')}}</el-button>
        </el-col>
      </el-row> -->
      <el-table :data="checkData" border>
        <el-table-column type="index" :label="$t('common_item')" align="center"></el-table-column>
        <el-table-column  :label="$t('common_AuditItem')" align="center" sortable prop="inspectItem">
          <!-- <template slot-scope="scope">
            <el-input  v-if="editDetail" size="mini" v-model="scope.row.inspectItem" ></el-input>
            <p v-else>{{ scope.row.inspectItem }}</p>
          </template> -->
        </el-table-column>
         <el-table-column  :label="$t('common_AuditCont')" align="center" sortable prop="inspectContent">
          <!-- <template slot-scope="scope">
            <el-input  v-if="editDetail" size="mini" v-model="scope.row.inspectContent" ></el-input>
            <p v-else>{{ scope.row.inspectContent }}</p>
          </template> -->
        </el-table-column>
         <el-table-column  :label="$t('common_JudgmResu')" align="center" sortable>
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.inspectResult" style="width:100%" @change="inspectChange(scope.row.inspectResult)">
              <el-option v-for="(option,i) in resultList" :key="i" :label="option" :value="option"></el-option>
            </el-select>
            <!-- <p v-else>{{ scope.row.inspectResult }}</p> -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('ipqcAudit_pictu')" align="center"></el-table-column>
        <!-- <el-table-column :label="$t('common_Operate')" align="center" v-if="editDetail" >
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCheckData(scope.$index)"></el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="'ng'+$t('common_page')"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog" :mQomSipItemId="mQomSipItemId" @cannel="cannel"></ng-dialog>
    </el-dialog>
 </div>
</template>

<script>
import ngDialog from '../Components/ngDialog'

export default {
  data () {
    return {
      ipqcState: '',
      checkData: [],
      productionUnitList: [],
      machineList: [],
      lineList: [],
      shiftList: [],
      dialogForm: {
        model: '',
        productionUnit: '',
        mPomLineId: '',
        mPomShiftId: '',
        location: '',
        inspector: '',
        inspectDate: new Date(),
        excepNotice: ''
      },
      resultList: ['OK', 'NG', this.$t('common_blank')],
      userList: [],
      dialogVisible: false,
      mQomSipItemId: ''
    }
  },
  computed: {
    rules () {
      return {
        model: [{ required: true, message: this.$t('common_PleasSeleProdSe') }],
        productionUnit: [{ required: true, message: this.$t('ipqcAudit_selecProdDepa') }]
      }
    }
  },
  methods: {
    // dispatchNg (row) {
    //   if (row.inspectResult === 'NG') {
    //     this.dialogVisible = true
    //     this.mQomSipItemId = row.mQomSipItemId
    //   }
    // },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.ipqcState = this.$route.query.status === 'DRAFT' ? this.$t('common_NotSubm') : this.$t('common_Submitted')
    },
    closeCurrentPage () {
      this.$router.replace('/BasicData/Quality/IpqcAudit')
    },
    inspectChange (option) {
      if (option === 'NG') {
        this.$message.warning(this.$t('ipqcAudit_saveBefoEnteNg'))
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
    // 获取线别列表
    async getLineList () {
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
    // 查询人员信息
    async  findUserList () {
      let data = {
        keyWords: '',
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.userList = res.data.list
      } else {
        this.userList = []
      }
    },
    // 根据产品系列和生产部门查询稽核项目和稽核内容
    async  getItemAndContent () {
      let { model, productionUnit } = this.dialogForm
      if (model && productionUnit) {
        let data = Object.assign({ model }, { productionUnit })
        let res = await this.$api.getItemAndContent(data)
        this.checkData = res.data
        if (this.checkData.length !== 0) {
          this.editDetail = false
        } else {
          this.editDetail = true
          this.$message.warning(this.$t('ipqcAudit_produSeriUndeAudiCont'))
        }
      }
    },
    // 新增稽核列表
    insertMainAndDetail (docStatus) {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { checkData, dialogForm } = this
          let detailVmList = checkData
          let data = Object.assign({ detailVmList }, dialogForm)
          data.docStatus = docStatus
          data.inspectDate = this.$dayjs(data.inspectDate).format('YYYY-MM-DD')
          let res = await this.$api.insertMainAndDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
    }
    // 增加检验记录
    // addCheckRow () {
    //   this.checkData.push({
    //     inspectContent: '',
    //     inspectItem: '',
    //     inspectResult: ''
    //   })
    // },
    // 删除检验记录
    // deleteCheckData (index) {
    //   this.checkData.splice(index, 1)
    // }
  },
  created () {
    this.setStatus()
    this.getLineList()
    this.getModelList()
    this.getProductionUnit()
    this.getShiftList()
    this.findUserList()
  },
  components: {
    ngDialog
  }
}
</script>

<style lang="scss">
.span_class {
  font-size: 20px;
  margin-left: 30vw;
  color: #3b6f9a;
}
</style>
