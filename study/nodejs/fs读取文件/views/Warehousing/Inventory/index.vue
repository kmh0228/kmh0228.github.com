<template>
  <div class="mes-main mes-work-order">
  <h3 class="mes-main-title">{{$t('Inventory_InventoryManagement')}}</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input :placeholder="$t('Inventory_PleaseInput1')" v-model.trim="searchForm.checklistNo" size="mini" style="width:40%;">
      </el-input>
    </el-col>
    <el-col :span="12">
      <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
        <i class="fa fa-filter"></i>
      </el-button>
      <dict-select v-model="searchForm.noStatus" style="width:40%;float:right;" dictType="CHECKORDER_STATUS" :placeholder="$t('Inventory_DocumentStatus')" clearable></dict-select>
    </el-col>
      <el-col :span="24" style="padding-top:1vh;">
      <el-form class="el-row mes-search-form" :model="searchForm" label-width="20%" label-position="left" v-show="showMoreConditon">
        <el-form-item :label="$t('Inventory_Warehouse')" class="el-col el-col-8">
          <mes-select v-model="searchForm.mWmsWarehouseId" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" :placeholder="$t('Inventory_PleaseSelectWarehouse')"></mes-select>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
          <el-button icon="el-icon-search" size="mini" @click="getinventoryList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="inventoryHandle('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteEntrylist('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="inventoryCompleted">{{$t('Inventory_InventoryCompleted')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="inventoryReview">{{$t('Inventory_toExamine')}}</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetForm">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage" :initData="getinventoryList" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @selection-change="tableSelect" @cell-click="cellClick">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" :index="indexMethod"></el-table-column>
          <el-table-column prop="checklistNo" sortable :label="$t('Inventory_InventoryNo')" min-width="110" show-overflow-tooltip label-class-name="mes-table-label" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column prop="mWmsWarehouseCode" sortable :label="$t('Inventory_Warehouse')" width="100" align="center"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('Inventory_Creator')" min-width="100" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('Inventory_CreationDate')" min-width="110" align="center" :formatter="formatDate"></el-table-column>
          <el-table-column prop="operator" sortable :label="$t('Inventory_Inventory')" min-width="100" align="center"></el-table-column>
          <el-table-column prop="operateDate" sortable :label="$t('Inventory_InventoryDate')" min-width="110" align="center" :formatter="formatDate"></el-table-column>
          <el-table-column prop="noStatus" sortable :label="$t('Inventory_DocumentStatus')" min-width="110" align="center">
            <template slot-scope="scope">
              <el-tag :type="setTagColor(scope.row.noStatus)" size="mini">{{filterStatus(scope.row.noStatus)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="auditor" sortable :label="$t('Inventory_Reviewer')" min-width="100" align="center"></el-table-column>
          <el-table-column prop="auditeDate" sortable :label="$t('Inventory_AuditDate')" min-width="110" align="center" :formatter="formatDate"></el-table-column>
          <el-table-column prop="remarks" sortable :label="$t('common_remarks')" align="center"></el-table-column>
          <el-table-column :label="$t('common_Operate')" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="inventoryHandle(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c' @click="deleteEntrylist(scope.row.mWmsChecklistId)"></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs>
        <el-tab-pane :label="$t('Inventory_InventoryDetails')">
          <div class="mes-table">
            <el-table :data="detailData" border size="mini">
              <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
              <el-table-column prop="materialNo" sortable :label="$t('Inventory_MaterialItemNo')" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable :label="$t('Inventory_MaterialName')" align="center" min-width="120"></el-table-column>
              <el-table-column prop="bookQuantity" sortable :label="$t('Inventory_BookQuantity')" align="center" min-width="120"></el-table-column>
              <el-table-column prop="realQuantity" sortable :label="$t('Inventory_ActualAmount')" align="center" min-width="120"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="930px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getinventoryList="getinventoryList" @getInventoryDetail="getInventoryDetail" :isEdit="isEdit" :detailData="detailData" :checkId="checkId"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      searchForm: {
        checklistNo: '',
        noStatus: '',
        mWmsWarehouseId: ''
      },
      tableData: [],
      detailData: [],
      documentStatus: '',
      showTas: false,
      showMoreConditon: false,
      dialogVisible: false,
      isEdit: false,
      editDetail: false,
      selection: [],
      selectList: [],
      isChange: false,
      checkId: ''
    }
  },
  watch: {
    detailData: {
      handler (val, old) {
        this.isChange = true
      },
      deep: true
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('Inventory_EditInventoryList') : this.$t('Inventory_AddInventoryList')
    }
  },
  methods: {
    filterStatus (status) {
      if (status === 'START') {
        return this.$t('Inventory_initial')
      } else if (status === 'CHECKING') {
        return this.$t('Inventory_ToBeReviewed')
      } else if (status === 'FINISH') {
        return this.$t('Inventory_Completed')
      } else {
        return ''
      }
    },
    setTagColor (status) {
      if (status === 'START') {
        return 'danger'
      } else if (status === 'CHECKING') {
        return 'warning'
      } else if (status === 'FINISH') {
        return 'success'
      } else {
        return 'danger'
      }
    },
    indexMethod (index) {
      const { pageIndex, pageSize } = this.$refs.mesPage.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.initData()
    },
    formatDate (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    filterTag (value, row) {
      return row.tag === value
    },
    cellClick (row, column, cell, event) {
      this.showTas = true
      this.checkId = row.mWmsChecklistId
      this.getInventoryDetail(this.checkId)
    },
    async getInventoryDetail (checkId) {
      let data = Object.assign({ checkId })
      let res = await this.$api.getInventoryDetail(data)
      if (res.code === '200') {
        this.detailData = res.data
      } else {
        this.detailData = []
      }
    },
    tableSelect (selection) {
      this.selection = selection
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mWmsChecklistId)
      })
    },
    async saveDetailList () {
      const { detailData } = this
      const data = Object.assign(detailData)
      const res = await this.$api.saveDetailList(data)
      let { code, msg } = res
      if (code === '200') {
        this.$message.success(msg)
        this.saveCurrentPage()
      } else {
        this.$message.error(msg)
      }
    },
    saveCurrentPage () {
      this.isChange = false
      this.editDetail = false
      this.detailData = []
      this.getInventoryDetail(this.checkId)
    },
    cancelDetailList () {
      let { isChange } = this
      if (isChange) {
        this.$confirm(this.$t('Inventory_ Tips'), this.$t('common_tips'), {
          confirmButtonText: this.$t('common_ok'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }).then(() => {
          this.saveDetailList()
        }).catch(() => {
          this.isChange = false
        })
      } else {
        this.saveCurrentPage()
      }
    },
    async deleteEntrylist (id) {
      let ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('Inventory_ Tips1'))
        if (confirmRes) {
          let res = await this.$api.deleteInventory(ids)
          let { msg, code } = res
          if (code === '200') {
            this.getinventoryList()
            this.$message.success(msg)
            this.showTas = false
          } else {
            this.$message.error(msg)
          }
          this.cannel()
        }
      } else {
        this.$message.warning(this.$t('Inventory_ Tips2'))
      }
    },
    async inventoryCompleted () {
      const { selection } = this
      if (selection.length === 1) {
        const res = await this.$api.inventoryCompleted({ mWmsChecklistId: selection[0].mWmsChecklistId })
        const { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
          this.getinventoryList()
        } else {
          this.$message.error(msg)
        }
      } else if (selection.length === 0) {
        this.$message.error(this.$t('Inventory_ Tips3'))
      } else if (selection.length > 1) {
        this.$message.error(this.$t('Inventory_ Tips4'))
      }
    },
    async inventoryReview () {
      const { selection } = this
      if (selection.length === 1) {
        let data = {
          mWmsChecklistId: selection[0].mWmsChecklistId,
          mWmsWarehouseId: selection[0].mWmsWarehouseId
        }
        const res = await this.$api.inventoryReview(data)
        const { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
          this.getinventoryList()
        } else {
          this.$message.error(msg)
        }
      } else if (selection.length === 0) {
        this.$message.error(this.$t('Inventory_ Tips3'))
      } else if (selection.length > 1) {
        this.$message.error(this.$t('Inventory_ Tips4'))
      }
    },
    cannel () {
      this.dialogVisible = false
      this.getInventoryDetail(this.checkId)
    },
    inventoryHandle (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mWmsChecklistId = row.mWmsChecklistId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async getinventoryList () {
      const { page } = this.$refs.mesPage
      const { searchForm } = this
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getinventoryList(params)
      if (res.code === '200') {
        this.tableData = res.data
      } else {
        this.tableData = []
      }
    },
    getMaterialName (num, v) {
      let materialName = num || ''
      let vsersion = v ? ':' + v : ''
      return `${materialName}${vsersion}`
    },
    initData () {
      this.getinventoryList()
    }
  },
  mounted () {
    this.getinventoryList()
  },
  components: {
    dialogForm,
    dialogTableSelect
  }
}
</script>
