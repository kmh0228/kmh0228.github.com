<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="检验项目" prop="inspectItem" class="el-col el-col-24">
      <el-input v-model.trim="form.inspectItem" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="检验类型" prop="itemType" selectKey="dictCode" class="el-col el-col-24">
      <dict-select v-model="form.itemType" selectKey="dictCode" dictType="OQC_TYPE"></dict-select>
    </el-form-item>
    <el-form-item label="客户代码" prop="customerCode" class="el-col el-col-24">
      <el-autocomplete v-model="form.customerCode" :disabled="customerCodeDisabled" :fetch-suggestions="querySearchAsync" value-key="customerCode" style="width:100%;" ></el-autocomplete>
    </el-form-item>
    <el-form-item label="检验内容" prop="inspectContent" class="el-col el-col-24">
      <el-input v-model="form.inspectContent" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        inspectItem: '',
        itemType: '',
        customerCode: '',
        inspectContent: ''
      },
      customerCodeDisabled: false
    }
  },
  props: {
    isEdit: Boolean,
    initData: Function
  },
  computed: {
    rules () {
      const { customerCodeDisabled } = this
      if (customerCodeDisabled) {
        return {
          inspectItem: [{ required: true, message: '检验项目不能为空' }],
          itemType: [{ required: true, message: '请选择检验类型' }]
        }
      } else {
        return {
          inspectItem: [{ required: true, message: '检验项目不能为空' }],
          itemType: [{ required: true, message: '请选择检验类型' }],
          customerCode: [{ required: true, message: '客户代码不能为空' }]
        }
      }
    }
  },
  watch: {
    form: {
      handler (val) {
        if (val.itemType === 'INTERNAL_CHECK') {
          val.customerCode = ''
          this.customerCodeDisabled = true
        } else {
          this.customerCodeDisabled = false
        }
      },
      deep: true
    }
  },
  methods: {
    querySearchAsync (query, callback) {
      const parmas = {
        customerCode: query,
        pageIndex: 1,
        pageSize: 10
      }
      this.$api.getCustomerCodeList(parmas).then(res => {
        callback(res.data)
      })
    },
    saveForm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { isEdit, form } = this
          const res = isEdit ? await this.$api.editQmsCheckItem(form) : await this.$api.addQmsCheckItem(form)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.initData()
          })
        }
      })
    }
  }
}
</script>
