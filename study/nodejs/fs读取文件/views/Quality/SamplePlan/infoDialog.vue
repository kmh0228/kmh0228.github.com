<template>
  <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" label-position="left" class="mes-form-rule el-row">
    <el-form-item label="抽样计划" prop="mComProcessSegId" class="el-col el-col-24">
      <el-select v-model="infoForm.tQomInspectionPlanMainId" size="mini" style="width:100%;" disabled>
        <el-option v-for="(option,i) in planList" :key="i" :label="option.planName" :value="option.tQomInspectionPlanMainId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工站" prop="mComProcessSegId" class="el-col el-col-24">
      <el-select v-model="infoForm.mComProcessSegId" size="mini" style="width:100%;">
        <el-option v-for="(process,i) in processList" :key="i" :label="process.segName" :value="process.mComProcessSegId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="检查水平" prop="mQomInspectionLevelId" class="el-col el-col-24">
       <el-select v-model="infoForm.mQomInspectionLevelId" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in inspectionLevelList" :key="i" :label="option.levelCode" :value="option.mQomInspectionLevelId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="合格质量水平" prop="mQomAqlLevelMainId" class="el-col el-col-24">
      <el-select v-model="infoForm.mQomAqlLevelMainId" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in aqlList" :key="i" :label="option.aqlLevelCode" :value="option.mQomAqlLevelMainId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="首个抽样" prop="isFai" class="el-col el-col-11">
      <el-checkbox v-model="infoForm.isFai" true-label="true" false-label="false" @change="isFaiChange"></el-checkbox>
    </el-form-item>
    <el-form-item label="每个抽样" prop="isFullInspection" class="el-col el-col-11 el-col-offset-1">
      <el-checkbox v-model="infoForm.isFullInspection" true-label="true" false-label="false" @change="isFullInspectionChange"></el-checkbox>
    </el-form-item>
    <el-form-item label="随机抽样" prop="isRandomSampling" class="el-col el-col-11">
      <el-checkbox v-model="infoForm.isRandomSampling" true-label="true" false-label="false" @change="isRandomSamplingChange"></el-checkbox>
    </el-form-item>
    <el-form-item label="等距抽样" prop="isEquidistanceSampling" class="el-col el-col-11 el-col-offset-1">
      <el-checkbox v-model="infoForm.isEquidistanceSampling" true-label="true" false-label="false" @change="isEquidistanceSamplingChange"></el-checkbox>
    </el-form-item>
    <el-form-item label="抽样间隔" prop="samplingInterval" class="el-col el-col-24">
      <el-input v-model.trim="infoForm.samplingInterval" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="dialog-footer el-col el-col-24">
      <el-button type="primary" size="mini" @click="savePlanInfo">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      infoForm: {
        tQomInspectionPlanMainId: null,
        mComProcessSegId: '',
        mQomInspectionLevelId: '',
        mQomAqlLevelMainId: '',
        isFai: 'true',
        isFullInspection: 'false',
        isRandomSampling: 'false',
        isEquidistanceSampling: 'false',
        samplingInterval: ''
      },
      rules: {
        mComProcessSegId: [{ required: true, message: '请选择工站！' }],
        mQomInspectionLevelId: [{ required: true, message: '请选择检查水平！' }],
        mQomAqlLevelMainId: [{ required: true, message: '请选择合格水平！' }]
      }
    }
  },
  props: {
    planList: Array,
    tQomInspectionPlanMainId: String,
    isEdit: Boolean,
    processList: {
      type: Array,
      default () {
        return []
      }
    },
    inspectionLevelList: {
      type: Array,
      default () {
        return []
      }
    },
    aqlList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    isFaiChange (val) {
      if (val === 'true') {
        this.infoForm.isFullInspection = 'false'
        this.infoForm.isRandomSampling = 'false'
        this.infoForm.isEquidistanceSampling = 'false'
      }
    },
    isFullInspectionChange (val) {
      if (val === 'true') {
        this.infoForm.isFai = 'false'
        this.infoForm.isRandomSampling = 'false'
        this.infoForm.isEquidistanceSampling = 'false'
      }
    },
    isRandomSamplingChange (val) {
      if (val === 'true') {
        this.infoForm.isFai = 'false'
        this.infoForm.isFullInspection = 'false'
        this.infoForm.isEquidistanceSampling = 'false'
      }
    },
    isEquidistanceSamplingChange (val) {
      if (val === 'true') {
        this.infoForm.isFai = 'false'
        this.infoForm.isFullInspection = 'false'
        this.infoForm.isRandomSampling = 'false'
      }
    },
    savePlanInfo () {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          const { isEdit, infoForm, tQomInspectionPlanMainId } = this
          const res = isEdit ? await this.$api.editAqlplanInfo(infoForm) : await this.$api.addAqlplanInfo(infoForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAqlPlanInfo', tQomInspectionPlanMainId)
          })
        }
      })
    }
  },
  created () {
    this.infoForm.tQomInspectionPlanMainId = this.tQomInspectionPlanMainId
  }
}
</script>
