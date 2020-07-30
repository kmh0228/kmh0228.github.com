<template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item :label="$t('feedRules_InspeReguNo')" prop="sipNo" class="el-col-24">
    <el-input size="mini" v-model="dialogForm.sipNo"></el-input>
  </el-form-item>
  <el-form-item :label="$t('feedRules_RevisInspRegu')" prop="sipVersion" class="el-col-24">
    <el-input size="mini" v-model="dialogForm.sipVersion"></el-input>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
    <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
  </el-form-item>

</el-form>

</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        sipNo: '',
        sipVersion: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        sipNo: [{ required: true, message: this.$t('feedRules_PleasSeleInspGa') }],
        sipVersion: [{ required: true, message: this.$t('feedRules_PleasSeleReviIn') }]
      }
    }
  },
  props: {
    cannel: {
      type: Function
    },
    initData: {
      type: Function
    },
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    // 新增检规
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let res = this.isEdit ? await this.$api.updSipMain(this.dialogForm) : await this.$api.addSipMain(this.dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('initData')
          })
        }
      })
    }
  }

}
</script>
