<template>
   <el-tabs v-model="activeName" >
    <el-tab-pane  label="抽样设置" name="settings">
      <el-radio v-model="inspectCategory" label="inspection">全检</el-radio>
      <el-radio v-model="inspectCategory" label="noInspection">抽样</el-radio>
      <el-radio v-model="inspectCategory" label="sample">免检</el-radio>
      <div v-if="showRadio" style="margin-top:1.5vh">
        <mes-select v-model="aqlStandard" labelKey="levelName" valueKey="mQomInspectionLevelId" method="getInspectLevels" style="margin-right:1vw;width:15%" @change="goSimpleSize(aqlStandard)"></mes-select>
        <el-radio v-if="isStatusType" v-model="inspectionLevel" label="N-1">减量</el-radio>
        <el-radio v-if="isStatusType" v-model="inspectionLevel" label="N-2">一般</el-radio>
        <el-radio v-if="isStatusType" v-model="inspectionLevel" label="N-3">加严</el-radio>
      </div>
      <div  v-if="samplingType" >
      <el-form :model="samplingForm"  label-width="90px" label-position="left" class="el-row mes-form-rule" style="margin-top:1.5vh">
        <el-form-item label="AQL" class="el-col el-col-5">
          <el-select v-model="aql" size="mini" @change="getSimpleSize">
            <el-option v-for="(option,i) in aqlList" :key="i" :label="option.aqlLevelCode" :value="option.mQomAqlLevelMainId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抽样数" class="el-col el-col-5 el-col-offset-1">
          <el-input size="mini" :disabled="sampleQtyDisabled" v-model.trim="samplingForm.sampleQty" ></el-input>
        </el-form-item>
          <el-form-item label="不良数" class="el-col el-col-5 el-col-offset-1">
          <el-input size="mini" v-model.number="samplingForm.defectQty"> </el-input>
        </el-form-item>
          <el-form-item label="不良率" class="el-col el-col-5 el-col-offset-1">
          <el-input size="mini" v-model.trim="defectRate" disabled></el-input>
        </el-form-item>
      </el-form>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'settings',
      aql: '',
      samplingForm: {
        sampleQty: '',
        defectQty: ''
      },
      inspectCategory: 'sample',
      samplingType: false,
      showRadio: false,
      aqlList: [],
      aqlStandard: '',
      inspectionLevel: '',
      isStatusType: false,
      sampleQtyDisabled: true
    }
  },
  props: {
    stockInQty: String
  },
  computed: {
    defectRate () {
      const { sampleQty, defectQty } = this.samplingForm
      const rate = sampleQty && defectQty ? parseFloat(defectQty / sampleQty).toFixed(2) : ''
      return rate
    }
  },
  watch: {
    inspectCategory (val, oldVal) {
      // this.aql = ''
      if (val === 'noInspection') {
        if (this.stockInQty) {
          this.showRadio = true
        } else {
          this.$message.warning('请先填写入库数量')
          this.inspectCategory = oldVal
        }
      } else {
        this.showRadio = false
        this.samplingType = false
        this.isStatusType = false
      }
    },
    inspectionLevel (val) {
      if (val) {
        this.getSimpleSize()
      }
    },
    aqlStandard (val) {
      if (val) {
        if (val === 'stomize') {
          this.samplingType = true
          this.isStatusType = false
          this.sampleQtyDisabled = false
        } else {
          this.sampleQtyDisabled = true
          this.samplingType = true
          if (val !== 'c=0') {
            this.isStatusType = true
          } else {
            this.isStatusType = false
          }
        }
      }
    }
  },
  methods: {
    async getAqlList (mQomInspectionLevelId) {
      const params = {
        aqlLevelCode: '',
        pageIndex: 1,
        pageSize: 100,
        mQomInspectionLevelId: mQomInspectionLevelId
      }
      const res = await this.$api.getAqlLevels(params)
      if (res.code === '200') {
        this.aqlList = res.data.list
      } else {
        this.aqlList = []
      }
    },
    goSimpleSize (mQomInspectionLevelId) {
      this.getAqlList(mQomInspectionLevelId)
      if (this.aql) {
        this.getSimpleSize()
      }
    },
    async getSimpleSize () {
      let { aqlStandard, inspectionLevel, aql, stockInQty } = this
      let levelCode = inspectionLevel
      let mQomAqlLevelMainId = aql
      let standard = aqlStandard
      if (standard === 'c=0') {
        levelCode = 'c=0'
      }
      let data = Object.assign({ levelCode, mQomAqlLevelMainId, standard, stockInQty })
      let res = await this.$api.getSimpleSize(data)
      if (res.code === '200') {
        this.samplingForm.sampleQty = res.data
      } else {
        this.samplingForm.sampleQty = ''
        this.$message.warning(res.msg)
      }
    }
  }
}
</script>
