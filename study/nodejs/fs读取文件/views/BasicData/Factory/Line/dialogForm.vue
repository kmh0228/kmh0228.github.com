<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="8vw" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('line_lineCode')" prop="lineCode" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.lineCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('line_lineName')" prop="lineName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.lineName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('line_lineType')" prop="lineType" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.lineType" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('line_lineDesc')" prop="lineDesc" class="el-col el-col-24">
      <el-input type="textarea" :rows="2" v-model="dialogForm.lineDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveLineInfo">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        lineCode: '',
        lineName: '',
        lineType: '',
        lineDesc: ''
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    }
  },
  computed: {
    rules () {
      return {
        lineCode: [{ required: true, message: this.$t('line_lineCodeRequire') }],
        lineName: [{ required: true, message: this.$t('line_lineNameRequire') }],
        lineType: [{ required: true, message: this.$t('line_lineTypeRequire') }]
      }
    }

  },
  methods: {
    saveLineInfo () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.editLine(dialogForm) : await this.$api.addLine(dialogForm)
          if (res.code === '200') {
            this.$message.success(res.msg)
            this.$emit('getLineList')
            this.$emit('cannel')
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>
