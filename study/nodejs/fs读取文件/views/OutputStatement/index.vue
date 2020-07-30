<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('outputSta_OutpuRepo')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
       <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="margin-left:10px;float:right" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
         <el-input :placeholder="$t('common_PleasInpuWorkOr')"  v-model.trim="searchForm.docNo" size="mini" style="width:40%;float:right" @keydown.enter.native="getproduceReportList">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getproduceReportList"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="120px" label-position="left" v-if="showMoreConditon">
            <el-form-item :label="$t('outputSta_ItemNo')" class="el-col el-col-11">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
       <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="getproduceReportList">{{$t('common_Inquire')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="officeName" sortable :label="$t('common_Factory')" align="center"></el-table-column>
          <el-table-column prop="docNo" sortable :label="$t('common_WorkOrdeNo')" align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('outputSta_WorkOrdeItemNo')" align="center"></el-table-column>
          <el-table-column prop="requestQty" sortable :label="$t('outputSta_WorkOrdeDemaQuan')"  align="center"></el-table-column>
          <el-table-column prop="checkQty" sortable :label="$t('common_QuantComp')" align="center"></el-table-column>
          <el-table-column prop="successQty" sortable :label="$t('outputSta_QualiQuan')" align="center"></el-table-column>
          <el-table-column prop="failQty" sortable :label="$t('outputSta_ScrapQuan')"  align="center"></el-table-column>
          <el-table-column prop="schStartDt" sortable :label="$t('common_PlannStarTime')" align="center" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="schClosedDt" sortable :label="$t('common_PlannEndTime')"  align="center" :formatter="dateFormatter"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      searchForm: {
        officeCode: '',
        docNo: '',
        materialNo: '',
        queryLevel: 1
      },
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: []
    }
  },
  computed: {
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (size) {
      this.page.pageSize = size
      this.getproduceReportList()
    },
    handleSizeChange (index) {
      this.page.pageIndex = index
      this.getproduceReportList()
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    async getproduceReportList () {
      let { searchForm, page } = this
      const data = Object.assign(searchForm, page)
      let res = await this.$api.getproduceReportList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    }
  },
  created () {
    this.getproduceReportList()
  }

}
</script>
