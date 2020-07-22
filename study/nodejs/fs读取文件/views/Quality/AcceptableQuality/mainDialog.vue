<template>
  <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item label="检查水平" prop="mQomInspectionLevelId">
      <!-- <el-input size="mini" v-model="mainForm.mQomInspectionLevelId"></el-input> -->
      <mes-select v-model="mainForm.mQomInspectionLevelId" labelKey="levelName" valueKey="mQomInspectionLevelId" method="getInspectLevels"></mes-select>
    </el-form-item>
    <el-form-item label="合格质量水平" prop="aqlLevelCode">
      <el-input size="mini" v-model="mainForm.aqlLevelCode"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveAqlLevel">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
      },
      rules: {
        aqlLevelCode: [{ required: true, message: '合格质量水平不能为空' }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    isCopy: Boolean
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
