<template>
  <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item :label="$t('common_InspeLeve')" prop="levelCode">
      <el-input size="mini" v-model="mainForm.levelCode"></el-input>
    </el-form-item>
    <el-form-item :label="$t('InspectionLevel_CheckLevelType')" prop="levelType">
      <el-select v-model="mainForm.levelType" size="mini" style="width:100%;">
        <el-option v-for="type in levelTypes" :key="type" :label="type" :value="type"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label-width="0" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveLevel">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      mainForm: {
        levelCode: '',
        levelName: '',
        levelType: ''
      }
    }
  },
  props: {
    isEdit: Boolean
  },
  computed: {
    levelTypes () {
      return [this.$t('InspectionLevel_GeneralInspectionLevel'), this.$t('InspectionLevel_SpecialInspectionLevel')]
    },
    rules () {
      return {
        levelCode: [{ required: true, message: this.$t('InspectionLevel_CheckLevelCannotBeEmpty') }],
        levelType: [{ required: true, message: this.$t('InspectionLevel_PleaseSelectCheckLevelType') }]
      }
    }
  },
  methods: {
    saveLevel () {
      this.$refs.mainForm.validate(async valid => {
        if (valid) {
          const { isEdit, mainForm } = this
          mainForm.levelName = mainForm.levelCode
          const res = isEdit ? await this.$api.editInspectLevel(mainForm) : await this.$api.addInspectLevel(mainForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getInspectLevelList')
          })
        }
      })
    }
  }
}
</script>
