<template>
  <div>
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <!-- <el-form-item :label="$t('common_ProduUnit')" prop="productUnit" class="el-col el-col-7">
        <mes-select v-model="infoData.productUnit" method="getProductionUnit" labelKey="companyCode" valueKey="officeCode" v-if="isEdit"></mes-select>
        <span v-else>22222</span>
      </el-form-item> -->
      <el-form-item :label="$t('common_Department')" prop="department" class="el-col el-col-11 col-department">
        <el-cascader
          v-model="infoData.department"
          :options="options"
          :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
          clearable
          v-if="isEdit"
          @change="handleChange"></el-cascader>
        <span v-else>{{infoData.departmentVn && infoData.departmentVn.replace(/,/g,'/')}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_Line')" prop="line" class="el-col el-col-11 el-col-offset-1">
        <mes-select v-model="infoData.line" method="getLineList" labelKey="lineName" valueKey="mPomLineId" v-if="isEdit"></mes-select>
        <span v-else>{{infoData.lineVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_PorN')" prop="partNo" class="el-col el-col-11">
        <material-select  v-model="infoData.partNo" :materialNoVersion="infoData.pdcsNoRev ? `${infoData.partNoVn}:${infoData.pdcsNoRev}` : infoData.partNoVn"  style="width:100%" @change="getProductName" v-if="isEdit"></material-select>
        <span v-else>{{infoData.pdcsNoRev ? `${infoData.partNoVn}:${infoData.pdcsNoRev}` : infoData.partNoVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_ItemName')" prop="partName" class="el-col el-col-11  el-col-offset-1">
        <el-input  v-model="infoData.partName" v-if="isEdit"></el-input>
        <span v-else>{{infoData.partName}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_InspeOrdeNo')" prop="inspectNo" class="el-col el-col-11">
        <el-input v-model="infoData.inspectNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.inspectNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_WorkOrde')" prop="workOrder" class="el-col el-col-11 el-col-offset-1">
        <mes-select v-model="infoData.workOrder" method="getJobOrdersByArg" labelKey="DOC_NO" valueKey="T_POM_JOB_ORDER_ID" @optionClick="orderChange" v-if="isEdit"></mes-select>
        <span v-else>{{infoData.workOrderVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_ProduQuan') + ':'" prop="qty" class="el-col el-col-11 ">
      <el-input  v-model.number="infoData.qty" v-if="isEdit"></el-input>
      <span v-else>{{infoData.qty}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_TypesDefe')" prop="failType" class="el-col el-col-11 el-col-offset-1">
        <dict-select v-model="infoData.failType" dictType="DEFECT_CODE_TYPE"  selectKey="dictCode" v-if="isEdit"></dict-select>
        <span v-else>{{infoData.failType}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_ManufTime')" prop="manufactueDate" class="el-col el-col-11">
        <el-date-picker  v-model="infoData.manufactueDate" type="date"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.manufactueDate}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_NumbeDefe') + ':'" prop="failQty" class="el-col el-col-11  el-col-offset-1">
        <el-input  v-model.number="infoData.failQty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failQty}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_BatchNumbInDoub')" prop="lotNo" class="el-col el-col-11">
        <el-input  v-model="infoData.lotNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.lotNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_SpeciPurcOrdeNo')" prop="waiveNo" class="el-col el-col-11  el-col-offset-1">
        <el-input  v-model="infoData.waiveNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.waiveNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_ProblDesc')" prop="failDesc" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.failDesc" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failDesc}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_Handl')" prop="operator" class="el-col el-col-11">
        <el-select  v-model="infoData.operator" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
         <!-- <mes-select v-model="infoData.operator" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <span v-else>{{infoData.operatorVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_AppliDate')" prop="applyDate" class="el-col el-col-11 el-col-offset-1">
        <el-date-picker  v-model="infoData.applyDate" type="date" :editable="false" :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.applyDate}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import mesSelect from '@/components/Module/Select/select'

export default {
  data () {
    return {
      value: [],
      options: [],
      infoData: {
        // productUnit: '',
        department: '',
        departmentVn: '',
        line: '',
        lineVn: '',
        partNo: '',
        partNoVn: '',
        pdcsNoRev: '',
        partName: '',
        inspectNo: '',
        workOrder: '',
        workOrderVn: '',
        qty: '',
        failType: '',
        manufactueDate: '',
        failQty: '',
        lotNo: '',
        waiveNo: '',
        failDesc: '',
        operator: '',
        operatorVn: '',
        applyDate: this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      },
      rules: {
        // productUnit: [{ required: true, message: '请选择生产单位' }],
        department: [{ required: true, message: this.$t('common_PleasSeleDepa') }],
        line: [{ required: true, message: this.$t('common_PleasSeleLineTy') }],
        partNo: [{ required: true, message: this.$t('common_PleaseSelectPN') }],
        partName: [{ required: true, message: this.$t('PDCS_ItemNameCannBeEmpt') }],
        inspectNo: [{ required: true, message: this.$t('PDCS_inputInspNumb') }],
        workOrder: [{ required: true, message: this.$t('PDCS_selecWorkOrde') }],
        qty: [{ required: true, message: this.$t('PDCS_ProduQuanCannBeEmpt') }],
        failType: [{ required: true, message: this.$t('PDCS_selecBadType') }],
        manufactueDate: [{ required: true, message: this.$t('PDCS_ManufTimeCannBeEmpt') }],
        failQty: [{ pattern: /^\d+$/, required: true, message: this.$t('PDCS_enterANonNegaInte') }],
        lotNo: [{ required: true, message: this.$t('PDCS_inputBatcNumbDoub') }],
        waiveNo: [{ required: true, message: this.$t('PDCS_inputSpecPurcOrdeNo') }],
        failDesc: [{ required: true, message: this.$t('PDCS_enterProbDesc') }],
        operator: [{ required: true, message: this.$t('PDCS_selecAgen') }],
        applyDate: [{ required: true, message: this.$t('PDCS_selecApplTime') }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object
    },
    userList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    formData (n, o) {
      this.setForm(n)
    }
  },
  methods: {
    handleChange (value) {
    },
    orderChange (option) {
      this.infoData.qty = option.REQUEST_QTY
      this.infoData.manufactueDate = this.$dayjs(option.SCH_START_DT).format('YYYY-MM-DD HH:mm:ss')
    },
    async getOfficeList () {
      const res = await this.$api.getOfficeList({ type: 2 })
      const { code, data } = res
      if (code === '200') {
        this.options = Array.isArray(data) ? data : []
      }
    },
    async getProductName () {
      let partId = this.infoData.partNo
      let res = await this.$api.getTypeAndNameByPartNo({ partId })
      if (res.code === '200') {
        this.infoData.partName = res.data.productName
      } else {
        this.infoData.partName = ''
      }
    },
    // 获取表单数据
    getData () {
      return JSON.parse(JSON.stringify(this.infoData))
    },
    // 数据验证
    checkData () {
      let flag = false
      this.$refs['infoData'].validate(valid => {
        if (valid) {
          flag = true
        }
      })
      return flag
    },
    // 重置表单
    resetFields () {
      this.$refs.infoData.resetFields()
    },
    // 设置表单数据
    setForm (data) {
      Object.keys(this.infoData).forEach(key => {
        this.infoData[key] = data[key] || data[key] === 0 ? data[key] : ''
      })
    }
  },
  components: {
    materialSelect,
    mesSelect
  },
  created () {
    this.getOfficeList()
    this.formData && this.setForm(this.formData)
  }

}
</script>

<style lang="scss">
.col-department .el-cascader {
  width: 100%;
}
</style>
