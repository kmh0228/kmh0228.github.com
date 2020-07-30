<template>
  <div class="mes-main mes-work-order">
  <h3 class="mes-main-title">{{$t('Allocation_TransferOrderManagement')}}</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input :placeholder="$t('Allocation_NoRequired')" v-model.trim="searchForm.allocatelistNo" size="mini" style="width:40%;">
      </el-input>
    </el-col>
    <el-col :span="12">
      <dict-select v-model="searchForm.noStatus" style="width:40%;float:right;" dictType="WMS_ALLOCATELIST_STATUS" :placeholder="$t('Allocation_DocumentStatus')" clearable></dict-select>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
          <el-button icon="el-icon-search" size="mini" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="allocationHandle('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteEntrylist('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetForm">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage" :initData="initData" :total="total" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @cell-click="cellClick" @selection-change="selectionChange">
          <el-table-column type="selection" width="50" align="center" ></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" :index="indexMethod"></el-table-column>
          <el-table-column prop="allocatelistNo" sortable :label="$t('Allocation_allocatelistNo')" min-width="110" show-overflow-tooltip label-class-name="mes-table-label" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column prop="outStockName" sortable :label="$t('Allocation_outStockName')" min-width="110" align="center"></el-table-column>
          <el-table-column prop="inStockName" sortable :label="$t('Allocation_inStockName')" min-width="100" align="center"></el-table-column>
          <el-table-column prop="remarks" sortable :label="$t('common_remarks')" min-width="110" align="center"></el-table-column>
          <el-table-column prop="noStatusName" sortable :label="$t('Allocation_DocumentStatus')" min-width="110" align="center">
            <template slot-scope="scope">
              <el-tag :type="setTagColor(scope.row.noStatus)" size="mini">{{scope.row.noStatusName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" sortable :label="$t('common_Creator')" min-width="100" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('common_CreateTime')" min-width="110" align="center"></el-table-column>
          <el-table-column :label="$t('common_Operate')" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="allocationHandle(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c' @click="deleteEntrylist(scope.row.mwmsAllocatelistId)"></handle-button>
          </template>
        </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs>
        <el-tab-pane :label="$t('Allocation_TransferOrderDetails')">
          <div class="mes-table">
            <el-table :data="detailData" border highlight-current-row @selection-change="detailTableSelect" size="mini">
              <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
              <el-table-column prop="mcomMaterialNo" sortable :label="$t('common_PorN')" align="center"></el-table-column>
              <el-table-column prop="mcomMaterialName" sortable :label="$t('common_PorN_Name')" align="center"></el-table-column>
              <el-table-column prop="allocateQuantity" sortable :label="$t('Allocation_quantity')" align="center" min-width="120"></el-table-column>
              <el-table-column prop="outQty" sortable :label="$t('Allocation_outQuantity')" align="center" min-width="120"></el-table-column>
              <el-table-column prop="inQty" sortable :label="$t('Allocation_inQuantity')" align="center" min-width="120"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="930px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getAllocationList="getAllocationList" @getAllocationDetail="getAllocationDetail" :detailData="detailData" :checkId="checkId"></dialog-form>
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
        allocatelistNo: '',
        noStatus: ''
      },
      tableData: [],
      detailData: [],
      total: 0,
      showTas: false,
      showMoreConditon: false,
      dialogVisible: false,
      isEdit: false,
      selection: 0,
      selectList: [],
      checkId: '',
      MateriaList: [],
      noStatusName: ''
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('Allocation_EditTransfer') : this.$t('Allocation_NewTransfer')
    }
  },
  methods: {
    setTagColor (status) {
      if (status === '处理中') {
        return 'warning'
      } else if (status === '完成') {
        return 'success'
      } else {
        return 'danger'
      }
    },
    indexMethod (index) {
      const { pageIndex, pageSize } = this.$refs.mesPage.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async getAllocationList () {
      const { page } = this.$refs.mesPage
      const { searchForm } = this
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getAllocationList(params)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    initData () {
      this.getAllocationList()
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.initData()
    },
    cellClick (row, column, cell, event) {
      this.showTas = true
      this.checkId = row.mwmsAllocatelistId
      this.noStatusName = row.noStatusName
      this.getAllocationDetail(this.checkId)
    },
    async getAllocationDetail (checkId) {
      let res = await this.$api.getAllocationDetail({ mwmsAllocatelistId: checkId })
      if (res.code === '200') {
        this.detailData = res.data.list
      } else {
        this.detailData = []
      }
    },
    detailTableSelect (selection) {
      this.selection = selection
    },
    async saveDetailList () {
      const { detailData } = this
      const data = Object.assign(detailData)
      const res = await this.$api.saveAllocationDetailList({ mwmsAllocateListDetailList: data, mwmsAllocatelistId: this.checkId })
      const { code, msg } = res
      if (code === '200') {
        this.$message.success(this.$t('common_EditSucceeded'))
        this.saveCurrentPage()
      } else {
        this.$message.error(msg)
      }
    },
    saveCurrentPage () {
      this.detailData = []
      this.getAllocationDetail(this.checkId)
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mwmsAllocatelistId)
      })
    },
    cannel () {
      this.dialogVisible = false
      this.getAllocationDetail(this.checkId)
    },
    allocationHandle (row) {
      if (row) {
        if (row.noStatusName === '开立') {
          this.isEdit = true
          this.dialogVisible = true
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.dialogForm)
            this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.dialogForm.mwmsAllocatelistId = row.mwmsAllocatelistId
          })
        } else {
          this.$message.error(this.$t('Allocation_NoOperation'))
        }
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteEntrylist (id) {
      let ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('Allocation_DeletePrompt1'))
        if (confirmRes) {
          let res = await this.$api.deleteAllocation({ mwmsAllocatelistIdList: ids })
          const { code, msg } = res
          if (code === '200') {
            this.getAllocationList()
            this.$message.success(msg)
            this.showTas = false
          } else {
            this.$message.error(msg)
          }
          this.cannel()
        }
      } else {
        this.$message.warning(this.$t('Allocation_DeletePrompt2'))
      }
    }
  },
  mounted () {
    this.getAllocationList()
  },
  components: {
    dialogForm,
    dialogTableSelect
  }
}
</script>
