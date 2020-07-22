<template>
  <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item label="检查水平" prop="levelCode">
      <el-select v-model="infoForm.mQomInspectionLevelId" size="mini" style="width:100%;" disabled>
        <el-option v-for="(level,i) in levelList" :key="i" :label="level.levelCode" :value="level.mQomInspectionLevelId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="样本代码" prop="sampleCode">
      <el-input size="mini" v-model.trim="infoForm.sampleCode"></el-input>
    </el-form-item>
    <el-form-item label="批量最小值" prop="lotSizeMin">
      <el-input size="mini" v-model.trim="infoForm.lotSizeMin" ></el-input>
    </el-form-item>
    <el-form-item label="批量最大值" prop="lotSizeMax">
      <el-input size="mini" v-model.trim="infoForm.lotSizeMax"></el-input>
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
      infoForm: {
        mQomInspectionLevelId: '',
        sampleCode: '',
        lotSizeMin: '',
        lotSizeMax: ''
      },
      rules: {
        sampleCode: [{ required: true, message: '样本代码不能为空' }]
      }
    }
  },
  props: {
    levelList: Array,
    mQomInspectionLevelId: String,
    isEdit: Boolean
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
