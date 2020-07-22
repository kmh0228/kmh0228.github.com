<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item label="工厂" prop="officeCode" class="el-col el-col-24">
       <cascader-select v-model="dialogForm.officeCode" style="width:100%;"></cascader-select>
    </el-form-item>
    <el-form-item label="设备类别名称" prop="mMomResourceTypeId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mMomResourceTypeId" size="mini" style="width:100%;" placeholder="请选择设备类别">
        <el-option v-for="option in deviceTypeList" :key="option.mMomResourceTypeId" :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="故障代码" prop="mmomFailcodeId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mmomFailcodeId" size="mini" style="width:100%;" placeholder="请选择故障代码">
        <el-option v-for="option in failCodeList" :key="option.mMomFailcodeId" :label="option.failCode" :value="option.mMomFailcodeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="故障原因" prop="failReason" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.failReason" style="width:100%" placeholder="请输入故障原因"></el-input>
    </el-form-item>
    <el-form-item label="是否预定义" prop="isPredefined" class="el-col el-col-24">
      <el-checkbox v-model="dialogForm.isPredefined"></el-checkbox>
    </el-form-item>
    <el-form-item label="故障原因描述" prop="failDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.failDesc" placeholder="请输入故障原因描述"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveFailReason">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        mMomResourceTypeId: '',
        mmomFailcodeId: '',
        failReason: '',
        isPredefined: true,
        failDesc: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择工厂' }],
        mMomResourceTypeId: [{ required: true, message: '请选择设备类别' }],
        mmomFailcodeId: [{ required: true, message: '请选择故障代码' }],
        failReason: [{ required: true, message: '请输入故障原因' }],
        failDesc: [{ required: true, message: '请输入故障原因描述' }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    deviceTypeList: Array,
    failCodeList: Array
  },
  methods: {
    saveFailReason () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editTpmFailReason(dialogForm) : await this.$api.addTpmFailReason(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTpmFailReasonList')
          })
        }
      })
    }
  }
}
</script>
