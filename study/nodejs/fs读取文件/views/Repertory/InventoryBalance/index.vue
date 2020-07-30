<template>
  <div class="mes-main mes-work-order">
     <h3 class="mes-main-title">{{$t('InventoryBalance_InventoryBalance')}}</h3>
     <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <!-- <material-select style="width:40%;" v-model="searchForm.materialNo" @change="getInventoryBalance" ></material-select> -->
        <el-input style="width:40%;" v-model="searchForm.materialNo" :placeholder="$t('InventoryBalance_PleaseEnterTheItemNumber')"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getInventoryBalance" style="float:right;margin-left:10px;">{{$t('common_Inquire')}}</el-button>
        <el-input :placeholder="$t('InventoryBalance_Warehouse')" v-model.trim="searchForm.mWmsWarehouseCode" size="mini" style="width:40%;float:right;" @keydown.enter.native="getInventoryBalance"></el-input>
      </el-col>
    </el-row>
    <div class="barcode-table mes-table">
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini">
          <el-table-column :label="$t('common_Number')" type="index" :indexMethod="indexMethod"></el-table-column>
          <el-table-column prop="materialNo" :label="$t('InventoryBalance_PN')" align="center" sortable></el-table-column>
          <el-table-column prop="materialName" :label="$t('InventoryBalance_MaterialName')" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsWarehouseBinCode" :label="$t('InventoryBalance_StorageLocation')" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsWarehouseCode" :label="$t('InventoryBalance_Warehouse')" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsStockQty" :label="$t('InventoryBalance_InventoryQuantity')" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsAssignQty" :label="$t('InventoryBalance_AllocatedQuantity')" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsStockHoldqty" :label="$t('InventoryBalance_FrozenQuantity')" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsStockRestqty" :label="$t('InventoryBalance_AvailableQuantity')" align="center" sortable></el-table-column>
        </el-table>
      </div>
      <el-row style="text-align:center;padding:1vh 0;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageIndex"
        :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="total" background>
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
export default {
  data () {
    return {
      searchForm: {
        materialNo: '',
        mWmsWarehouseCode: ''
      },
      total: 0,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      tableData: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getInventoryBalance()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getInventoryBalance()
    },
    async getInventoryBalance () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getStockRemainingByWarehouse(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    }
  },
  created () {
    this.getInventoryBalance()
  },
  components: {
    materialSelect
  }
}
</script>
