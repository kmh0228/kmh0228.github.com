<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('snSchedule_SNProgrInqu')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input size="mini" v-model.trim="searchForm.jobOrder" :placeholder="$t('common_PleasInpuWorkOr')" style="width:40%;" clearable></el-input>
        <el-button size="mini" icon="el-icon-back" @click="$router.go(-1)">{{$t('common_retur')}}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_PleasEnte') + 'SN'" v-model.trim="searchForm.sn" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24"  >
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('snSchedule_CreatStarTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')"  align="right" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('snSchedule_ItemNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('snSchedule_CreatDead')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" align="right" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
            </el-date-picker>
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
        <el-table :data="tableData" border size="mini" @cell-click="cellClick">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" ></el-table-column>
          <el-table-column prop="jobOrder" sortable :label="$t('common_WorkOrdeNo')" width="140" show-overflow-tooltip label-class-name="mes-table-label" align="center"></el-table-column>
          <el-table-column prop="sn" sortable label="产品SN" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center"></el-table-column>
          <el-table-column prop="route" sortable :label="$t('snSchedule_route')" align="center"></el-table-column>
          <el-table-column prop="line" sortable :label="$t('common_Line')" align="center"></el-table-column>
          <el-table-column prop="curWorkStation" sortable :label="$t('snSchedule_CurreWorkStat')" align="center"></el-table-column>
          <el-table-column prop="nextWorkStation" sortable :label="$t('snSchedule_NextStat')" align="center"></el-table-column>
          <el-table-column prop="onlineTime" sortable :label="$t('snSchedule_OnlinTime')" align="center"></el-table-column>
          <el-table-column prop="lastEditor" sortable :label="$t('snSchedule_lastPersScan')" width="110" align="center"></el-table-column>
          <el-table-column prop="lastEditedDt" sortable :label="$t('snSchedule_LastScanTime')" width="120" align="center" ></el-table-column>
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
      searchForm: {
        jobOrder: '',
        sn: '',
        materialNo: '',
        startTime: '',
        endTime: ''
      },
      showMoreConditon: false,
      pickerOptions: {
        shortcuts: [{
          text: this.$t('common_today'),
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: this.$t('common_yesterday'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: this.$t('common_lastWeek'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
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
    // 获取SN进度
    async initData () {
      let data = Object.assign(this.searchForm, this.page)
      let res = await this.$api.getSNProgressReport(data)
      this.total = res.data.totalNum
      this.tableData = res.data.list
    },
    // 点击单元格进行跳转
    cellClick (row, column, cell, event) {
      let { property } = column
      if (property === 'sn') {
        let sn = row[property]
        this.$router.push(`/Journaling/SnCrossQuery?sn=${sn}`)
      }
    },
    // 重置内容
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.initData()
    }
  },
  created () {
    this.initData()
  },
  activated () {
    if (this.$route.query.docNo) {
      this.searchForm.jobOrder = this.$route.query.docNo
      this.initData()
    }
  }
}
</script>
