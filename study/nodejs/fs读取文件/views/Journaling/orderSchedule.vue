<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('orderSched_WorkOrdeProgQuer')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <!-- <el-select style="width:35%;" size="mini" v-model="searchForm.docStatus" clearable filterable :placeholder="$t('orderSched_WorkOrdeStat')" @change="initData">
          <el-option v-for="(option,i) in workOrderStatusList" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
        </el-select> -->
        <dict-select style="width:35%;"  v-model="searchForm.docStatus" dictType="WORK_ORDER_STATUS" clearable  ></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_PleasInpuWorkOr')" v-model.trim="searchForm.docNo" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('orderSched_PlannStarTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startDt" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('orderSched_FinisProdNo')" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.matrialNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('orderSched_PlannEndTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.closeDt" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
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
          <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" :index="indexMethod"></el-table-column>
          <el-table-column prop="docNo" sortable :label="$t('common_WorkOrdeNo')" width="130" show-overflow-tooltip label-class-name="mes-table-label" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" width="120" align="center"></el-table-column>
          <el-table-column prop="docStatus" sortable :label="$t('orderSched_WorkOrdeStat')"  width="110" align="center" :filters="fileterArray"  :filter-method="filterTag"  filter-placement="bottom-end">
            <template slot-scope="scope">
            <el-tag :type="setTagColor(scope.row.docStatus)" size="mini">{{scope.row.docStatus }}</el-tag>
          </template>
          </el-table-column>
          <el-table-column prop="requestQty" sortable :label="$t('common_DemanQuan')" width="100" align="center"></el-table-column>
          <el-table-column prop="onlineQty" sortable :label="$t('orderSched_OnlinQuan')" width="100" align="center"></el-table-column>
          <el-table-column prop="totalQty" sortable :label="$t('common_QuantComp')" width="100" align="center"></el-table-column>
          <el-table-column prop="goodQty" sortable :label="$t('orderSched_QualiQuan')" width="100" align="center"></el-table-column>
          <el-table-column prop="scrapedQty" sortable :label="$t('orderSched_ScrapQuan')" width="100" align="center"></el-table-column>
          <el-table-column prop="startedDt" sortable :label="$t('orderSched_PlannStarDate')" width="120" align="center" :formatter="formatDate"></el-table-column>
          <el-table-column prop="closedDt" sortable :label="$t('orderSched_PlannEndDate')" width="120" align="center" :formatter="formatDate"></el-table-column>
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
      fileterArray: [{ text: this.$t('common_newlyBuil'), value: this.$t('common_newlyBuil') }, { text: this.$t('orderSched_Onlin'), value: this.$t('orderSched_Onlin') }],
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
        startDt: '',
        closeDt: '',
        docNo: '',
        docStatus: '',
        matrialNo: ''
      },
      tableData: []
    }
  },
  methods: {
    // // 获取工单状态
    // async getWorkOrderStatus () {
    //   let type = 'WORK_ORDER_STATUS'
    //   let res = await this.$api.getJobOrdersDict(type)
    //   this.workOrderStatusList = res.data
    // },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatDate (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    setTagColor (status) {
      if (status === this.$t('common_newlyBuil')) {
        return ''
      } else if (status === this.$t('orderSched_Onlin')) {
        return 'success'
      } else if (status === this.$t('orderSched_haveInHand')) {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    filterTag (value, row) {
      return row.tag === value
    },
    // 查询工单进度
    async initData () {
      let data = Object.assign(this.searchForm, this.page)
      let res = await this.$api.getWorkOrderProgeress(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    cellClick (row, column, cell, event) {
      let { property } = column
      if (property === 'docNo') {
        let docNo = row[property]
        this.$router.push(`/Journaling/SnSchedule?docNo=${docNo}`)
      }
    },
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
