<template>
  <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item :label="$t('common_InspeLeve')" prop="levelCode">
      <el-select v-model="infoForm.mQomAqlLevelMainId" size="mini" style="width:100%;" disabled>
        <el-option v-for="(level,i) in aqlLevelList" :key="i" :label="level.aqlLevelCode" :value="level.mQomAqlLevelMainId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('AcceptableQuality_SampleCode')" prop="sampleCode">
      <!-- <el-input size="mini" v-model.trim="infoForm.sampleCode"></el-input> -->
      <el-select size="mini" v-model.trim="infoForm.sampleCode" style="width:100%">
        <el-option v-for="(option,i) in codeList" :key="i" :label="option" :value="option"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('AcceptableQuality_SampleQuantity')" prop="sampleSize">
      <el-input size="mini" v-model.trim="infoForm.sampleSize" ></el-input>
    </el-form-item>
    <el-form-item label="AC(Accept)" prop="acceptance">
      <el-input size="mini" v-model.trim="infoForm.acceptance"></el-input>
    </el-form-item>
    <el-form-item label="RE(rejection)" prop="rejection">
      <el-input size="mini" v-model.trim="infoForm.rejection"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveAqlLevelInfo">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      infoForm: {
        mQomAqlLevelMainId: '',
        sampleCode: '',
        sampleSize: '',
        acceptance: '',
        rejection: ''
      },
      codeList: []
    }
  },
  props: {
    mQomAqlLevelMainId: String,
    mQomInspectionLevelId: String,
    aqlLevelList: Array,
    isEdit: Boolean
  },
  computed: {
    rules () {
      return {
        sampleCode: [{ required: true, message: this.$t('AcceptableQuality_SampleCodeCannotBeEmpty') }],
        sampleSize: [{ required: true, message: this.$t('AcceptableQuality_SampleQuantityCannotBeEmpty') }]
      }
    }
  },
  methods: {
    saveAqlLevelInfo () {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          const { isEdit, infoForm, mQomAqlLevelMainId } = this
          const res = isEdit ? await this.$api.editAqlLevelDetail(infoForm) : await this.$api.addAqlLevelDetail(infoForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAqlLevelDetails', mQomAqlLevelMainId)
          })
        }
      })
    },
    async setCodeList () {
      let { mQomInspectionLevelId } = this
      const res = await this.$api.findSampleCode({ mQomInspectionLevelId })
      if (res.code === '200') {
        this.codeList = res.data.list
      } else {
        this.codeList = []
      }
    }
  },
  created () {
    this.infoForm.mQomAqlLevelMainId = this.mQomAqlLevelMainId
    this.setCodeList()
  }
}
</script>
