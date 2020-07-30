<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('yieldRate_ReporQuer')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('yieldRate_NameWorkStat')" v-model.trim="searchForm.lineStationName" size="mini" style="width:40%;">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_PleasInpuWorkOr')" v-model.trim="searchForm.docNo" size="mini" style="width:40%;float:right;">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('yieldRate_LineType')" class="el-col el-col-12">
            <el-input size="mini" v-model="searchForm.lineName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('yieldRate_ItemNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('yieldRate_Time')" class="el-col el-col-12">
            <el-radio-group v-model="dateType" class="date-type-radio" size="mini">
              <el-radio label="1" border>{{$t('yieldRate_day')}}</el-radio>
              <el-radio label="2" border>{{$t('common_week')}}</el-radio>
              <el-radio label="3" border>{{$t('common_month')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetForm">{{$t('common_Refresh')}}</el-button>
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
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="fromDt" sortable :label="$t('common_startTime')" show-overflow-tooltip align="center" width="140"></el-table-column>
          <el-table-column prop="toDt" sortable :label="$t('common_endTime')" show-overflow-tooltip align="center" width="140"></el-table-column>
          <el-table-column prop="docNo" sortable :label="$t('common_WorkOrdeNo')" label-class-name="mes-table-label" class-name="mes-table-click" align="center" width="150"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center" width="150"></el-table-column>
          <el-table-column prop="lineStationName" sortable :label="$t('common_WorkStat')" align="center" width="150"></el-table-column>
          <el-table-column prop="totalFreshPass" sortable :label="$t('yieldRate_NumbeOnePass')" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column prop="totalFreshFail" sortable :label="$t('yieldRate_OneTimeDefeNumb')" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column sortable :label="$t('yieldRate_FirstPassRate')" align="center" width="130" :formatter="formatFreshRate"></el-table-column>
          <el-table-column prop="totalReworkFail" sortable :label="$t('yieldRate_SeconPassNumb')" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column prop="totalReworkPass" sortable :label="$t('yieldRate_NumbeSecoDefe')" align="center" :formatter="formatInt" width="120"></el-table-column>
          <el-table-column sortable :label="$t('yieldRate_SeconPassRate')" align="center" width="130" :formatter="formatReworkRate"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('common_Creator')" align="center" fixed="right" width="100"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('common_CreateTime')" align="center" fixed="right" width="140"></el-table-column>
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
