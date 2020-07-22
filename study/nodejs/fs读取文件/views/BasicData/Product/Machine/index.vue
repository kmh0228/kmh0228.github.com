<template>
<div class="mes-main mes-work-order">
  <div class="mes-main-title">{{$t('machine_machineManager')}}</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
       <el-input :placeholder="$t('machine_pleaseInputCode')" v-model.trim="keyword" size="mini" style="width:40%" @keydown.enter.native="getMachine">
       </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getMachine">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handletable('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMachine('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
      </el-col>
      <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange">>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="mComMaterialfamilyCode" sortable :label="$t('machine_machineCode')" align="center"></el-table-column>
        <el-table-column prop="mComMaterialfamilyName" sortable :label="$t('machine_machineName')" align="center"></el-table-column>
        <el-table-column prop="mComMaterialfamilySpec" sortable :label="$t('machine_Specifications')" align="center" width="150"></el-table-column>
        <el-table-column prop="mComMaterialfamilySnrule" sortable :label="$t('machine_codingRule')" align="center"></el-table-column>
        <el-table-column prop="mComMaterialfamilyDesc" sortable :label="$t('common_Description')" align="center"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center">
          <template slot-scope="scope" width="120">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteMachine(scope.row.mComMaterialfamilyId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :visible.sync="showDialog" :title="dialogTitle" class="handle-dialog" width="600px">
    <el-form :model="machineForm" v-if="showDialog" ref="machineForm" :rules="rules" label-width="140px" label-position="left" class="el-row mes-form-rule">
      <el-form-item :label="$t('machine_machineCode')" prop="mComMaterialfamilyCode" class="el-col el-col-24">
        <el-input v-model="machineForm.mComMaterialfamilyCode" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('machine_machineName')" prop="mComMaterialfamilyName" class="el-col el-col-24">
      <el-input v-model="machineForm.mComMaterialfamilyName" size="mini" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('machine_Specifications')" prop="mComMaterialfamilySpec" class="el-col el-col-24">
        <el-input v-model="machineForm.mComMaterialfamilySpec" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('machine_codingRule')" prop="mComMaterialfamilySnrule" class="el-col el-col-24">
        <el-input v-model.trim="machineForm.mComMaterialfamilySnrule" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_Description')"  prop="mComMaterialfamilyDesc" class="el-col el-col-24">
        <el-input v-model="machineForm.mComMaterialfamilyDesc" type="textarea" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <div class="dailog-footer" align="center">
      <el-button type="primary" @click="submitForm">{{$t('common_ok')}}</el-button>
      <el-button @click="showDialog = false">{{$t('common_cancel')}}</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      keyword: '',
      queryLevel: 1,
      isEdit: '',
      mComMaterialfamilyId: '',
      ids: [],
      tableData: [],
      showDialog: false,
      machineForm: {
        mComMaterialfamilyCode: ' ',
        mComMaterialfamilyName: '',
        mComMaterialfamilySpec: '',
        mComMaterialfamilySnrule: '',
        mComMaterialfamilyDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        mComMaterialfamilyCode: [{ required: true, message: this.$t('machine_produCodeRequire') }],
        mComMaterialfamilyName: [{ required: true, message: this.$t('machine_produNameRequire') }]
      }
    },
    dialogTitle () {
      return this.isEdit ? this.$t('machine_editMachine') : this.$t('machine_newMachine')
    },
    sendData () {
      let { mComMaterialfamilyId, machineForm, isEdit } = this
      let keys = Object.keys(machineForm)
      keys.forEach(key => {
        machineForm[key] = machineForm[key].replace(/(^\s*)|(\s*$)/g, '')
      })
      let data = isEdit ? Object.assign({ mComMaterialfamilyId }, machineForm) : machineForm
      return data
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (size) {
      this.page.pageSize = size
    },
    handleSizeChange (index) {
      this.page.pageIndex = index
    },
    tableSelectionChange (selection) {
      this.ids = []
      selection.map(item => {
        this.ids.push(item.mComMaterialfamilyId)
      })
    },
    // 获取所有产品系列
    async getMachine () {
      let { queryLevel } = this
      let mComMaterialfamilyCode = this.keyword
      let data = Object.assign({ mComMaterialfamilyCode, queryLevel }, this.page)
      let res = await this.$api.getMachine(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keyword = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getMachine()
    },
    // 新建或者编辑产品系列
    handletable (row) {
      let keys = Object.keys(this.machineForm)
      if (row) {
        this.isEdit = true
        this.mComMaterialfamilyId = row.mComMaterialfamilyId
        this.machineForm = this.$global.filterForm(row, keys)
      } else {
        this.isEdit = false
        keys.forEach(key => {
          this.machineForm[key] = ''
        })
      }
      this.showDialog = true
    },
    // 删除产品系列
    async deleteMachine (mComMaterialfamilyId) {
      let ids = mComMaterialfamilyId ? [mComMaterialfamilyId] : this.ids
      if (ids.length > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('machine_confirmDelCurMach'))
        if (confirmRes) {
          let res = await this.$api.deleteMachine(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.mComMaterialfamilyId = ''
            this.getMachine()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('machine_placeSelDelMach'))
      }
    },
    // 提交表单
    submitForm () {
      const vm = this
      vm.$refs['machineForm'].validate(async valid => {
        if (valid) {
          let { isEdit, sendData } = vm
          let res = isEdit ? await this.$api.updateMachine(sendData) : await this.$api.insertMachine(sendData)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.showDialog = false
            this.getMachine()
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getMachine()
  }
}
</script>
