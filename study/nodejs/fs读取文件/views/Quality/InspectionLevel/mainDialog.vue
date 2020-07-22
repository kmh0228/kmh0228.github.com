<template>
  <el-form :model="mainForm" :rules="rules" ref="mainForm" label-width="120px" label-position="left" class="mes-form-rule">
    <el-form-item label="检查水平" prop="levelCode">
      <el-input size="mini" v-model="mainForm.levelCode"></el-input>
    </el-form-item>
    <el-form-item label="检查水平类型" prop="levelType">
      <el-select v-model="mainForm.levelType" size="mini" style="width:100%;">
        <el-option v-for="type in levelTypes" :key="type" :label="type" :value="type"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label-width="0" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveLevel">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      levelTypes: ['一般检查水平', '特殊检查水平'],
      mainForm: {
        levelCode: '',
        levelName: '',
        levelType: ''
      },
      rules: {
        levelCode: [{ required: true, message: '检查水平不能为空' }],
        levelType: [{ required: true, message: '请选择检查水平类型' }]
      }
    }
  },
  props: {
    isEdit: Boolean
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
