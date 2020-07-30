<template>
  <div class="mes-main mes-work-order">
     <h3 class="mes-main-title">{{$t('WarehouseWarrant_InventoryManagement')}}</h3>
     <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select style="width:40%" v-model="searchForm.mWmsEntrylistStatus" dictType="DOCUMENT_STATUS" selectKey="dictCode" :clearable="true"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('WarehouseWarrant_PleaseEnterEheEntryNumber')" v-model.trim="searchForm.mWmsEntrylistNo" size="mini" style="width:40%;float:right;" @keydown.enter.native="getInboundOrder">
        </el-input>
      </el-col>
       <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_startTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startDt" style="width:100%" size="mini" type="datetime" :placeholder="$t('WarehouseWarrant_SelectDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common_endTime')" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endDt" style="width:100%" size="mini" type="datetime" :placeholder="$t('WarehouseWarrant_SelectDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getInboundOrder">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleWarrant('dialogForm','')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteEntrylist('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshData">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
           <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
          layout="total,sizes,prev,pager,next,jumper,->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableChange" @cell-click="cellClick">
          <el-table-column type="selection" width="50" align="center" :selectable="disabledSelect" ></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="mWmsEntrylistNo" sortable :label="$t('WarehouseWarrant_StorageOrders')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsEntrylistRelateno" sortable :label="$t('WarehouseWarrant_AssociatedNumber')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsEntrylistRelatenoitem" sortable :label="$t('WarehouseWarrant_AssociatedIndividual')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsWarehouseCode" sortable :label="$t('WarehouseWarrant_StorageWarehouse')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsEntrylistType" sortable :label="$t('WarehouseWarrant_StorageMode')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsEntrylistStatus" sortable :label="$t('WarehouseWarrant_StatusOfDocuments')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsEntrylistLevel" sortable :label="$t('WarehouseWarrant_Emergencies')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsVendorName" sortable :label="$t('WarehouseWarrant_Supplier')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('WarehouseWarrant_Creator')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('WarehouseWarrant_CreateTime')" align="center" min-width="120"></el-table-column>
          <!-- <el-table-column prop="lastEditor" sortable :label="$t('WarehouseWarrant_Amendment')" align="center"></el-table-column>
          <el-table-column prop="lastEditedDt" sortable :label="$t('WarehouseWarrant_FinalRevisionTime')" align="center"></el-table-column> -->
          <el-table-column :label="$t('common_Operate')" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <handle-button iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')" @click="handleWarrant('dialogForm',scope.row)"></handle-button>
              <handle-button iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c' @click="deleteEntrylist(scope.row.mWmsEntrylistId)"></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('WarehouseWarrant_ListOfEntries')" name="detail">
           <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" icon="el-icon-plus" :disabled="addDetailDisabled" @click="handleWarrant('detaliForm','')">{{$t('common_Add')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-delete-solid" :disabled="deleteDetailDisabled" @click="deleteDetailList('')">{{$t('common_Delete')}}</el-button>
              </el-col>
              <el-col :span="12">
                <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total1" :current-page="page1.pageIndex"
                  @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
            <el-table :data="detaliData" border highlight-current-row size="mini" @selection-change="tableDetailChange">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
              <el-table-column prop="materialNo" sortable :label="$t('WarehouseWarrant_PN')" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable :label="$t('WarehouseWarrant_MaterialName')" align="center"  min-width="120"></el-table-column>
              <el-table-column prop="" sortable :label="$t('WarehouseWarrant_SourceNo')" align="center"  min-width="120"></el-table-column>
              <el-table-column prop="" sortable :label="$t('WarehouseWarrant_Sourceindividual')" align="center"  min-width="120"></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailQty" sortable :label="$t('WarehouseWarrant_StorageQuantity')" align="center"  min-width="120"></el-table-column>
              <el-table-column prop="mWmsWarehouseBinCode" sortable :label="$t('WarehouseWarrant_StorageLevel')" align="center"></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailReceiveno" sortable :label="$t('WarehouseWarrant_AmountReceived')" align="center"  min-width="120"></el-table-column>
              <el-table-column prop="" sortable :label="$t('WarehouseWarrant_TestResults')" align="center"  min-width="120"></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailShelfno" sortable :label="$t('WarehouseWarrant_NumberOfShelves')" align="center"  min-width="120"></el-table-column>
              <el-table-column :label="$t('common_Operate')"  width="120" align="center" fixed="right">
                <template slot-scope="scope">
                  <handle-button iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')" @click="handleWarrant('detaliForm',scope.row)"></handle-button>
                  <handle-button iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c' @click="deleteDetailList(scope.row.mWmsEntrylistDetailId)"></handle-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
      <component v-if="dialogVisible" :is="dialogComponent" ref="dialog" @cannel="cannel" @getInboundOrder="getInboundOrder" @getInboundOrderDetail="getInboundOrderDetail" :isEdit="isEdit" :mWmsEntrylistId="mWmsEntrylistId" :mWmsMaterialbinId="mWmsMaterialbinId"></component>
    </el-dialog>

  </div>
</template>

<script>
import dialogForm from './dialogForm'
import detaliForm from './warehouseDialog'

export default {
  data () {
    return {
      mWmsEntrylistId: '',
      searchForm: {
        mWmsEntrylistStatus: '',
        mWmsEntrylistNo: '',
        startTime: '',
        endTime: ''
      },
      showMoreConditon: false,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total1: 0,
      page1: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      showTas: false,
      activeName: 'detail',
      detaliData: [],
      warrantType: '',
      dialogVisible: false,
      isEdit: false,
      dialogComponent: '',
      selectList: [],
      selectDetaliList: [],
      deleteDisabled: false,
      cannelOperation: false,
      mWmsMaterialbinId: ''
    }
  },
  computed: {
    pickerOptions () {
      return {
        shortcuts: [{
          text: this.$t('WarehouseWarrant_TodayToday'),
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: this.$t('WarehouseWarrant_YesterdayYesterday'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: this.$t('WarehouseWarrant_OneWeekAgo'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    },
    dialogTitle () {
      let str = ''
      if (this.isEdit) {
        str = this.dialogComponent === 'dialogForm' ? this.$t('WarehouseWarrant_EditLibraryInformation') : this.$t('WarehouseWarrant_DetailsOfTheEditor')
      } else {
        str = this.dialogComponent === 'dialogForm' ? this.$t('WarehouseWarrant_NewStorageListInformation') : this.$t('WarehouseWarrant_DetailsOfTheNewStorage')
      }
      return str
    },
    addDetailDisabled () {
      let { cannelOperation } = this
      return cannelOperation
    },
    deleteDetailDisabled () {
      let { cannelOperation } = this
      return cannelOperation
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getInboundOrder()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getInboundOrder()
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
      this.getInboundOrderDetail(this.mWmsEntrylistId)
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
      this.getInboundOrderDetail(this.mWmsEntrylistId)
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    indexMethod1 (index) {
      let { pageSize, pageIndex } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    disabledSelect (row, index) {
      if (row.mWmsEntrylistStatus === '开立') {
        return true
      } else {
        return false
      }
    },
    tableChange (selection) {
      this.selectList = []
      selection.map(select => {
        this.selectList.push(select.mWmsEntrylistId)
      })
    },
    tableDetailChange (selection) {
      this.selectDetaliList = []
      selection.map(select => {
        this.selectDetaliList.push(select.mWmsEntrylistDetailId)
      })
    },
    handleWarrant (dialogName, row) {
      this.dialogComponent = dialogName
      if (row) {
        this.isEdit = true
        if (dialogName === 'dialogForm') {
          if (row.mWmsEntrylistStatus !== '开立') {
            this.$message.warning(this.$t('WarehouseWarrant_NonOpenStateDoes'))
          } else {
            this.dialogVisible = true
            this.$nextTick(() => {
              let keys = Object.keys(this.$refs.dialog.dialogForm)
              this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
              this.$refs.dialog.dialogForm.mWmsEntrylistId = row.mWmsEntrylistId
            })
          }
        } else if (dialogName === 'detaliForm') {
          this.dialogVisible = true
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.detaliForm)
            this.$refs.dialog.detaliForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.detaliForm.mWmsEntrylistDetailId = row.mWmsEntrylistDetailId
          })
        }
      } else {
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    cellClick (row, column, cell, event) {
      this.mWmsMaterialbinId = row.mWmsEntrylistWharehouseid
      this.showTas = true
      let mWmsEntrylistId = row.mWmsEntrylistId
      this.getInboundOrderDetail(mWmsEntrylistId)
      this.mWmsEntrylistId = mWmsEntrylistId
      if (row.mWmsEntrylistStatus !== '开立') {
        this.cannelOperation = true
      } else {
        this.cannelOperation = false
      }
    },
    async getInboundOrderDetail (mWmsEntrylistId) {
      let mWmsEntrylistDetailEntrylistid = mWmsEntrylistId
      let data = Object.assign({ mWmsEntrylistDetailEntrylistid }, this.page1)
      let res = await this.$api.getInboundOrderDetail(data)
      this.detaliData = res.data.list
      this.total1 = res.data.totalNum
    },
    async getInboundOrder () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getInboundOrder(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    refreshData () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getInboundOrder()
    },
    async deleteEntrylist (id) {
      let ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('WarehouseWarrant_Tips1'))
        if (confirmRes) {
          let res = await this.$api.deleteInboundOrder(ids)
          let { msg, code } = res
          if (code === '200') {
            this.getInboundOrder()
            this.$message.success(msg)
            this.showTas = false
          } else {
            this.$message.error(msg)
          }
          this.cannel()
        }
      } else {
        this.$message.warning(this.$t('WarehouseWarrant_Tips2'))
      }
    },
    async deleteDetailList (id) {
      let { selectDetaliList, mWmsEntrylistId } = this
      let ids = id ? [id] : selectDetaliList
      const len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('WarehouseWarrant_Tips3'))
        if (confirmRes) {
          let res = await this.$api.deleteInboundOrderDetail(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getInboundOrderDetail(mWmsEntrylistId)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('WarehouseWarrant_PleaseSelectInformation'))
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getInboundOrder()
  },
  components: {
    dialogForm, detaliForm
  }
}
</script>
