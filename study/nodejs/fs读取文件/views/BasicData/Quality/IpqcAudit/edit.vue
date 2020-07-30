<template>
 <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="updateMainAndDetail('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button :disabled="buttonDisabled" type="primary" plain size="mini" @click="updateMainAndDetail('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{$t('ipqcAudit_OddNumb')}}{{unitNumber}}</span>
      <span class="status_class" style="margin-left:3vw">{{$t('ipqcAudit_Statu')}}{{ ipqcState }}</span>
    </div>
    <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <el-form :model="infoData" :rules="rules" ref="dialogForm"  label-width="120px" label-position="left" class="el-row mes-form-rule" size="mini">
        <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-7">
          <el-input :disabled="true" v-model="dialogForm.modelCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_ProduUnit')" class="el-col el-col-7 el-col-offset-1">
          <el-input :disabled="true" v-model="dialogForm.productionUnitCode"></el-input>
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
      <el-table :data="checkData" border>
        <el-table-column type="index" :label="$t('common_item')" align="center"></el-table-column>
        <el-table-column  :label="$t('common_AuditItem')" align="center" sortable prop="inspectItem"></el-table-column>
         <el-table-column  :label="$t('common_AuditCont')" align="center" sortable prop="inspectContent"> </el-table-column>
         <el-table-column  :label="$t('common_JudgmResu')" align="center" sortable>
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.inspectResult" style="width:100%">
              <el-option v-for="(option,i) in resultList" :key="i" :label="option" :value="option" @click.native="dispatchNg(scope.row)"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ipqcAudit_pictu')" align="center"></el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="'ng' + $t('common_page')"  width="800px" class="handle-dialog">
      <ng-dialog v-if="dialogVisible" ref="dialog" :detailId="detailId" @cannel="cannel"></ng-dialog>
    </el-dialog>
 </div>
</template>

<script>
import ngDialog from '../Components/ngDialog'

export default {
  data () {
    return {
      ipqcState: '',
      unitNumber: '',
      infoData: {},
      checkData: [],
      lineList: [],
      shiftList: [],
      dialogForm: {
        model: '',
        productionUnit: '',
        mPomLineId: '',
        mPomShiftId: '',
        location: '',
        modelCode: '',
        productionUnitCode: '',
        inspectDate: '',
        inspector: '',
        excepNotice: ''
      },
      resultList: ['OK', 'NG', this.$t('common_blank')],
      rules: {

      },
      productionUnitList: [],
      machineList: [],
      userList: [],
      dialogVisible: false,
      detailId: ''
    }
  },
  computed: {
    buttonDisabled () {
      return this.ipqcState === this.$t('common_Submitted')
    }
  },
  methods: {
    dispatchNg (row) {
      if (row.inspectResult === 'NG') {
        this.dialogVisible = true
        this.detailId = row.tqomIpqcauditDetailId
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    setStatus () {
      this.ipqcState = this.$route.query.status === 'DRAFT' ? this.$t('common_NotSubm') : this.$t('common_Submitted')
      this.unitNumber = this.$route.query.unitNumber
    },
    closeCurrentPage () {
      this.$router.replace('/BasicData/Quality/IpqcAudit')
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
    // 获取所有信息
    async  getInfoAndDetail () {
      let tqomIpqcauditMainId = this.$route.query.id
      let res = await this.$api.getInfoAndDetail({ tqomIpqcauditMainId })
      let { dialogForm } = this
      let arr = []
      for (let i in dialogForm) {
        arr.push(i)
      }
      arr.forEach(item => {
        dialogForm[item] = res.data[item]
      })
      this.checkData = res.data.detailList
    },
    // 新增稽核列表
    updateMainAndDetail (status) {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let tqomIpqcauditMainId = this.$route.query.id
          let { checkData, dialogForm } = this
          let detailVmList = checkData
          let data = Object.assign({ detailVmList }, dialogForm, { tqomIpqcauditMainId })
          data.status = status
          let res = await this.$api.updateMainAndDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.closeCurrentPage()
          })
        }
      })
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
    }
  },
  created () {
    this.setStatus()
    this.getInfoAndDetail()
    this.getLineList()
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
  margin: 0 40vw;
  color: #3b6f9a;
}
.status_class {
  font-size: 1vw;
  margin-left: 20vw;
  color: #3b6f9a;
}
</style>
