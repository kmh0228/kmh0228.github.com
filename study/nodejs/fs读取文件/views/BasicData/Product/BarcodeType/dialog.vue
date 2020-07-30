<template>
  <el-form :model="formData" ref="barCodeForm" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('barcodeType_BarcoName')" prop="fileName" class="el-col el-col-24">
      <el-input v-model.trim="formData.fileName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('barcodeType_PrintTempPath')" prop="filePath" class="el-col el-col-24">
      <el-input v-model.trim="formData.filePath" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('barcodeType_TemplType')" prop="fileType" class="el-col el-col-24">
      <!-- <el-select v-model="formData.fileType" placeholder="请选择" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in templateOption" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
      </el-select> -->
      <dict-select  v-model="formData.fileType" dictType="PRINT_TEMPLETE_TYPE" clearable></dict-select>
    </el-form-item>
    <el-form-item :label="$t('barcodeType_DefauQuan')" prop="printCopies" class="el-col el-col-24">
      <el-input v-model.trim="formData.printCopies" size="mini"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    rules () {
      const defaultNumRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('barcodeType_PleasEnteDefaQu')))
        } else {
          if (/^[1-9][0-9]*$/.test(value)) {
            callback()
          } else {
            callback(new Error(this.$t('barcodeType_TheDefaQuanMust')))
          }
        }
      }
      return {
        fileName: [{ required: true, message: this.$t('barcodeType_PleasEnteBarcNa') }],
        filePath: [{ required: true, message: this.$t('barcodeType_PleasFillInPrin') }],
        fileType: [{ required: true, message: this.$t('barcodeType_PleasSeleTempTy') }],
        printCopies: [{ required: true, validator: defaultNumRule }]

      }
    }
  },
  props: {
    formData: {
      type: Object
    },
    handleType: {
      type: String
    }
  },
  methods: {
    handleBarCodeType () {
      this.$refs.barCodeForm.validate(async valid => {
        if (valid) {
          let res
          let { formData, handleType } = this
          if (handleType === this.$t('common_Add')) {
            res = await this.$api.addPrintBarCodeType(formData)
          } else {
            res = await this.$api.eidtPrintBarCodeType(formData)
          }
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('close-dialog')
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  }
}
</script>
