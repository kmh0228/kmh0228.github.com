<template>
  <el-form :model="detailForm" ref="detailForm" :rules="rule" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('dictionary_label')" prop="dictName">
      <el-input v-model.trim="detailForm.dictName" size="mini" :placeholder="$t('dictionary_enterLabel')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('dictionary_value')" prop="dictCode">
      <el-input v-model.trim="detailForm.dictCode" size="mini" :placeholder="$t('dictionary_enterValue')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('dictionary_sort')" prop="sortNo">
      <el-input v-model.number.trim="detailForm.sortNo" size="mini" :placeholder="$t('dictionary_enterSortValue')"></el-input>
    </el-form-item>
     <el-form-item class="el-col el-col-24 dialog-footer" label-width="0" >
      <el-button type="primary" size="mini" @click="saveDictDetail">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
        dictName: [{ required: true, message: this.$t('dictionary_labelEmpty') }],
        dictCode: [{ required: true, message: this.$t('dictionary_valueEmpty') }]
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
