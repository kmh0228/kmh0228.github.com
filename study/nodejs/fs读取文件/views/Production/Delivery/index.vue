<template>
 <div class="mes-main mes-work-order">
   <h3 class="mes-main-title">{{$t('delivery_ShippOrdeMana')}}</h3>
   <el-row :gutter="20" class="mes-main-filte">
     <el-col :span="12">
       <el-input size="mini" v-model="keywords" style="width:35%" :placeholder="$t('delivery_inputShipOrdeNo')" @keydown.enter.native="getShipOrder" clearable></el-input>
     </el-col>
   </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getShipOrder">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDelivery('dialogForm','')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteShipOrder('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getShipOrder">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
           <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
          layout="total,sizes,prev,pager,next,jumper,->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        </el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableChange" @cell-click="cellClick">
        <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="officeName" sortable :label="$t('common_Department')" align="center"></el-table-column>
        <el-table-column prop="docNo" sortable :label="$t('delivery_ShippOrdeNo')" align="center"></el-table-column>
        <el-table-column prop="docStatus" sortable :label="$t('common_Status')" align="center"></el-table-column>
        <el-table-column prop="tpomSalesOrderId" sortable :label="$t('delivery_SalesOrdeNo')" align="center"></el-table-column>
        <el-table-column prop="city" sortable :label="$t('delivery_ShippCoun')" align="center"></el-table-column>
        <el-table-column prop="shipToPartyName" sortable :label="$t('delivery_typeShip')" align="center"></el-table-column>
        <el-table-column prop="shipToAddress" sortable :label="$t('delivery_ShippAddr')" align="center"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handleDelivery('dialogForm',scope.row)" iconClass="el-icon-edit-outline" :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteShipOrder(scope.row.tpomShipOrderId)" iconClass="el-icon-delete" :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-tabs v-model="activeName" v-if="showDetail">
      <el-tab-pane :label="$t('delivery_ShippOrdeDeta')" name="detail">
         <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" icon="el-icon-edit-outline" :disabled="editDetailDisabled" @click="handleDelivery('detailForm',true)">{{$t('common_Edit')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-plus" @click="handleDelivery('detailForm',false)">{{$t('common_Add')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-delete-solid" :disabled="delDetailDisabled" @click="deleteShipOrderDetail">{{$t('common_Del')}}</el-button>
              </el-col>
              <el-col :span="12">
                <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
                layout="total,sizes,prev,pager,next,jumper,->" :total="total1"
                @current-change="handleCurrentChange1" @size-change="handleSizeChange1"></el-pagination>
              </el-col>
            </el-row>
          </div>
          <div class="mes-table-content">
            <el-table :data="detailData" border highlight-current-row size="mini"  @selection-change="detailChange">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
              <el-table-column prop="materialCode" sortable :label="$t('common_PorN')" align="center"></el-table-column>
              <el-table-column prop="requestQty" sortable :label="$t('delivery_TargeQuan')" align="center"></el-table-column>
              <el-table-column prop="shippedQty" sortable :label="$t('common_QuantComp')" align="center"></el-table-column>
              <el-table-column :label="$t('delivery_ComplStat')" prop="isCompleted" align="center" sortable>
              <template slot-scope="scope">
                <el-tag :type="scope.row.isCompleted === '1'?'':'danger'" size="mini">{{ scope.row.isCompleted === '1'? this.$t('common_Enabl'):this.$t('common_Disab')}}</el-tag>
              </template>
            </el-table-column>
            </el-table>
          </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
      <component v-if="dialogVisible" :is="dialogComponent" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getShipOrder="getShipOrder" @getShipOrderDetail="getShipOrderDetail" :onTPomShipOrderId="onTPomShipOrderId"></component>
    </el-dialog>
</div>
</template>

<script>
import dialogForm from './dialogForm'
import detailForm from './detailForm'
export default {
  data () {
    return {
      tableData: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      keywords: '',
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      activeName: 'detail',
      dialogVisible: false,
      isEdit: false,
      dialogComponent: '',
      selectList: [],
      selectDetailList: [],
      detailData: [],
      onTPomShipOrderId: '',
      showDetail: false
    }
  },
  computed: {
    dialogTitle () {
      let word1 = this.isEdit ? this.$t('common_Edit') : this.$t('common_Add')
      let word2 = this.dialogComponent === 'dialogForm' ? this.$t('delivery_billSale') : this.$t('delivery_ShippOrdeDetaList')
      return `${word1}${word2}`
    },
    editDisabled () {
      let len = this.selectList.length
      return len !== 1
    },
    editDetailDisabled () {
      let len = this.selectDetailList.length
      return len !== 1
    },
    delDetailDisabled () {
      let len = this.selectDetailList.length
      return len === 0
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getShipOrder()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getShipOrder()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
    },
    indexMethod1 (index) {
      let { pageSize, pageIndex } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.tpomShipOrderId)
      })
    },
    detailChange (selection) {
      this.selectDetailList = []
      selection.map(item => {
        this.selectDetailList.push(item.tpomShipOrderItemId)
      })
    },
    cellClick (row, column, cell, event) {
      this.showDetail = true
      this.onTPomShipOrderId = row.tpomShipOrderId
      this.getShipOrderDetail()
    },
    handleDelivery (dialogComponent, row) {
      this.dialogComponent = dialogComponent
      // let selectObj = {}
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        if (dialogComponent === 'dialogForm') {
          // let { selectList, tableData } = this
          // let tpomShipOrderId = selectList[0]
          // selectObj = tableData.filter(item => {
          //   return item.tpomShipOrderId === tpomShipOrderId
          // })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.dialogForm)
            this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.dialogForm.tpomShipOrderId = row.tpomShipOrderId
          })
        } else {
          // let { selectDetailList, detailData } = this
          // let tpomShipOrderItemId = selectDetailList[0]
          // selectObj = detailData.filter(item => {
          //   return item.tpomShipOrderItemId === tpomShipOrderItemId
          // })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.detailForm)
            this.$refs.dialog.detailForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.detailForm.tpomShipOrderItemId = row.tpomShipOrderItemId
            if (this.$refs.dialog.detailForm.isCompleted === '1') {
              this.$refs.dialog.detailForm.isCompleted = true
            } else {
              this.$refs.dialog.detailForm.isCompleted = false
            }
          })
        }
      } else {
        this.isEdit = false
      }
    },
    // 获取出货单
    async getShipOrder () {
      let { keywords, page } = this
      let data = Object.assign({ keywords }, page)
      let res = await this.$api.getShipOrder(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    // 获取出货单详情
    async  getShipOrderDetail () {
      let { page1 } = this
      let tPomShipOrderId = this.onTPomShipOrderId
      let data = Object.assign({ tPomShipOrderId }, page1)
      let res = await this.$api.getShipOrderDetail(data)
      this.detailData = res.data.list
      this.total = res.data.totalNum
    },
    // 删除出货单
    async deleteShipOrder () {
      let confirm = await this.$myPrompt.confirm(this.$t('delivery_AreYouSureSeleInfo'))
      if (confirm) {
        let res = await this.$api.deleteShipOrder(this.selectList)
        this.$myPrompt.handleMsg(res, () => {
          this.getShipOrder()
        })
      }
    },
    // 删除出货单详情
    async deleteShipOrderDetail () {
      let confirm = await this.$myPrompt.confirm(this.$t('delivery_AreYouSureSeleInfo'))
      if (confirm) {
        let res = await this.$api.deleteShipOrderDetail(this.selectDetailList)
        this.$myPrompt.handleMsg(res, () => {
          this.getShipOrderDetail()
        })
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getShipOrder()
  },
  components: {
    dialogForm, detailForm
  }

}
</script>
