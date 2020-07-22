<template>
  <el-form :model="formData" ref="barCodeForm" :rules="rule" label-width="30%" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="条码名称" prop="fileName" class="el-col el-col-24">
      <el-input v-model.trim="formData.fileName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="打印模版路径" prop="filePath" class="el-col el-col-24">
      <el-input v-model.trim="formData.filePath" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="模版类型" prop="fileType" class="el-col el-col-24">
      <!-- <el-select v-model="formData.fileType" placeholder="请选择" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in templateOption" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
      </el-select> -->
      <dict-select  v-model="formData.fileType" dictType="PRINT_TEMPLETE_TYPE" clearable></dict-select>
    </el-form-item>
    <el-form-item label="默认数量" prop="printCopies" class="el-col el-col-24">
      <el-input v-model.trim="formData.printCopies" size="mini"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    const defaultNumRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入默认数量'))
      } else {
        if (/^[1-9][0-9]*$/.test(value)) {
          callback()
        } else {
          callback(new Error('默认数量必须为正整数'))
        }
      }
    }
    return {
      rule: {
        fileName: [{ required: true, message: '请输入条码名称' }],
        filePath: [{ required: true, message: '请填写打印模版路径' }],
        fileType: [{ required: true, message: '请选择模版类型' }],
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
          if (handleType === '新增') {
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
