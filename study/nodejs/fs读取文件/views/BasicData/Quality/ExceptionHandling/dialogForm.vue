<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="100px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11" size="mini">
      <!-- <mes-select  labelKey="mComMaterialfamilyCode" valueKey="mComMaterialfamilyId" method="getMachine"></mes-select> -->
      <el-input :disabled="true" v-model="model"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ProduUnit')"  class="el-col el-col-11 el-col-offset-1" size="mini">
       <!-- <mes-select v-model="productionUnit" labelKey="officeCode" valueKey="companyCode" method="getProductionUnit"></mes-select> -->
       <el-input :disabled="true" v-model="productionUnit"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_AuditCont')" class="el-col el-col-23" size="mini">
      <el-input  type="textarea" :disabled="true"  :rows="2"  :placeholder="$t('common_PleasEnteCont')" v-model="inspectContent"></el-input>
    </el-form-item>
    <el-form-item :label="$t('exceptionHan_TypesDefects')" class="el-col el-col-11" size="mini">
      <el-input :disabled="true" v-model="failType"></el-input>
    </el-form-item>
    <el-form-item :label="$t('exceptionHan_kindsDefects')"  class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input :disabled="true" v-model="failCategory"></el-input>
    </el-form-item>
    <el-form-item :label="$t('exceptionHan_ReasoForOutp')" prop="generateReason" class="el-col el-col-11" size="mini">
      <el-input  type="textarea" :rows="3"  :placeholder="$t('common_PleasEnteCont')" v-model="dialogForm.generateReason"></el-input>
    </el-form-item>
    <el-form-item :label="$t('exceptionHan_ReasoForOutf')" prop="flowoutReason" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input  type="textarea"  :rows="3"  :placeholder="$t('common_PleasEnteCont')" v-model="dialogForm.flowoutReason"></el-input>
    </el-form-item>
    <el-form-item :label="$t('exceptionHan_ShortTermPoli')" prop="tempWay" class="el-col el-col-11" size="mini">
      <el-input  type="textarea"  :rows="3"  :placeholder="$t('common_PleasEnteCont')" v-model="dialogForm.tempWay"></el-input>
    </el-form-item>
    <el-form-item :label="长期政策" prop="solutionWay" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input  type="textarea"  :rows="3"  :placeholder="$t('common_PleasEnteCont')" v-model="dialogForm.solutionWay"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDataList('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button type="primary" size="mini" @click="saveDataList('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
          this.$message.warning(this.$t('exceptionHan_TheProdSeriUnde'))
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
