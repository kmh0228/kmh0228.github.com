<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('storage_StoraAdju')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input size="mini" v-model.trim="searchForm.materialName" :placeholder="$t('common_PleasEnteItemNu')" style="width:40%" @keydown.native.enter="getTableData">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getTableData"></i> -->
        </el-input>
        <el-button size="mini" @click="showMoreDetail = ! showMoreDetail">
          <i class="fa fa-filter" ></i>
        </el-button>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMoreDetail">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('storage_PlannStarTime')" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('storage_PlannEndTime')" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" :placeholder="$t('common_SelecDateTime')" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="getTableData">{{$t('common_Inquire')}}</el-button>
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
          <el-table-column prop="mWmsPkgIdPkgId"  sortable label="PKGID" align="center"></el-table-column>
          <el-table-column prop="materialName"  sortable :label="$t('common_PorN')" align="center"></el-table-column>
          <el-table-column prop="mWmsPkgIdDatecode"  sortable label="DateCode" align="center"></el-table-column>
          <el-table-column prop="mWmsPkgIdLot" sortable :label="$t('common_ProduBatc')" align="center"></el-table-column>
          <el-table-column prop="mWmsPkgIdQty"  sortable :label="$t('common_numbe')" align="center"></el-table-column>
          <el-table-column prop="mWmsBinchangehistoryOldbin"  sortable :label="$t('storage_OldRese')" align="center"></el-table-column>
          <el-table-column prop="mWmsBinchangehistoryNewbin"  sortable :label="$t('storage_NewRese')" align="center"></el-table-column>
          <el-table-column prop="creator"  sortable :label="$t('storage_Moder')" align="center"></el-table-column>
          <el-table-column prop="createdDt"  sortable :label="$t('storage_AdjusTime')" align="center" :formatter="formatterDate"></el-table-column>
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
        materialName: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
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
      showMoreDetail: false

    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatterDate (row, column, cellValue, index) {
      return this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取表单信息
    async getTableData () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.selectBinchangehistory(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
  }
}
</script>
