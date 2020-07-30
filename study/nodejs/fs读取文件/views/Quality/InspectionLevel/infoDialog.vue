<template>
  <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item :label="$t('common_InspeLeve')" prop="levelCode">
      <el-select v-model="infoForm.mQomInspectionLevelId" size="mini" style="width:100%;" disabled>
        <el-option v-for="(level,i) in levelList" :key="i" :label="level.levelCode" :value="level.mQomInspectionLevelId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('InspectionLevel_SampleCode')" prop="sampleCode">
      <el-input size="mini" v-model.trim="infoForm.sampleCode"></el-input>
    </el-form-item>
    <el-form-item :label="$t('InspectionLevel_BatchMinimum')" prop="lotSizeMin">
      <el-input size="mini" v-model.trim="infoForm.lotSizeMin" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('InspectionLevel_BatchMaximum')" prop="lotSizeMax">
      <el-input size="mini" v-model.trim="infoForm.lotSizeMax"></el-input>
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
      infoForm: {
        mQomInspectionLevelId: '',
        sampleCode: '',
        lotSizeMin: '',
        lotSizeMax: ''
      }
    }
  },
  props: {
    levelList: Array,
    mQomInspectionLevelId: String,
    isEdit: Boolean
  },
  computed: {
    rules () {
      return {
        sampleCode: [{ required: true, message: this.$t('InspectionLevel_SampleCodeCannotBeEmpty') }]
      }
    }
  },
  methods: {
    saveAqlLevel () {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          const { isEdit, infoForm, mQomInspectionLevelId } = this
          const res = isEdit ? await this.$api.editInspectLevelInfo(infoForm) : await this.$api.addInspectLevelInfo(infoForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getInspectLevelInfo', mQomInspectionLevelId)
          })
        }
      })
    }
  },
  created () {
    this.infoForm.mQomInspectionLevelId = this.mQomInspectionLevelId
  }
}
</script>
