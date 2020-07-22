<template>
  <el-form :model="detailForm" ref="detailForm" :rules="rule" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="字典标签" prop="dictName">
      <el-input v-model.trim="detailForm.dictName" size="mini" placeholder="请输入字典标签"></el-input>
    </el-form-item>
    <el-form-item label="字典值" prop="dictCode">
      <el-input v-model.trim="detailForm.dictCode" size="mini" placeholder="请输入字典值"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sortNo">
      <el-input v-model.number.trim="detailForm.sortNo" size="mini" placeholder="请输入排序值"></el-input>
    </el-form-item>
     <el-form-item class="el-col el-col-24 dialog-footer" label-width="0" >
      <el-button type="primary" size="mini" @click="saveDictDetail">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      detailForm: {
        dictName: '',
        dictCode: '',
        sortNo: ''
      },
      rule: {
        dictName: [{ required: true, message: '字典标签不能为空' }],
        dictCode: [{ required: true, message: '字典值不能为空' }]
      }
    }
  },
  props: {
    cannel: Function,
    isEdit: Boolean,
    dictType: String,
    getDictionaryDetail: Function
  },
  methods: {
    saveDictDetail () {
      this.$refs.detailForm.validate(async valid => {
        if (valid) {
          let { isEdit, detailForm, dictType } = this
          let data = isEdit ? detailForm : Object.assign(detailForm, { dictType })
          let res = isEdit ? await this.$api.editDictionary(data) : await this.$api.insertDictionaryDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('getDictionaryDetail', dictType)
            this.$emit('cannel')
          })
        }
      })
    }
  }

}
</script>
