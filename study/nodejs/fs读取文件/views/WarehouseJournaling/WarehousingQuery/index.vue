<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">入库单查询</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <dict-select style="width:35%;"  v-model="searchForm.mWmsEntrylistStatus" clearable dictType="DOCUMENT_STATUS"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button style="float:right;margin-left:10px" size="mini" @click="showMoreDetail = !showMoreDetail">
          <i class="fa fa-filter" ></i>
        </el-button>
        <el-input placeholder="请输入入库单号" v-model.trim="searchForm.mWmsEntrylistNo" style="float:right;width:40%" @keydown.enter.native="getInboundOrder">
           <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getInboundOrder"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreDetail">
          <el-form-item label="计划开始时间：" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间"  value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="计划结束时间：" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间"  value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button icon="el-icon-search" size="mini" @click="getInboundOrder">查询</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetForm">刷新</el-button>
        </el-col>
        <el-col :span="12">
         <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @cell-click="cellClick">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="mWmsEntrylistNo" sortable label="入库单号" align="center" ></el-table-column>
          <el-table-column prop="mWmsEntrylistRelateno"  sortable label="关联单号" align="center" ></el-table-column>
          <el-table-column prop="mWmsEntrylistRelatenoitem"  sortable label="关联单项次" align="center" ></el-table-column>
          <el-table-column prop="mWmsWarehouseCode"  sortable label="入库库房" align="center" ></el-table-column>
          <el-table-column prop="mWmsEntrylistType"  sortable label="入库方式" align="center" ></el-table-column>
          <el-table-column prop="mWmsEntrylistStatus"  sortable label="单据状态" align="center" ></el-table-column>
          <el-table-column prop="mWmsEntrylistLevel"  sortable label="紧急状态" align="center" ></el-table-column>
          <el-table-column prop="mWmsVendorCode"  sortable label="供应商" align="center" ></el-table-column>
          <el-table-column prop="creator"  sortable label="创建人" align="center" ></el-table-column>
          <el-table-column prop="createdDt"  width="150" sortable label="创建时间" align="center" ></el-table-column>
          <!-- <el-table-column sortable label="修改人" align="center" ></el-table-column>
          <el-table-column sortable label="最后修改时间" align="center" ></el-table-column> -->
        </el-table>
      </div>
      <div class="mes-main-tabs"  v-if="showDetailTable">
        <el-tabs v-model="activeName">
          <el-tab-pane label="入库单明细" name="warehouseWarrant" >
             <el-row class="mes-table-handle">
              <el-col :span="24">
              <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                  @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
            <el-table :data="warrantTable" size="mini" border highlight-current-row @cell-click="cellClick1">
              <el-table-column type="index" label="项次" align="center" :index="indexMethod1"></el-table-column>
              <el-table-column prop="materialNo" sortable label="料号" align="center" ></el-table-column>
              <el-table-column prop="materialName" sortable label="物料名称" align="center" ></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailSourceno" sortable label="来源单号" align="center" ></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailSourceitem" sortable label="来源单项次" align="center" ></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailQty" sortable label="入库数量" align="center" ></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailReceiveno" sortable label="已收数量" align="center" ></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailCheckresult" sortable label="检验结果" align="center" ></el-table-column>
              <el-table-column prop="mWmsEntrylistDetailShelfno" sortable label="上架数量" align="center" ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="mes-main-tabs" v-if="showTabs">
        <el-tabs v-model="activeNameChild">
          <el-tab-pane label="收货记录" name="receive" >
              <el-row class="mes-table-handle">
              <el-col :span="24">
              <el-pagination background :page-size="page2.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total2"
                  @current-change="handleCurrentChange2" @size-change="handleSizeChange2">
                </el-pagination>
              </el-col>
            </el-row>
             <el-table :data="receiveData" size="mini" border highlight-current-row>
              <el-table-column type="index" label="序号" align="center" :index="indexMethod2"></el-table-column>
              <el-table-column prop="mwmsPkgidPkgid" sortable label="PKGID" align="center" ></el-table-column>
              <el-table-column prop="mwmsPkgidDatecode" sortable label="DateCode" align="center" ></el-table-column>
              <el-table-column prop="mwmsPkgidLot" sortable label="生产批次" align="center" ></el-table-column>
              <el-table-column prop="mwmsReceivehistoryReceiveqty" sortable label="收货数量" align="center" ></el-table-column>
              <el-table-column prop="creator" sortable label="操作人" align="center" ></el-table-column>
              <el-table-column prop="createdDt" sortable label="操作时间" align="center" :formatter="formatterDate"></el-table-column>
             </el-table>
          </el-tab-pane>
          <el-tab-pane label="上架记录" name="grounding">
            <el-row class="mes-table-handle">
              <el-col :span="24">
              <el-pagination background :page-size="page3.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total2"
                  @current-change="handleCurrentChange3" @size-change="handleSizeChange3">
                </el-pagination>
              </el-col>
            </el-row>
            <el-table :data="groundingData" size="mini" border highlight-current-row>
              <el-table-column type="index" label="序号" align="center" :index="indexMethod3"></el-table-column>
              <el-table-column prop="mwmsPkgidPkgid" sortable label="PKGID" align="center" ></el-table-column>
              <el-table-column prop="mwmsPkgidDatecode" sortable label="DateCode" align="center" ></el-table-column>
              <el-table-column prop="mwmsPkgidLot" sortable label="生产批次" align="center" ></el-table-column>
              <!-- <el-table-column prop="" sortable label="储位" align="center" ></el-table-column> -->
              <el-table-column prop="mwmsShelfhistoryShelfqty" sortable label="上架数量" align="center" ></el-table-column>
               <el-table-column prop="mwmsWarehouseBinCode" sortable label="实际储位" align="center" ></el-table-column>
              <el-table-column prop="creator" sortable label="操作人" align="center" ></el-table-column>
              <el-table-column prop="createdDt" sortable label="操作时间" align="center" ></el-table-column>
             </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>

</template>

<script>
import paging from '@/mixins/paging'
export default {
  mixins: [paging],
  data () {
    return {
      searchForm: {
        startTime: '',
        endTime: '',
        mWmsEntrylistStatus: '',
        mWmsEntrylistNo: ''
      },
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
      page2: {
        pageSize: 10,
        pageIndex: 1
      },
      total2: 0,
      page3: {
        pageSize: 10,
        pageIndex: 1
      },
      total3: 0,
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
      showMoreDetail: false,
      tableData: [],
      warrantTable: [],
      receiveData: [],
      groundingData: [],
      activeName: 'warehouseWarrant',
      activeNameChild: 'receive',
      mWmsEntrylistDetailEntrylistid: '',
      mWmsEntrylistDetailId: '',
      showDetailTable: false,
      showTabs: false
    }
  },
  methods: {
    // 1代表的是详情的   2代表的是收货的  3代表的是上架的
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getInboundOrder()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getInboundOrder()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
      this.getInboundOrderDetail()
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
      this.getInboundOrderDetail()
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange2 (index) {
      this.page2.pageIndex = index
      this.getReceivehistory()
    },
    handleSizeChange2 (size) {
      this.page2.pageSize = size
      this.getReceivehistory()
    },
    indexMethod2 (index) {
      let { pageIndex, pageSize } = this.page2
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange3 (index) {
      this.page3.pageIndex = index
      this.getShelfhistory()
    },
    handleSizeChange3 (size) {
      this.page3.pageSize = size
      this.getShelfhistory()
    },
    indexMethod3 (index) {
      let { pageIndex, pageSize } = this.page3
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatterDate (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    async getInboundOrder () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getInboundOrder(data)
      this.$myPrompt.handleMsg(res, (data) => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.getInboundOrder()
    },
    // 点击入库单获取入库单明细
    cellClick (row, column, cell, event) {
      this.showDetailTable = true
      this.mWmsEntrylistDetailEntrylistid = row.mWmsEntrylistId
      this.getInboundOrderDetail()
      this.groundingData = []
      this.receiveData = []
    },
    async getInboundOrderDetail () {
      const { page1, mWmsEntrylistDetailEntrylistid } = this
      const params = Object.assign(page1, { mWmsEntrylistDetailEntrylistid })
      const res = await this.$api.getInboundOrderDetail(params)
      this.$myPrompt.handleMsg(res, (data) => {
        this.warrantTable = data.list
        this.total1 = data.totalNum
      }, false)
    },
    cellClick1 (row, column, cell, event) {
      this.showTabs = true
      this.mWmsEntrylistDetailId = row.mWmsEntrylistDetailId
      this.getReceivehistory()
      this.getShelfhistory()
    },
    // 获取收货的
    async getReceivehistory () {
      let { mWmsEntrylistDetailId, page2 } = this
      let data = Object.assign(page2, { mWmsEntrylistDetailId })
      let res = await this.$api.getReceivehistory(data)
      this.$myPrompt.handleMsg(res, (data) => {
        this.receiveData = data.list
        this.total2 = data.totalNum
      }, false)
    },
    // 获取上架的
    async getShelfhistory () {
      let { mWmsEntrylistDetailId, page3 } = this
      let data = Object.assign(page3, { mWmsEntrylistDetailId })
      let res = await this.$api.getShelfhistory(data)
      this.$myPrompt.handleMsg(res, (data) => {
        this.groundingData = data.list
        this.total3 = data.totalNum
      }, false)
    }

  },
  created () {
    this.getInboundOrder()
  }
}
</script>
