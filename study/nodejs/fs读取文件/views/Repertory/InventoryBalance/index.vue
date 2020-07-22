<template>
  <div class="mes-main mes-work-order">
     <h3 class="mes-main-title">库存余量</h3>
     <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <!-- <material-select style="width:40%;" v-model="searchForm.materialNo" @change="getInventoryBalance" ></material-select> -->
        <el-input style="width:40%;" v-model="searchForm.materialNo" placeholder="请输入料号"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getInventoryBalance" style="float:right;margin-left:10px;">查询</el-button>
        <el-input placeholder="仓库" v-model.trim="searchForm.mWmsWarehouseCode" size="mini" style="width:40%;float:right;" @keydown.enter.native="getInventoryBalance"></el-input>
      </el-col>
    </el-row>
    <div class="barcode-table mes-table">
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini">
          <el-table-column label="序号" type="index" :indexMethod="indexMethod"></el-table-column>
          <el-table-column prop="materialNo" label="料号" align="center" sortable></el-table-column>
          <el-table-column prop="materialName" label="物料名称" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsWarehouseBinCode" label="储位" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsWarehouseCode" label="仓库" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsStockQty" label="库存数量" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsAssignQty" label="分配数量" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsStockHoldqty" label="冻结数量" align="center" sortable></el-table-column>
          <el-table-column prop="mWmsStockRestqty" label="可用数量" align="center" sortable></el-table-column>
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
