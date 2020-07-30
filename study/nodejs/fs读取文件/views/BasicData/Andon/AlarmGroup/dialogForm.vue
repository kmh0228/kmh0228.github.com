<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_Department')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" type="2" style="width:100%" size="mini" :placeholder="$t('common_PleasSeleDepa')"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('alarmGroup_GroupCode')" prop="groupCode" class="el-col el-col-24">
      <el-input v-model="dialogForm.groupCode" :placeholder="$t('alarmGroup_inputAlarGrouCode')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('alarmGroup_groupName')" prop="groupName" class="el-col el-col-24">
      <el-input v-model="dialogForm.groupName" :placeholder="$t('alarmGroup_inputNameAlarGrou')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_remarks')" prop="remark" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.remark" :placeholder="$t('alarmGroup_enterRema')"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveAlrmGroup">{{$t('common_save')}}</el-button>
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
        groupCode: '',
        groupName: '',
        remark: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        groupCode: [{ required: true, message: this.$t('alarmGroup_enterGrouCode') }],
        groupName: [{ required: true, message: this.$t('alarmGroup_enterGrouName') }]
      }
    }
  },
  props: {
    isEdit: Boolean
  },
  methods: {
    saveAlrmGroup () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editAndonGroup(dialogForm) : await this.$api.addAndonGroup(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAndonGroupList')
          })
        }
      })
    }
  }
}
</script>
