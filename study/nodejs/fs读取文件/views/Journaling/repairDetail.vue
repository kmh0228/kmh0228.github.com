<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">维修详情查询</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="请输入零件SN" v-model.trim="searchFrom.sn" size="mini" style="width:40%;" @keydown.enter.native="getRepairDetailReport">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getRepairDetailReport"></i>
        </el-input>
        <el-button size="mini" icon="el-icon-back" style="margin-left:10px;"  @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
    <el-form class="el-row mes-main-filte " :model="repairForm" label-width="30%" label-position="left" >
      <el-form-item label="SN：" class="el-col el-col-11">
        <p>{{ repairForm.sn }}</p>
      </el-form-item>
      <el-form-item label="工单号：" class="el-col el-col-11 el-col-offset-1">
        <p>{{ repairForm.jobOrder }}</p>
      </el-form-item>
        <el-form-item label="料号：" class="el-col el-col-11">
        <p>{{ repairForm.materialNo }}</p>
      </el-form-item>
      <el-form-item label="送修工站：" class="el-col el-col-11 el-col-offset-1">
        <p>{{ repairForm.repairStation }}</p>
      </el-form-item>
        <el-form-item label="原因代码：" class="el-col el-col-11">
        <p>{{ repairForm.defectCode }}</p>
      </el-form-item>
      <el-form-item label="维修工站：" class="el-col el-col-11 el-col-offset-1">
        <p>{{ repairForm.repairStation }}</p>
      </el-form-item>
        <el-form-item label="维修结果：" class="el-col el-col-11">
        <p>{{ repairForm.result }}</p>
      </el-form-item>
      <el-form-item label="维修人：" class="el-col el-col-11 el-col-offset-1">
        <p>{{ repairForm.creator }}</p>
      </el-form-item>
        <el-form-item label="送修时间：" class="el-col el-col-11">
        <p>{{ repairForm.fromTime }}</p>
      </el-form-item>
      <el-form-item label="维修完成时间：" class="el-col el-col-11 el-col-offset-1">
        <p>{{ repairForm.finishTime }}</p>
      </el-form-item>
    </el-form>
    <div class="mes-table">
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="materialNo" sortable label="零件料号" align="center"></el-table-column>
          <el-table-column prop="oldSn" sortable label="旧零件SN" align="center"></el-table-column>
          <el-table-column prop="newSn" sortable label="新零件SN" align="center"></el-table-column>
          <el-table-column prop="action" sortable label="维修动作" align="center"></el-table-column>
          <el-table-column prop="defectCode" sortable label="原因代码" align="center"></el-table-column>
          <el-table-column prop="remark" sortable label="备注" align="center"></el-table-column>
          <el-table-column prop="creator" sortable label="维修人" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable label="维修时间" align="center"></el-table-column>
        </el-table>
        <el-row style="text-align:center;margin-top:1vh;">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      repairForm: {},
      searchFrom: {
        sn: '',
        keywords: ''
      },
      productSn: '',
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
      this.getRepairDetailReport()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getRepairDetailReport()
    },
    // 获取维修详情
    async getRepairDetailReport () {
      let data = Object.assign(this.searchFrom, this.page)
      let res = await this.$api.getRepairDetailReport(data)
      this.tableData = res.data.list
      this.total = this.totalNum
    },
    // 获取维修记录
    async getRepairRecordReport () {
      let data = Object.assign(this.searchFrom, this.page)
      let res = await this.$api.getRepairRecordReport(data)
      this.repairForm = res.data.list[0]
    }
  },
  created () {
    if (this.$route.query.sn) {
      this.searchFrom.sn = this.$route.query.sn
      this.getRepairDetailReport()
      this.getRepairRecordReport()
    }
  }
}
</script>
