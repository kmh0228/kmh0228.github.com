<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">出库管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <dict-select style="width:40%" v-model="searchForm.mWmsDeliveryStatus" dictType="DOCUMENT_STATUS" selectKey="dictCode" :clearable="true"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入出库单单号" v-model.trim="searchForm.mWmsDeliveryNo" size="mini" style="width:40%;float:right" @keydown.native.enter="getOutboundOrder">
        </el-input>
      </el-col>
       <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="开始时间：" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getOutboundOrder">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="hanldeOutOrder('dialogForm','')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteOutboundOrder('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshData">刷新</el-button>
      </el-col>
      <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableChange"  @cell-click="cellClick">
        <el-table-column type="selection" width="50" align="center" :selectable="disabledSelect" ></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column sortable prop="mWmsDeliveryNo" label="出库单号" align="center" min-width="120"></el-table-column>
        <el-table-column sortable prop="" label="关联单号" align="center" min-width="120"></el-table-column>
        <el-table-column sortable label="关联单项次" prop="" align="center" min-width="120"></el-table-column>
        <el-table-column sortable label="出库库房" prop="mWmsWarehouseCode" align="center" min-width="120"></el-table-column>
        <el-table-column sortable label="出库方式"  prop="mWmsDeliveryType" align="center" min-width="120"></el-table-column>
        <el-table-column sortable label="单据状态"  prop="mWmsDeliveryStatus" align="center" min-width="120"></el-table-column>
        <el-table-column sortable label="紧急状态"  prop="mWmsDeliveryLevel" align="center" min-width="120"></el-table-column>
        <el-table-column sortable label="客户"  prop="mWmsCustomerName" align="center"></el-table-column>
        <el-table-column sortable label="创建人"  prop="creator" align="center" min-width="120"></el-table-column>
        <!-- <el-table-column sortable label="修改人"  prop="lastEditor" align="center"></el-table-column>
        <el-table-column sortable label="最后修改时间" align="lastEditedDt"></el-table-column> -->
        <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <handle-button iconClass='el-icon-edit-outline' tipText="编辑" @click="hanldeOutOrder('dialogForm',scope.row)"></handle-button>
              <handle-button iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c' @click="deleteOutboundOrder(scope.row.mWmsDeliveryId)"></handle-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </div>
   <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName">
        <el-tab-pane label="出库单明细" name="detail">
           <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" icon="el-icon-plus" :disabled="addDetailDisabled" @click="hanldeOutOrder('outOrderDetail','')">新增</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-delete-solid" :disabled="deleteDetailDisabled" @click="deleteDetail('')">批量删除</el-button>
              </el-col>
              <el-col :span="12">
                <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total1" :current-page="page1.pageIndex"
                  @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
            <el-table :data="detailData" border highlight-current-row size="mini" @selection-change="tableChange1">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="materialNo" sortable label="料号" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable label="物料名称" align="center" min-width="120"></el-table-column>
              <el-table-column sortable label="来源单号" align="center" min-width="120"></el-table-column>
              <el-table-column sortable label="来源单项次" align="center" min-width="120"></el-table-column>
              <el-table-column prop="mWmsDeliveryDetailQty" sortable label="出库数量" align="center" min-width="120"></el-table-column>
              <el-table-column prop="mWmsWarehouseBinCode" sortable label="储位" align="center"></el-table-column>
              <el-table-column prop="mWmsDeliveryDetailUnshelfno" sortable label="已下架数量" align="center" min-width="120"></el-table-column>
              <el-table-column sortable label="检验结果" align="center" min-width="120"></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailOutno" sortable label="已出货数量" align="center" min-width="120"></el-table-column>
              <el-table-column label="操作" width="120" align="center" fixed="right">
                  <template slot-scope="scope">
                    <handle-button iconClass='el-icon-edit-outline' tipText="编辑" @click="hanldeOutOrder('outOrderDetail',scope.row)"></handle-button>
                    <handle-button iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c' @click="deleteDetail(scope.row.mWmsDeliveryDetailId)"></handle-button>
                  </template>
                </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px">
      <component v-if="dialogVisible" :is="dialogComponent" ref="dialog" @cannel="cannel" :isEdit="isEdit" :mWmsDeliveryId="mWmsDeliveryId" @getOutboundOrder="getOutboundOrder" @getOutboundOrderDetail="getOutboundOrderDetail" :mWmsMaterialbinId="mWmsMaterialbinId"  @cellClick="cellClick"></component>
    </el-dialog>
  </div>

</template>

<script>
import dialogForm from './dialogForm'
import outOrderDetail from './outOrderDetailDialog'
export default {
  // 0 是出库单  1是出库单明细的
  data () {
    return {
      searchForm: {
        mWmsDeliveryStatus: '',
        mWmsDeliveryNo: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      tableData: [],
      showTas: false,
      activeName: 'detail',
      detailData: [],
      dialogVisible: false,
      dialogComponent: '',
      isEdit: false,
      selectList: [],
      selectList1: [],
      mWmsDeliveryId: '',
      cannelOperation: false,
      mWmsMaterialbinId: ''

    }
  },
  computed: {
    dialogTitle () {
      let data1 = this.isEdit ? '编辑' : '新增'
      let data2 = this.dialogComponent === 'dialogForm' ? '出库单' : '出库单明细'
      return `${data1}${data2}`
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
      this.getOutboundOrder()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getOutboundOrder()
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
      this.getOutboundOrderDetail()
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
      this.getOutboundOrderDetail()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    disabledSelect (row, index) {
      if (row.mWmsDeliveryStatus === '开立') {
        return true
      } else {
        return false
      }
    },
    tableChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mWmsDeliveryId)
      })
    },
    tableChange1 (selection) {
      this.selectList1 = []
      selection.map(item => {
        this.selectList1.push(item.mWmsDeliveryDetailId)
      })
    },
    hanldeOutOrder (dialogName, row) {
      this.dialogComponent = dialogName
      if (row) {
        this.isEdit = true
        if (dialogName === 'dialogForm') {
          if (row.mWmsDeliveryStatus !== '开立') {
            this.$message.warning(`非开立状态系不允许任何操作！`)
          } else {
            this.dialogVisible = true
            this.$nextTick(() => {
              let keys = Object.keys(this.$refs.dialog.dialogForm)
              this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
              this.$refs.dialog.dialogForm.mWmsDeliveryId = row.mWmsDeliveryId
            })
          }
        } else {
          this.dialogVisible = true
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.detailForm)
            this.$refs.dialog.detailForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.detailForm.mWmsDeliveryDetailId = row.mWmsDeliveryDetailId
          })
        }
      } else {
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    cellClick (row, column, cell, event) {
      this.mWmsMaterialbinId = row.mWmsDeliveryWharehouseid || ''
      this.mWmsDeliveryId = row.mWmsDeliveryId || ''
      this.getOutboundOrderDetail()
      this.showTas = true
      if (row.mWmsDeliveryStatus !== '开立') {
        this.cannelOperation = true
      } else {
        this.cannelOperation = false
      }
    },
    // 获取出库单
    async getOutboundOrder () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getOutboundOrder(data)
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
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getOutboundOrder()
    },
    // 获取出库单详情
    async getOutboundOrderDetail () {
      let { mWmsDeliveryId, page1 } = this
      let mWmsDeliveryDetailDeliveryid = mWmsDeliveryId
      let data = Object.assign({ mWmsDeliveryDetailDeliveryid }, page1)
      let res = await this.$api.getOutboundOrderDetail(data)
      this.detailData = res.data.list
      this.total1 = res.data.totalNum
    },
    // 删除出库单
    async deleteOutboundOrder (id) {
      let ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        let confrim = await this.$myPrompt.confirm('确定删除所选择的出库单信息吗！')
        if (confrim) {
          let res = await this.$api.deleteOut(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getOutboundOrder()
            this.detailData = []
            this.showTas = false
          })
        }
      } else {
        this.$message.warning('请选择要删除的出库单信息')
      }
    },
    // 删除出库单详情
    async deleteDetail (id) {
      let ids = id ? [id] : this.selectList1
      const len = ids.length
      if (len > 0) {
        let confrim = await this.$myPrompt.confirm('确定删除所选择的出库单详情信息吗！')
        if (confrim) {
          let res = await this.$api.deleteOutDetail(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getOutboundOrderDetail()
          })
        }
      } else {
        this.$message.warning('请选择要删除的出库单详细信息')
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm, outOrderDetail
  },
  created () {
    this.getOutboundOrder()
    this.getOutboundOrderDetail('id')
  }

}
</script>
