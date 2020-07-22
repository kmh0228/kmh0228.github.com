<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item label="工厂" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item label="责任层级名称" prop="hierarchyId" class="el-col el-col-24">
      <el-select v-model="dialogForm.hierarchyId" size="mini" style="width:100%;" placeholder="请选择责任层级">
        <el-option v-for="option in hierarchyList" :key="option.mMomHierarchyId" :label="option.hierarchyName" :value="option.mMomHierarchyId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工种" prop="workKind" class="el-col el-col-24">
      <dict-select v-model="dialogForm.workKind" dictType="WORK_KIND" style="width:100%;"></dict-select>
    </el-form-item>
    <el-form-item label="人员" prop="userCode" class="el-col el-col-24">
      <el-select v-model="dialogForm.userCode" size="mini" style="width:100%;" placeholder="请选择人员">
        <el-option v-for="option in personList" :key="option.userCode" :label="option.userName" :value="option.userCode"></el-option>
        <!-- <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.mComEmployeeId"></el-option> -->
      </el-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveHierarchyUser">保存</el-button>
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
        hierarchyId: '',
        workKind: '',
        userCode: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择工厂' }],
        hierarchyId: [{ required: true, message: '请选择责任层级' }],
        workKind: [{ required: true, message: '请选择工种' }],
        userCode: [{ required: true, message: '请选择人员' }]
      },
      personList: []
    }
  },
  props: {
    isEdit: Boolean,
    hierarchyList: Array
  },
  methods: {
    saveHierarchyUser () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editHierarchyUser(dialogForm) : await this.$api.addHierarchyUser(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getHierarchyUserList')
          })
        }
      })
    },
    // 获取所有人员
    async getPersonList () {
      const res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.personList = res.data
      } else {
        this.personList = []
      }
    }
  },
  created () {
    this.getPersonList()
  }
}
</script>
