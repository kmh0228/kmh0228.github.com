<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('equipmentCate_EquipCateCode')" prop="typeCode" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.typeCode" dictType="DELIVERY_TYPE" :placeholder="$t('equipmentCate_enterEquiCateCode')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_EquipCateName')" prop="typeName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.typeName" style="width:100%" :placeholder="$t('equipmentCate_enterDeviCateName')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Description')" prop="description" class="el-col el-col-24">
      <el-input type="textarea" :rows="2" v-model.trim="dialogForm.description"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDeviceClass">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        typeCode: '',
        typeName: '',
        description: ''
      },
      rules: {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        typeCode: [{ required: true, message: this.$t('equipmentCate_enterEquiCateCode') }],
        typeName: [{ required: true, message: this.$t('equipmentCate_enterDeviCateName') }]
      }
    }
  },
  props: {
    isEdit: Boolean
  },
  methods: {
    saveDeviceClass () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editDeviceClass(dialogForm) : await this.$api.addDeviceClass(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getDeviceClassList')
          })
        }
      })
    }
  }
}
</script>
