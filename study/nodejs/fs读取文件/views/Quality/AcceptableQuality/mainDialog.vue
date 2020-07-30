<template>
  <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item :label="$t('common_InspeLeve')" prop="mQomInspectionLevelId">
      <!-- <el-input size="mini" v-model="mainForm.mQomInspectionLevelId"></el-input> -->
      <mes-select v-model="mainForm.mQomInspectionLevelId" :placeholder="$t('common_PleasSele')" labelKey="levelName" valueKey="mQomInspectionLevelId" method="getInspectLevels"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('AcceptableQuality_QualifiedQualityLevel')" prop="aqlLevelCode">
      <el-input size="mini" v-model="mainForm.aqlLevelCode"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveAqlLevel">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      mainForm: {
        mQomInspectionLevelId: '',
        aqlLevelCode: ''
      }
    }
  },
  props: {
    isEdit: Boolean,
    isCopy: Boolean
  },
  computed: {
    rules () {
      return {
        aqlLevelCode: [{ required: true, message: this.$t('AcceptableQuality_QualifiedQualityLevelCannotBeEmpty') }]
      }
    }
  },
  methods: {
    saveAqlLevel () {
      this.$refs.mainForm.validate(async valid => {
        if (valid) {
          const { isEdit, mainForm, isCopy } = this
          mainForm.aqlLevelName = mainForm.aqlLevelCode
          const res = isCopy ? await this.$api.copyAQLLevel(mainForm) : isEdit ? await this.$api.editAqlLevel(mainForm) : await this.$api.addAqlLevel(mainForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAqlLevels')
          })
        }
      })
    }
  }
}
</script>
