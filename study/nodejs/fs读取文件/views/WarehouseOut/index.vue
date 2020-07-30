<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('OutboundOrder_WarehouseManagement')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select style="width:35%" size="mini" v-mode="searchForm.mWmsDeliveryStatus" clearable filterable :placeholder="$t('OutboundOrder_DocumentStatus')"></el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('OutboundOrder_PleaseInputTheDelivery')" v-model.trim="searchForm.mWmsDeliveryNo" size="mini" style="width:40%;float:right">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
       <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_startTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startDt" style="width:100%" size="mini" type="datetime" :placeholder="$t('OutboundOrder_SelectDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common_dTime')" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endDt" style="width:100%" size="mini" type="datetime" :placeholder="$t('OutboundOrder_SelectDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" >{{$t('common_Edit')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" >{{$t('common_Add')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini">{{$t('common_Del')}}</el-button>
        </el-col>
        <el-col :span="12">
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
              @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
          </el-col>
      </el-row>
    </div>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column sortable prop="mWmsDeliveryNo" :label="$t('OutboundOrder_DeliveryOrderNo')" align="center"></el-table-column>
        <el-table-column sortable prop="mWmsDeliveryRelateno" :label="$t('OutboundOrder_AssociatedOrderNo')" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_AssociatedSingleItem')" prop="mWmsDeliveryRelatenoitem" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_WarehouseOut')" prop="mWmsDeliveryWarehouseid" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_DeliveryMode')"  prop="mWmsDeliveryType" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_DocumentStatus')"  prop="mWmsDeliveryStatus" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_StateOfEmergency')"  prop="mWmsDeliveryLevel" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_Customer')"  prop="mWmsDeliveryVenderid" align="center"></el-table-column>
        <el-table-column sortable :label="$t('common_Creator')"  prop="creator" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_ModifiedBy')"  prop="lastEditor" align="center"></el-table-column>
        <el-table-column sortable :label="$t('OutboundOrder_LastModificationTime')" align="lastEditedDt"></el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('OutboundOrder_WarehouseEntryDetails')" name="detail">
          <el-table :data="detailList" border highlight-current-row size="mini">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_PN')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_MaterialName')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_SourceNo')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_SourceItem')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_DeliveryQuantity')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_StorageLocation')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_OffShelfQuantity')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_TestResults')" align="center"></el-table-column>
            <el-table-column sortable :label="$t('OutboundOrder_ByShipmentQuantity')" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        mWmsDeliveryStatus: '',
        mWmsDeliveryNo: '',
        startDt: '',
        endDt: ''
      },
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      showTabs: true,
      showTas: true,
      activeName: 'detail'

    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    }
  }

}
</script>
