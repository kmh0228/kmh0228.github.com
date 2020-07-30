<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('badCode_BadCode')" prop="defectCode" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.defectCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('badCode_BadCodeName')" prop="defectName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.defectName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('badCode_BadCodeType')" prop="defectCodeType" class="el-col el-col-24">
      <dict-select v-model="dialogForm.defectCodeType" dictType="DEFECT_CODE_TYPE"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('badCode_BadPosi')" prop="location" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.location" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('badCode_ChildNode')" prop="isLeaf" class="el-col el-col-24">
      <el-switch v-model.trim="dialogForm.isLeaf" @change="isLeafChange" :active-value="true" :inactive-value="false" :active-text="$t('common_Yes')" :inactive-text="$t('common_No')"></el-switch>
    </el-form-item>
    <el-form-item :label="$t('badCode_SuperNode')" class="el-col el-col-24"  v-if="!isEdit">
      <el-cascader v-model="defectCodeParentId" expand-trigger="hover" change-on-select clearable :disabled="parentIdDisabled" :show-all-levels="false" style="width:100%" size="mini" :options="defectCodeOptions" :props="cascaderProps">
      </el-cascader>
    </el-form-item>
    <el-form-item :label="$t('badCode_BadDesc')" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.defectDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="submitForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        defectCode: '',
        defectName: '',
        defectCodeType: '',
        isLeaf: true,
        location: '',
        defectDesc: ''
      },
      cascaderProps: {
        label: 'defectCode',
        value: 'mQomDefectId',
        children: 'children'
      },
      defectCodeParentId: []
    }
  },
  props: {
    defectPid: {
      type: String
    },
    isEdit: {
      type: Boolean
    },
    defectCodeTypeList: {
      type: Array
    },
    defectCodeOptions: {
      type: Array
    }
  },
  computed: {
    parentIdDisabled () {
      const { isLeaf } = this.dialogForm
      return !isLeaf
    },
    rules () {
      return {
        defectCode: [{ required: true, message: this.$t('badCode_BadCodeCannBeEm') }],
        defectName: [{ required: true, message: this.$t('badCode_BadCodeNameCann') }],
        defectCodeType: [{ required: true, message: this.$t('badCode_PleasSeleBadCod') }]
      }
    }
  },
  methods: {
    isLeafChange (val) {
      if (!val) {
        this.defectCodeParentId = []
      }
    },
    submitForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let len = this.defectCodeParentId.length
          let defectPid = len > 0 ? this.defectCodeParentId[len - 1] : ''
          const { isLeaf } = this.dialogForm
          if (isLeaf) {
            if (!defectPid && !isEdit) {
              return this.$message.warning(this.$t('badCode_TheCurrNodeIsSe'))
            }
          }
          let data = isEdit ? dialogForm : Object.assign({ defectPid }, dialogForm)
          let res = isEdit ? await this.$api.editDefectCode(data) : await this.$api.addDefectCode(data)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getDefectCodes')
            this.$emit('cannel')
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  }
}
</script>
