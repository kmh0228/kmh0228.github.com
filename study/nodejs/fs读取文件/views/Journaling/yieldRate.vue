<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">Yield Rate报表查询</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="工站名称" v-model.trim="searchForm.lineStationName" size="mini" style="width:40%;">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入工单号" v-model.trim="searchForm.docNo" size="mini" style="width:40%;float:right;">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="线别：" class="el-col el-col-12">
            <el-input size="mini" v-model="searchForm.lineName"></el-input>
          </el-form-item>
          <el-form-item label="料号：" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
          <el-form-item label="时间：" class="el-col el-col-12">
            <el-radio-group v-model="dateType" class="date-type-radio" size="mini">
              <el-radio label="1" border>天</el-radio>
              <el-radio label="2" border>周</el-radio>
              <el-radio label="3" border>月</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="initData">查询</el-button>
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
        <el-table :data="tableData" border size="mini">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="fromDt" sortable label="开始时间" show-overflow-tooltip align="center" width="140"></el-table-column>
          <el-table-column prop="toDt" sortable label="结束时间" show-overflow-tooltip align="center" width="140"></el-table-column>
          <el-table-column prop="docNo" sortable label="工单号" label-class-name="mes-table-label" class-name="mes-table-click" align="center" width="150"></el-table-column>
          <el-table-column prop="materialNo" sortable label="料号" align="center" width="150"></el-table-column>
          <el-table-column prop="lineStationName" sortable label="工站" align="center" width="150"></el-table-column>
          <el-table-column prop="totalFreshPass" sortable label="一次通过数" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column prop="totalFreshFail" sortable label="一次不良数" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column sortable label="一次通过率(%)" align="center" width="130" :formatter="formatFreshRate"></el-table-column>
          <el-table-column prop="totalReworkFail" sortable label="二次通过数" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column prop="totalReworkPass" sortable label="二次不良数" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column sortable label="二次通过率(%)" align="center" width="130" :formatter="formatReworkRate"></el-table-column>
          <el-table-column prop="creator" sortable label="创建人" align="center" fixed="right" width="100"></el-table-column>
          <el-table-column prop="createdDt" sortable label="创建时间" align="center" fixed="right" width="140"></el-table-column>
        </el-table>
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
      showMoreConditon: false,
      dateType: '1',
      searchForm: {
        lineStationName: '',
        docNo: '',
        materialNo: '',
        lineName: '',
        fromDt: '',
        toDt: ''
      },
      tableData: []
    }
  },
  computed: {
    startTime () {
      let { dateType } = this
      if (dateType === '1') {
        return this.$dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      } else if (dateType === '2') {
        return this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
      } else if (dateType === '3') {
        return this.$dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    resetForm () {
      this.dateType = '1'
      this.$global.resetForm(this.searchForm)
      this.initData()
    },
    formatInt (row, column, ceellValue) {
      return parseInt(ceellValue)
    },
    formatFreshRate (row, column, ceellValue) {
      let totalFreshPass = parseInt(row.totalFreshPass)
      let totalFreshFail = parseInt(row.totalFreshFail)
      let rate = totalFreshPass / (totalFreshPass + totalFreshFail) * 100
      return isNaN(rate) ? 0 : rate.toFixed(2)
    },
    formatReworkRate (row, column, ceellValue) {
      let totalFreshPass = parseInt(row.totalFreshPass)
      let totalReworkPass = parseInt(row.totalReworkPass)
      let totalReworkFail = parseInt(row.totalReworkFail)
      let rate = (totalFreshPass + totalReworkPass) / (totalFreshPass + totalReworkPass + totalReworkFail) * 100
      return isNaN(rate) ? 0 : rate.toFixed(2)
    },
    async initData () {
      this.searchForm.fromDt = this.startTime
      this.searchForm.toDt = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getYieldRate(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      }
    }
  },
  created () {
    this.initData()
  }
}
</script>
