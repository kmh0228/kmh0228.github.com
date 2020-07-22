<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="100px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="产品系列" class="el-col el-col-11" size="mini">
      <!-- <mes-select  labelKey="mComMaterialfamilyCode" valueKey="mComMaterialfamilyId" method="getMachine"></mes-select> -->
      <el-input :disabled="true" v-model="model"></el-input>
    </el-form-item>
    <el-form-item label="生产单位"  class="el-col el-col-11 el-col-offset-1" size="mini">
       <!-- <mes-select v-model="productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select> -->
       <el-input :disabled="true" v-model="productionUnit"></el-input>
    </el-form-item>
    <el-form-item label="稽核内容" class="el-col el-col-23" size="mini">
      <el-input  type="textarea" :disabled="true"  :rows="2"  placeholder="请输入内容" v-model="inspectContent"></el-input>
    </el-form-item>
    <el-form-item label="不良类型" class="el-col el-col-11" size="mini">
      <el-input :disabled="true" v-model="failType"></el-input>
    </el-form-item>
    <el-form-item label="不良种类"  class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input :disabled="true" v-model="failCategory"></el-input>
    </el-form-item>
    <el-form-item label="产出原因" prop="generateReason" class="el-col el-col-11" size="mini">
      <el-input  type="textarea" :rows="3"  placeholder="请输入内容" v-model="dialogForm.generateReason"></el-input>
    </el-form-item>
    <el-form-item label="流出原因" prop="flowoutReason" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input  type="textarea"  :rows="3"  placeholder="请输入内容" v-model="dialogForm.flowoutReason"></el-input>
    </el-form-item>
    <el-form-item label="短期政策" prop="tempWay" class="el-col el-col-11" size="mini">
      <el-input  type="textarea"  :rows="3"  placeholder="请输入内容" v-model="dialogForm.tempWay"></el-input>
    </el-form-item>
    <el-form-item label="长期政策" prop="solutionWay" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input  type="textarea"  :rows="3"  placeholder="请输入内容" v-model="dialogForm.solutionWay"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDataList('DRAFT')">保存</el-button>
      <el-button type="primary" size="mini" @click="saveDataList('SUBMITTED')">提交</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      model: '',
      productionUnit: '',
      inspectContent: '',
      failType: '',
      failCategory: '',
      dialogForm: {
        generateReason: '',
        flowoutReason: '',
        tempWay: '',
        solutionWay: ''
      },
      rules: {

      }
    }
  },
  props: {
    cannel: Function,
    findExceptList: Function,
    id: {
      type: String,
      default: ''
    }
  },
  methods: {
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
          this.$message.warning('该部门下的生产系列没有稽核内容！！')
        }
      }
    },
    saveDataList (docStatus) {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, id } = this
          const data = Object.assign(dialogForm, { id, docStatus })
          let res = await this.$api.handleExcep(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('findMainBillPage')
          })
        }
      })
    },
    async  setDefaultData () {
      let { id } = this
      let res = await this.$api.getExcepDetail({ id })
      if (res.code === '200') {
        for (let i in this.dialogForm) {
          this.dialogForm[i] = res.data[i] || ''
        }
      }
    }
  },
  created () {
    this.setDefaultData()
  }
}

</script>
