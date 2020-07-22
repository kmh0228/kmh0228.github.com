<template>
<el-form :model="dispatchForm" ref="dispatchForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item label="部门" class="el-col el-col-11">
    <el-select style="width:100%" placeholder="请选择部门" v-model="dispatchForm.departMent" clearable @change="getUsers">
      <el-option v-for="(option,i) in departList" :key="i" :label="option.fullName" :value="option.department"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="姓名" class="el-col el-col-11 el-col-offset-2">
    <el-input v-model="dispatchForm.keywords"  placeholder="请输入员工工号" @keydown.enter.native="getUsers">
       <i slot="suffix" class="el-input__icon el-icon-search" @click="getUsers"></i>
    </el-input>
  </el-form-item>
  <el-form-item class="el-col el-col-24" label-width="0" style="margin-top:20px">
    <el-table :data="userList" border @selection-change="selectionChange" ref="selectRef"  @select="selectRow">
      <el-table-column type="selection" ></el-table-column>
      <el-table-column prop="employeeName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="employeeCardId" label="账号" align="center"></el-table-column>
      <el-table-column prop="department" label="部门" align="center"></el-table-column>
      <el-table-column label="邮箱" align="center"></el-table-column>
    </el-table>
  </el-form-item>
  <el-form-item>
    <el-row>
     <el-col  style="float:right">
           <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
          layout="total,sizes,prev,pager,next,jumper,->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        </el-col>
    </el-row>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="dispatchData">派工</el-button>
    <el-button size="mini" @click="$emit('cannelDispatch')">取消</el-button>
  </el-form-item>
</el-form>

</template>

<script>
export default {
  data () {
    return {
      total: 0,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      userList: [],
      departList: [],
      dispatchForm: {
        departMent: '',
        keywords: ''
      },
      onEmployee: '',
      rules: {
      }

    }
  },
  computed: {

  },
  props: {
    cannelDispatch: {
      type: Function
    },
    ids: {
      type: Array
    },
    getdata: {
      type: Function
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getUsers()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getUsers()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectionChange (selection) {
      // this.selectList = []
      // selection.map(item => {
      //   this.selectList.push(item.officeName)
      // })
    },
    selectRow (selection, row) {
      if (selection.length > 1) {
        this.$refs.selectRef.clearSelection()
        this.$refs.selectRef.toggleRowSelection(row, true)
      }
      this.onEmployee = row.mComEmployeeId
    },

    // 获取人员信息
    async getUsers () {
      let { page } = this
      let officeName = this.dispatchForm.departMent
      let keywords = this.dispatchForm.keywords
      let data = Object.assign({ keywords, officeName }, page)
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.userList = res.data.list
      } else {
        this.userList = []
      }
    },
    async getDepartment () {
      let { page } = this
      let res = await this.$api.getDepartment(page)
      this.departList = res.data
    },
    async dispatchData () {
      let inspector = this.onEmployee
      let grNos = this.ids
      let data = Object.assign({ inspector }, { grNos })
      let res = await this.$api.updateIqcMain(data)
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannelDispatch')
        this.$emit('getdata')
      })
    }

  },
  created () {
    this.getUsers()
    this.getDepartment()
  }

}
</script>
