<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="8vw" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('common_Department')" prop="mDeptId" class="el-col el-col-24">
      <el-select v-model.trim="dialogForm.mDeptId" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in deptList" :key="i" :label="option.department" :value="option.officeCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('user_DGDH')" prop="employeeCardId" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.employeeCardId" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('user_Name')" prop="employeeName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.employeeName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('user_Sex')" prop="employeeSex" class="el-col el-col-24">
      <el-radio-group v-model="dialogForm.employeeSex" size="mini">
        <el-radio :label="2">{{$t('user_male')}}</el-radio>
        <el-radio :label="1">{{$t('user_female')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('user_Mail')" prop="employeeEmail" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.employeeEmail" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('user_Post')" prop="employeePost" class="el-col el-col-24">
      <el-select v-model.trim="dialogForm.employeePost" size="mini" style="width:100%;">
        <el-option v-for="(item,i) in postList" :key="i" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item :label="$t('user_Hiredate')" prop="employeeJoinedDate" class="el-col el-col-24">
      <el-date-picker v-model="dialogForm.employeeJoinedDate" :picker-options="pickerOptions" value-format="yyyy-MM-DD" type="date" size="mini" style="width:100%;"></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('user_JobStatus')" prop="employeeStatus" class="el-col el-col-24">
      <el-radio-group v-model="dialogForm.employeeStatus">
        <el-radio :label="0">{{$t('user_OnTheJob')}}</el-radio>
        <el-radio :label="1">{{$t('user_quit')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('common_Line')" prop="mPomLineId" class="el-col el-col-24">
      <el-select v-model="dialogForm.mPomLineId" clearable size="mini" style="width:100%;">
        <el-option v-for="(line,i) in lineList" :key="i" :label="line.lineName" :value="line.mPomLineId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveUser">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
        mDeptId: [{ required: true, message: this.$t('user_Department') }],
        employeeCardId: [{ required: true, message: this.$t('user_numberEmpty') }],
        employeeName: [{ required: true, message: this.$t('user_NameEmpty') }]
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
