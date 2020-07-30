<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rule" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('dictionary_Name')" prop="mDataDictTypeName">
      <el-input :placeholder="$t('dictionary_enterName')" size="mini" v-model.trim="dialogForm.mDataDictTypeName"></el-input>
    </el-form-item>
    <el-form-item :label="$t('dictionary_Type')" prop="mDataDictTypeType">
      <el-input :placeholder="$t('dictionary_enterType')" size="mini" v-model.trim="dialogForm.mDataDictTypeType"></el-input>
    </el-form-item>
     <el-form-item class="el-col el-col-24 dialog-footer" label-width="0" >
      <el-button type="primary" size="mini" @click="saveDict">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mDataDictTypeName: '',
        mDataDictTypeType: ''
      },
      rule: {
        mDataDictTypeName: [{ required: true, message: this.$t('dictionary_labelEmpty') }]
      }
    }
  },
  props: {
    cannel: Function,
    isEdit: Boolean,
    getDictionaryType: Function
  },
  methods: {
    saveDict () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { isEdit, dialogForm } = this
          let data = Object.assign(dialogForm)
          let res = isEdit ? await this.$api.editDictType(data) : await this.$api.insertDictionaryType(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('getDictionaryType')
            this.$emit('cannel')
          })
        }
      })
    }
  }

}
</script>
