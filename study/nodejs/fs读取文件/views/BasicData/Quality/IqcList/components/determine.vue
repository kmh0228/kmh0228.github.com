<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="判定" name="determine">
      <el-radio v-model="inspectResult" label="ACCEPT">合格</el-radio>
      <el-radio v-model="inspectResult" label="REJECT">拒收</el-radio>
      <el-radio v-model="inspectResult" label="AOD">特采</el-radio>
      <el-radio v-model="inspectResult" label="PICK">挑选</el-radio>
      <el-form :model="decideForm" label-width="180px" label-position="left" class="el-row mes-form-rule"  style="padding-top:1.5vh"  ref="decideForm" >
        <div v-if="isError">
          <el-form-item label="特采单号" class="el-col el-col-11">
            <el-input v-model="decideForm.aod" size="mini" :disabled="isAod"></el-input>
          </el-form-item>
          <el-form-item label="供应商异常联络单" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="decideForm.vdcs" size="mini" :disabled="isReject"></el-input>
          </el-form-item>
          <el-form-item label="SQE" class="el-col el-col-11">
            <el-select v-model="decideForm.sqe" size="mini" style="width:100%;">
              <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.mComEmployeeId" @click.native="setEmal(option.employeeEmail)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SQE邮箱" class="el-col el-col-11 el-col-offset-1">
            <el-input  v-model="decideForm.sqeMailbox" size="mini" readonly></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注" class="el-col el-col-11">
          <el-input v-model="decideForm.remark" type="textarea" :rows="2" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'determine',
      inspectResult: 'ACCEPT',
      decideForm: {
        aod: '',
        vdcs: '',
        sqe: '',
        sqeMailbox: '',
        remark: ''
      },
      userList: []
    }
  },
  computed: {
    isError () {
      return this.inspectResult !== 'ACCEPT'
    },
    isAod () {
      return this.inspectResult === 'REJECT' || this.inspectResult === 'PICK'
    },
    isReject () {
      return this.inspectResult === 'AOD' || this.inspectResult === 'PICK'
    }
  },
  watch: {
    inspectResult (val) {
      if (val !== 'AOD') {
        this.$global.resetForm(this.decideForm)
      }
      this.decideForm.inspectResult = val
    }
  },
  methods: {
    async getUsers () {
      const data = {
        keywords: '',
        employeePost: '检验',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.userList = res.data.list
      } else {
        this.userList = []
      }
    },
    setEmal (email) {
      this.decideForm.sqeMailbox = email
    }
  },
  created () {
    this.getUsers()
  }
}
</script>
