<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('testResuQue_TestResuQuer')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
       <el-col :span="12">
        <el-input size="mini" v-model.trim="searchForm.jobOrder" :placeholder="$t('common_PleasInpuWorkOr')" style="width:40%;"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_PleasEnte') + ' SN'" v-model.trim="searchForm.sn" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('testResuQue_PlannStarTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('testResuQue_FinisProdNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('testResuQue_PlannEndTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
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
        <el-table :data="tableData" border size="mini">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="sn" sortable label="SN" label-class-name="mes-table-label" align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center"></el-table-column>
          <el-table-column prop="jobOrder" :label="$t('common_WorkOrdeNo')" align="center"></el-table-column>
          <el-table-column prop="eqpCode" sortable :label="$t('testResuQue_MachiNumb')" align="center"></el-table-column>
          <el-table-column prop="segName" sortable :label="$t('common_WorkStat')" align="center"></el-table-column>
          <el-table-column prop="result" sortable :label="$t('testResuQue_testResu')" align="center"></el-table-column>
          <el-table-column prop="failureCode" sortable :label="$t('testResuQue_DefecCode')" align="center"></el-table-column>
          <el-table-column prop="creator" sortable :label="$t('testResuQue_Opera')" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('testResuQue_ComplTime')" align="center"></el-table-column>
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
      searchForm: {
        sn: '',
        jobOrder: '',
        materialNo: '',
        startTime: '',
        endTime: ''
      },
      tableData: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取测试结果
    async initData () {
      let data = Object.assign(this.searchForm, this.page)
      let res = await this.$api.getTestReport(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    // 重置报表
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.initData()
    }
  },
  created () {
    this.initData()
  }
}
</script>
