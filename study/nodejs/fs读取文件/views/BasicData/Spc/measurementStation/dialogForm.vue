<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule" :isEdit="isEdit">
  <el-form-item :label="$t('common_Department')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" :disabled="isEdit" type="2" style="width:100%" size="mini" :placeholder="$t('common_PleasSeleDepa')"></cascader-select>
  </el-form-item>
  <el-form-item :label="$t('measurStation_SurveStat')+'/'+$t('common_labor')" prop="stationCode" class="el-col el-col-24">
    <el-input v-model.trim="dialogForm.stationCode" :disabled="isEdit" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_Description')" prop="stationDesc" class="el-col el-col-24">
    <el-input v-model.trim="dialogForm.stationDesc" size="mini"></el-input>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveStation">{{$t('common_save')}}</el-button>
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
        stationCode: '',
        stationDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('measurStation_DeparCannBeEmpt') }],
        stationCode: [{ required: true, message: this.$t('measurStation_SurveStat') + '/' + this.$t('measurStation_LabCannBeEmpt') }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    },
    getTableData: {
      type: Function
    }
  },
  methods: {
    saveStation () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.updateMeasurementStation(dialogForm) : await this.$api.saveMeasurementStation(dialogForm)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getTableData')
          } else {
            this.$message.error(msg)
          }
          this.$emit('cannel')
        }
      })
    }

  }
}
</script>
