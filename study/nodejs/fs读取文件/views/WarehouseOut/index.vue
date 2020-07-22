<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">出库管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select style="width:35%" size="mini" v-mode="searchForm.mWmsDeliveryStatus" clearable filterable placeholder="单据状态"></el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入出库单单号" v-model.trim="searchForm.mWmsDeliveryNo" size="mini" style="width:40%;float:right">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
       <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="开始时间：" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startDt" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endDt" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" >编辑</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" >新增</el-button>
            <span class="split-line">|</span>
            <el-button size="mini">删除</el-button>
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
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column sortable prop="mWmsDeliveryNo" label="出库单号" align="center"></el-table-column>
        <el-table-column sortable prop="mWmsDeliveryRelateno" label="关联单号" align="center"></el-table-column>
        <el-table-column sortable label="关联单项次" prop="mWmsDeliveryRelatenoitem" align="center"></el-table-column>
        <el-table-column sortable label="出库库房" prop="mWmsDeliveryWarehouseid" align="center"></el-table-column>
        <el-table-column sortable label="出库方式"  prop="mWmsDeliveryType" align="center"></el-table-column>
        <el-table-column sortable label="单据状态"  prop="mWmsDeliveryStatus" align="center"></el-table-column>
        <el-table-column sortable label="紧急状态"  prop="mWmsDeliveryLevel" align="center"></el-table-column>
        <el-table-column sortable label="客户"  prop="mWmsDeliveryVenderid" align="center"></el-table-column>
        <el-table-column sortable label="创建人"  prop="creator" align="center"></el-table-column>
        <el-table-column sortable label="修改人"  prop="lastEditor" align="center"></el-table-column>
        <el-table-column sortable label="最后修改时间" align="lastEditedDt"></el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单明细" name="detail">
          <el-table :data="detailList" border highlight-current-row size="mini">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column sortable label="料号" align="center"></el-table-column>
            <el-table-column sortable label="物料名称" align="center"></el-table-column>
            <el-table-column sortable label="来源单号" align="center"></el-table-column>
            <el-table-column sortable label="来源单项次" align="center"></el-table-column>
            <el-table-column sortable label="出库数量" align="center"></el-table-column>
            <el-table-column sortable label="储位" align="center"></el-table-column>
            <el-table-column sortable label="已下架数量" align="center"></el-table-column>
            <el-table-column sortable label="检验结果" align="center"></el-table-column>
            <el-table-column sortable label="以出货数量" align="center"></el-table-column>
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
