<template>
<div class="mes-main mes-work-order ">
  <h3 class="mes-main-title">出库单查询</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <!-- <el-select style="width:35%;" size="mini" v-model="searchForm.mWmsDeliveryStatus" clearable placeholder="请选择单号类型">
        <el-option >开立</el-option>
        <el-option >处理中</el-option>
      </el-select> -->
      <dict-select style="width:35%;"  v-model="searchForm.mWmsDeliveryStatus" clearable dictType="DOCUMENT_STATUS"></dict-select>
    </el-col>
    <el-col :span="12">
      <el-button style="float:right;margin-left:10px" size="mini" @click="showMore = !showMore">
        <i class="fa fa-filter"></i>
      </el-button>
      <el-input placeholder="请输入出库单单号" v-model="searchForm.mWmsDeliveryNo" style="float:right;width:40%" @keydown.native.enter="getOutboundOrder">
        <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getOutboundOrder"></i> -->
      </el-input>
    </el-col>
    <el-col :span="24" style="padding-top:1vh">
      <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMore">
        <el-form-item label="计划开始时间: " class="el-col el-col-11" >
          <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间"  value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="计划结束时间: " class="el-col el-col-11 el-col-offset-1" >
          <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间"  value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
         <el-button icon="el-icon-search" size="mini" @click="getOutboundOrder">查询</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" @click="resetForm" size="mini">刷新</el-button>
      </el-col>
      <el-col :span="12">
         <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content" >
      <el-table :data="tableData" size="mini" border highlight-current-row @cell-click="cellClick">
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="mWmsDeliveryNo" sortable align="center" label="出库单号"></el-table-column>
        <el-table-column prop="mWmsDeliveryRelateno" sortable align="center" label="关联单号"></el-table-column>
        <el-table-column prop="mWmsDeliveryRelatenoitem" sortable align="center" label="关联单项次"></el-table-column>
        <el-table-column prop="mWmsWarehouseCode" sortable align="center" label="出库库房"></el-table-column>
        <el-table-column prop="mWmsDeliveryType" sortable align="center" label="出库方式"></el-table-column>
        <el-table-column prop="mWmsDeliveryStatus" sortable align="center" label="单据状态"></el-table-column>
        <el-table-column prop="mWmsDeliveryLevel" sortable align="center" label="紧急程度"></el-table-column>
        <el-table-column prop="mWmsCustomerCode" sortable align="center" label="客户"></el-table-column>
        <el-table-column prop="creator" sortable align="center" label="创建人"></el-table-column>
        <!-- <el-table-column sortable align="center" label="修改人"></el-table-column>
        <el-table-column sortable align="center" label="最后修改时间"></el-table-column> -->
      </el-table>
    </div>
    <div class="mes-main-tabs" v-if="outBorderDetail">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="出库单明细" name="warehouseOut">
           <el-row class="mes-table-handle">
            <el-col :span="24">
              <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                  @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                </el-pagination>
            </el-col>
        </el-row>
          <el-table :data="warehouseOutTable" size="mini" border highlight-current-row  @cell-click="cellClickDetail">
            <el-table-column type="index" label="序号" align="center" sortable :index="indexMethod1"></el-table-column>
            <el-table-column prop="materialNo" label="料号" align="center" sortable></el-table-column>
            <el-table-column prop="materialName" label="物料名称" align="center" sortable></el-table-column>
            <el-table-column prop="mWmsDeliveryDetailSourceno" label="来源单号" align="center" sortable></el-table-column>
            <el-table-column prop="mWmsDeliveryDetailSourceitem" label="来源单项次" align="center" sortable></el-table-column>
            <el-table-column prop="mWmsDeliveryDetailQty" label="出库数量" align="center" sortable></el-table-column>
            <el-table-column prop="mWmsDeliveryDetailUnshelfno" label="下架数量" align="center" sortable></el-table-column>
            <el-table-column prop="mWmsWarehouseBinCode" sortable label="储位" align="center"></el-table-column>
            <el-table-column prop="mWmsDeliveryDetailCheckresult" label="检验结果" align="center" sortable></el-table-column>
            <el-table-column prop="mWmsEntrylistDetailOutno" label="已出库数量" align="center" sortable></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="mes-main-tabs" v-if="showTabs">
      <el-tabs v-model="activeNameChild">
        <el-tab-pane label="下架记录" name="undercarriage">
           <el-row class="mes-table-handle">
            <el-col :span="24">
              <el-pagination background :page-size="page2.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total2"
                  @current-change="handleCurrentChange2" @size-change="handleSizeChange2">
                </el-pagination>
            </el-col>
        </el-row>
          <el-table :data="undercarriageTable" size="mini" border highlight-current-row>
            <el-table-column type="index" label="序号" align="center" :index="indexMethod2"></el-table-column>
              <el-table-column prop="mWmsPkgidPkgid" sortable label="PKGID" align="center" ></el-table-column>
              <el-table-column prop="mWmsPkgidDatecode" sortable label="DateCode" align="center" ></el-table-column>
              <el-table-column prop="mWmsPkgidLot" sortable label="生产批次" align="center" ></el-table-column>
              <el-table-column prop="mWmsWarehouseBinCode" label="实际储位" align="center" sortable></el-table-column>
              <el-table-column prop="mWmsUnshelfHistoryUnshelfqty" sortable label="下架数量" align="center" ></el-table-column>
              <el-table-column prop="creator" sortable label="操作人" align="center" ></el-table-column>
              <el-table-column prop="createdDt" sortable label="操作时间" align="center" ></el-table-column>
          </el-table>
        </el-tab-pane>
         <el-tab-pane label="出货记录" name="godown">
           <el-row class="mes-table-handle">
            <el-col :span="24">
              <el-pagination background :page-size="page3.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                  layout="total, sizes, prev, pager, next, jumper, ->" :total="total3"
                  @current-change="handleCurrentChange3" @size-change="handleSizeChange3">
                </el-pagination>
            </el-col>
          </el-row>
          <el-table :data="unloadTable" size="mini" border highlight-current-row>
            <el-table-column type="index" label="序号" align="center" :index="indexMethod3"></el-table-column>
              <el-table-column prop="mWmsPkgidPkgid" sortable label="PKGID" align="center" ></el-table-column>
              <el-table-column prop="mWmsPkgidDatecode" sortable label="DateCode" align="center" ></el-table-column>
              <el-table-column prop="mWmsPkgidLot" sortable label="生产批次" align="center" ></el-table-column>
              <el-table-column prop="mWmsOuthistoryOutqty" sortable label="出货数量" align="center" ></el-table-column>
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
      showMore: false,
      searchForm: {
        startTime: '',
        endTime: '',
        mWmsDeliveryStatus: '',
        mWmsDeliveryNo: ''
      },
      // 0是出库单  1是出库单详情  2是下架  3是出货
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
      tableData: [],
      warehouseOutTable: [],
      undercarriageTable: [],
      unloadTable: [],
      activeName: 'warehouseOut',
      activeNameChild: 'undercarriage',
      outBorderDetail: false,
      showTabs: '',
      mWmsDeliveryDetailDeliveryid: '',
      mWmsDeliveryDetailId: ''

    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getOutboundOrder()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getOutboundOrder()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
      this.getOutboundOrderDetail()
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
      this.getOutboundOrderDetail()
    },
    indexMethod1 (index) {
      let { pageSize, pageIndex } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange2 (index) {
      this.page2.pageIndex = index
      this.getUnShelfStatistics()
    },
    handleSizeChange2 (size) {
      this.page2.pageSize = size
      this.getUnShelfStatistics()
    },
    indexMethod2 (index) {
      let { pageSize, pageIndex } = this.page2
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange3 (index) {
      this.page3.pageIndex = index
      this.getDeliveryStatistics()
    },
    handleSizeChange3 (size) {
      this.page3.pageSize = size
      this.getDeliveryStatistics()
    },
    indexMethod3 (index) {
      let { pageSize, pageIndex } = this.page3
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取出库单
    async getOutboundOrder () {
      let data = Object.assign(this.page, this.searchForm)
      let res = await this.$api.getOutboundOrder(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.getOutboundOrder()
    },
    cellClick (row, column, cell, event) {
      this.outBorderDetail = true
      this.mWmsDeliveryDetailDeliveryid = row.mWmsDeliveryId
      this.getOutboundOrderDetail()
      this.undercarriageTable = []
      this.unloadTable = []
    },
    // 根据出库单获取详情
    async getOutboundOrderDetail () {
      let { page1, mWmsDeliveryDetailDeliveryid } = this
      let data = Object.assign(page1, { mWmsDeliveryDetailDeliveryid })
      let res = await this.$api.getOutboundOrderDetail(data)
      this.warehouseOutTable = res.data.list
      this.total1 = res.data.totalNum
    },
    cellClickDetail (row, column, cell, event) {
      this.showTabs = true
      this.mWmsDeliveryDetailId = row.mWmsDeliveryDetailId
      this.getUnShelfStatistics()
      this.getDeliveryStatistics()
    },
    // 根据详情获取下架记录
    async getUnShelfStatistics () {
      let { mWmsDeliveryDetailId, page2 } = this
      let data = Object.assign({ mWmsDeliveryDetailId }, page2)
      let res = await this.$api.unShelfStatistics(data)
      this.undercarriageTable = res.data.list
      this.total2 = res.data.totalNum
    },
    // 根据详情获取出货记录
    async getDeliveryStatistics () {
      let { mWmsDeliveryDetailId, page3 } = this
      let data = Object.assign({ mWmsDeliveryDetailId }, page3)
      let res = await this.$api.deliveryStatistics(data)
      this.unloadTable = res.data.list
      this.total3 = res.data.totalNum
    }

  },
  created () {
    this.getOutboundOrder()
  }
}
</script>
