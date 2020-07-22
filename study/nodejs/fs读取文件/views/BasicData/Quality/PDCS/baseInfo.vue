<template>
  <div>
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <!-- <el-form-item label="生产单位" prop="productUnit" class="el-col el-col-7">
        <mes-select v-model="infoData.productUnit" method="getProductionUnit" labelKey="companyCode" valueKey="officeCode" v-if="isEdit"></mes-select>
        <span v-else>22222</span>
      </el-form-item> -->
      <el-form-item label="部门" prop="department" class="el-col el-col-11 col-department">
        <el-cascader
          v-model="infoData.department"
          :options="options"
          :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
          clearable
          v-if="isEdit"
          @change="handleChange"></el-cascader>
        <span v-else>{{infoData.departmentVn && infoData.departmentVn.replace(/,/g,'/')}}</span>
      </el-form-item>
      <el-form-item label="线别" prop="line" class="el-col el-col-11 el-col-offset-1">
        <mes-select v-model="infoData.line" method="getLineList" labelKey="lineName" valueKey="mPomLineId" v-if="isEdit"></mes-select>
        <span v-else>{{infoData.lineVn}}</span>
      </el-form-item>
      <el-form-item label="料号" prop="partNo" class="el-col el-col-11">
        <material-select  v-model="infoData.partNo" :materialNoVersion="infoData.pdcsNoRev ? `${infoData.partNoVn}:${infoData.pdcsNoRev}` : infoData.partNoVn"  style="width:100%" @change="getProductName" v-if="isEdit"></material-select>
        <span v-else>{{infoData.pdcsNoRev ? `${infoData.partNoVn}:${infoData.pdcsNoRev}` : infoData.partNoVn}}</span>
      </el-form-item>
      <el-form-item label="物品名称" prop="partName" class="el-col el-col-11  el-col-offset-1">
        <el-input  v-model="infoData.partName" v-if="isEdit"></el-input>
        <span v-else>{{infoData.partName}}</span>
      </el-form-item>
      <el-form-item label="检验单号" prop="inspectNo" class="el-col el-col-11">
        <el-input v-model="infoData.inspectNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.inspectNo}}</span>
      </el-form-item>
      <el-form-item label="工单" prop="workOrder" class="el-col el-col-11 el-col-offset-1">
        <mes-select v-model="infoData.workOrder" method="getJobOrdersByArg" labelKey="DOC_NO" valueKey="T_POM_JOB_ORDER_ID" @optionClick="orderChange" v-if="isEdit"></mes-select>
        <span v-else>{{infoData.workOrderVn}}</span>
      </el-form-item>
      <el-form-item label="生产数量:" prop="qty" class="el-col el-col-11 ">
      <el-input  v-model.number="infoData.qty" v-if="isEdit"></el-input>
      <span v-else>{{infoData.qty}}</span>
      </el-form-item>
      <el-form-item label="不良类型" prop="failType" class="el-col el-col-11 el-col-offset-1">
        <dict-select v-model="infoData.failType" dictType="DEFECT_CODE_TYPE"  selectKey="dictCode" v-if="isEdit"></dict-select>
        <span v-else>{{infoData.failType}}</span>
      </el-form-item>
      <el-form-item label="制造时间" prop="manufactueDate" class="el-col el-col-11">
        <el-date-picker  v-model="infoData.manufactueDate" type="date"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.manufactueDate}}</span>
      </el-form-item>
      <el-form-item label="不良数:" prop="failQty" class="el-col el-col-11  el-col-offset-1">
        <el-input  v-model.number="infoData.failQty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failQty}}</span>
      </el-form-item>
      <el-form-item label="疑虑批号" prop="lotNo" class="el-col el-col-11">
        <el-input  v-model="infoData.lotNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.lotNo}}</span>
      </el-form-item>
      <el-form-item label="特采单号" prop="waiveNo" class="el-col el-col-11  el-col-offset-1">
        <el-input  v-model="infoData.waiveNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.waiveNo}}</span>
      </el-form-item>
      <el-form-item label="问题描述" prop="failDesc" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.failDesc" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failDesc}}</span>
      </el-form-item>
      <el-form-item label="经办" prop="operator" class="el-col el-col-11">
        <el-select  v-model="infoData.operator" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
         <!-- <mes-select v-model="infoData.operator" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <span v-else>{{infoData.operatorVn}}</span>
      </el-form-item>
      <el-form-item label="申请日期" prop="applyDate" class="el-col el-col-11 el-col-offset-1">
        <el-date-picker  v-model="infoData.applyDate" type="date" :editable="false" placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
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
        department: [{ required: true, message: '请选择部门' }],
        line: [{ required: true, message: '请选择线别' }],
        partNo: [{ required: true, message: '请选择料号' }],
        partName: [{ required: true, message: '物品名称不能为空' }],
        inspectNo: [{ required: true, message: '请输入检验单号' }],
        workOrder: [{ required: true, message: '请选择工单' }],
        qty: [{ required: true, message: '生产数量不能为空' }],
        failType: [{ required: true, message: '请选择不良类型' }],
        manufactueDate: [{ required: true, message: '制造时间不能为空' }],
        failQty: [{ pattern: /^\d+$/, required: true, message: '请输入非负整数' }],
        lotNo: [{ required: true, message: '请输入疑虑批号' }],
        waiveNo: [{ required: true, message: '请输入特采单号' }],
        failDesc: [{ required: true, message: '请输入问题描述' }],
        operator: [{ required: true, message: '请选择经办' }],
        applyDate: [{ required: true, message: '请选择申请时间' }]
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
