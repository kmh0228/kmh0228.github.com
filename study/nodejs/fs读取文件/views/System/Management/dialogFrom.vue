<template>
  <el-form :model="dialogFrom"  ref="dialogFrom" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('Management_Code')" prop="configureCode" class="el-col el-col-24">
      <el-input :disabled="isEdit" v-model="dialogFrom.configureCode" :placeholder="$t('Management_enterCode')" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('Management_Name')" prop="configureName" class="el-col el-col-24">
      <el-input v-model="dialogFrom.configureName" dictType="DELIVERY_TYPE" :placeholder="$t('Management_enterName')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('Management_Value')" prop="configureValue" class="el-col el-col-24">
      <el-input v-model="dialogFrom.configureValue" style="width:100%"   :placeholder="$t('Management_enterValue')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_remarks')" prop="remark" class="el-col el-col-24">
      <el-input type="textarea"  :rows="2" v-model="dialogFrom.remark"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDeliveryList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogFrom: {
        configureCode: '',
        configureName: '',
        configureValue: '',
        remark: ''
      },
      rules: {
        configureCode: [{ required: true, message: this.$t('Management_enterCode') }],
        configureName: [{ required: true, message: this.$t('Management_enterName') }],
        configureValue: [{ required: true, message: this.$t('Management_enterValue') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getTableData: Function
  },
  methods: {
    saveDeliveryList () {
      this.$refs.dialogFrom.validate(async valid => {
        if (valid) {
          let { dialogFrom } = this
          let res = this.isEdit ? await this.$api.updateConfigure(dialogFrom) : await this.$api.insertConfigure(dialogFrom)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTableData')
          })
        }
      })
    }
  }
}
</script>
