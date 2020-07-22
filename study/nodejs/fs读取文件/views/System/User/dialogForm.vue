<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="8vw" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="部门" prop="mDeptId" class="el-col el-col-24">
      <el-select v-model.trim="dialogForm.mDeptId" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in deptList" :key="i" :label="option.department" :value="option.officeCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="员工工号" prop="employeeCardId" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.employeeCardId" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="employeeName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.employeeName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="employeeSex" class="el-col el-col-24">
      <el-radio-group v-model="dialogForm.employeeSex" size="mini">
        <el-radio :label="2">男</el-radio>
        <el-radio :label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="邮箱" prop="employeeEmail" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.employeeEmail" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="岗位" prop="employeePost" class="el-col el-col-24">
      <el-select v-model.trim="dialogForm.employeePost" size="mini" style="width:100%;">
        <el-option v-for="(item,i) in postList" :key="i" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="入职日期" prop="employeeJoinedDate" class="el-col el-col-24">
      <el-date-picker v-model="dialogForm.employeeJoinedDate" :picker-options="pickerOptions" value-format="yyyy-MM-DD" type="date" size="mini" style="width:100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="在职状态" prop="employeeStatus" class="el-col el-col-24">
      <el-radio-group v-model="dialogForm.employeeStatus">
        <el-radio :label="0">在职</el-radio>
        <el-radio :label="1">离职</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="线别" prop="mPomLineId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mPomLineId" clearable size="mini" style="width:100%;">
        <el-option v-for="(line,i) in lineList" :key="i" :label="line.lineName" :value="line.mPomLineId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveUser">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mDeptId: '',
        employeeCardId: '',
        employeeName: '',
        employeeSex: 2,
        employeeEmail: '',
        employeePost: '',
        employeeJoinedDate: '',
        employeeStatus: 0,
        mPomLineId: ''
      },
      rules: {
        mDeptId: [{ required: true, message: '请选择部门' }],
        employeeCardId: [{ required: true, message: '员工工号不能为空' }],
        employeeName: [{ required: true, message: '姓名不能为空' }]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  props: {
    lineList: {
      type: Array,
      default () {
        return []
      }
    },
    deptList: {
      type: Array,
      default () {
        return []
      }
    },
    postList: {
      type: Array,
      default () {
        return []
      }
    },
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    saveUser () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editEmployee(dialogForm) : await this.$api.addEmployee(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getUsers')
          })
        }
      })
    }
  }
}
</script>
