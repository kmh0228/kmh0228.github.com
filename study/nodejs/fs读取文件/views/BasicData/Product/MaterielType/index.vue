<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('materielType_materielTypeManager')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('materielType_pleaseInputMT')" v-model.trim="keywords" size="mini" style="width:40%" @keydown.enter.native="getMaterialType" >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getMaterialType"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getMaterialType">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleMaterialType('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMaterialType('')">{{$t('common_Delete')}}</el-button>
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
          <el-table-column prop="mComMaterialtypeCode" sortable :label="$t('common_MaterialType')" align="center"></el-table-column>
          <el-table-column prop="mComMaterialtypeDesc" sortable :label="$t('common_Description')" align="center"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('common_Creator')" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('common_CreateTime')" align="center"></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handleMaterialType(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteMaterialType(scope.row.mComMaterialtypeId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
         </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="showDialog" :title="dialogTitle" class="handle-dialog" width="600px" >
      <el-form :model="dialogForm" v-if="showDialog" ref="dialogForm" :rules="rules" label-width="140px" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('common_MaterialType')" prop="mComMaterialtypeCode" class="el-col el-col-24">
          <el-input v-model.trim="dialogForm.mComMaterialtypeCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Description')"  prop="mComMaterialtypeDesc" class="el-col el-col-24">
          <el-input v-model.trim="dialogForm.mComMaterialtypeDesc" type="textarea" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div class="dailog-footer" align="center">
        <el-button type="primary" @click="saveMaterialType">{{$t('common_ok')}}</el-button>
        <el-button @click="showDialog = false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryLevel: 1,
      keywords: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      showDialog: false,
      isEdit: false,
      dialogForm: {
        mComMaterialtypeCode: '',
        mComMaterialtypeDesc: ''
      },
      selectList: []
    }
  },
  computed: {
    rules () {
      return { mComMaterialtypeCode: [{ required: true, message: this.$t('materielType_mTTypeRequire') }] }
    },
    dialogTitle () {
      return this.isEdit ? this.$t('materielType_editMaterielType') : this.$t('materielType_addMaterielType')
    },
    editBtnDisabled () {
      const len = this.selectList.length
      return len !== 1
    },
    delBtnDisabled () {
      const len = this.selectList.length
      return len === 0
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
      this.selectList = []
      selection.forEach(val => {
        this.selectList.push(val.mComMaterialtypeId)
      })
    },
    handleMaterialType (row) {
      this.showDialog = true
      if (row) {
        this.isEdit = true
        let { dialogForm } = this
        let keys = Object.keys(dialogForm)
        this.dialogForm = this.$global.filterForm(row, keys)
        this.dialogForm.mComMaterialtypeId = row.mComMaterialtypeId
      } else {
        this.isEdit = false
        this.$global.resetForm(this.dialogForm)
      }
    },
    async getMaterialType () {
      let { page, keywords, queryLevel } = this
      let data = Object.assign({ keywords, queryLevel }, page)
      let res = await this.$api.getMaterialType(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keywords = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getMaterialType()
    },
    async saveMaterialType () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let data = dialogForm
          let res = this.isEdit ? await this.$api.editMaterialType(data) : await this.$api.addMaterialType(data)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.showDialog = false
            this.getMaterialType()
          } else {
            this.$message.error(msg)
          }
        }
      })
    },
    async deleteMaterialType (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('materielType_confirmDelCurMT'))
        if (confirmRes) {
          let res = await this.$api.deleteMaterialType(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getMaterialType()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('materielType_placeSelDelMT'))
      }
    }
  },
  created () {
    this.getMaterialType()
  }
}
</script>
