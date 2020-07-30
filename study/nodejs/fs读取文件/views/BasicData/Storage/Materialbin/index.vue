<template>
<div class="mes-main mes-work-order">
  <h3 class="mes-main-title">{{$t('materialbin_MaterNumbStorLo')}}</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input :placeholder="$t('common_PleasEnteItemNu')" v-model.trim="keywords" size="mini" style="width:35%" @keydown.enter.native="getMaterialBin">
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getMaterialBin">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleMateriaBin('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMateria('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
        layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center"></el-table-column>
        <el-table-column prop="materialName" sortable :label="$t('common_Name')" align="center"></el-table-column>
        <el-table-column prop="version" sortable :label="$t('common_Edition')" align="center"></el-table-column>
        <el-table-column prop="mWmsWarehouseCode" sortable :label="$t('materialbin_StoraRoom')" align="center"></el-table-column>
        <el-table-column prop="mWmsWarehouseBinCode" sortable :label="$t('common_StoraLoca')" align="center"></el-table-column>
        <el-table-column prop="materialType" sortable :label="$t('common_MaterialType')" align="center"></el-table-column>
        <el-table-column prop="materialDesc" sortable :label="$t('common_Description')" align="center"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120">
            <template slot-scope="scope">
              <handle-button @click="handleMateriaBin(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteMateria(scope.row.mWmsMaterialbinId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" :select-obj="selectObj" @cannel="cannel" :isEdit="isEdit" @getMaterialBin="getMaterialBin"></dialog-form>
    </el-dialog>
  </div>
</div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      keywords: '',
      mWmsMaterialbinId: '',
      tableData: [],
      selectList: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      dialogVisible: false,
      isEdit: false,
      selectObj: {}
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('materialbin_EditItemNumbSto') : this.$t('materialbin_NewItemNumbStor')
    },
    etidtable () {
      let { selectList } = this
      return selectList.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getMaterialBin()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getMaterialBin()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleMateriaBin (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.selectObj = row
      } else {
        this.isEdit = false
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(selct => {
        this.selectList.push(selct.mWmsMaterialbinId)
      })
    },
    cannel () {
      this.dialogVisible = false
    },
    async getMaterialBin () {
      let { keywords, page } = this
      let data = Object.assign({ keywords }, page)
      let res = await this.$api.getMaterialBin(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
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
      this.getMaterialBin()
    },
    async deleteMateria (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('materialbin_AreYouSureDeleC'))
        if (confirmRes) {
          let res = await this.$api.deleteMaterialBin(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getMaterialBin()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('materialbin_PleasSeleCustIn'))
      }
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getMaterialBin()
  }

}
</script>
