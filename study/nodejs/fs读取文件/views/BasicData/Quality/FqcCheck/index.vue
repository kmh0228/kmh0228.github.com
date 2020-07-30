<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('fqcCheck_FinalInsp')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="searchForm.docStatus" dictType="QMS_CHECK_NO_STATUS"  style="width:35%" selectKey="dictCode" @change="findFqcList"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('common_PleasEnteKeyw')" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="findFqcList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findFqcList"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('fqcCheck_InspeDate')" class="el-col el-col-11">
            <el-date-picker style="width:100%" v-model="timeValue"  type="daterange" align="right" unlink-panels  range-separator="至"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')" :picker-options="pickerOptions" clearable></el-date-picker>
          </el-form-item>
            <el-form-item :label="$t('common_StockInNo')" class="el-col el-col-11  el-col-offset-1">
            <el-input  v-model="searchForm.stockInNo"  :placeholder="$t('common_PleasInpuStocIn')" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_PorN')" class="el-col el-col-11">
            <el-input v-model="searchForm.materialNo" size="mini" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="findFqcList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleCheck('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" highlight-current-row border size="mini"  @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="batchNo" :label="$t('common_InspeOrdeNo')" align="center" sortable></el-table-column>
          <el-table-column prop="stockInNo" :label="$t('common_StockInNo')" align="center" sortable></el-table-column>
          <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center" sortable></el-table-column>
          <el-table-column prop="customer" :label="$t('common_custo')" align="center" sortable></el-table-column>
          <el-table-column prop="inspectDate" :label="$t('common_Date')" align="center" sortable></el-table-column>
          <el-table-column prop="docStatusName" :label="$t('common_Status')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleCheck(scope.row)" iconClass="el-icon-edit-outline" :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="deletetableData(scope.row.tQomFqcMainId)" iconClass="el-icon-delete" :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: this.$t('fqcCheck_LastWeek'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('fqcCheck_LastMont'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('fqcCheck_LastThreMont'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchForm: {
        docStatus: 'DRAFT',
        keywords: '',
        materialNo: '',
        stockInNo: ''
      },
      timeValue: [],
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      lineList: [],
      selectList: []
    }
  },
  computed: {
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findFqcList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findFqcList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.tQomFqcMainId)
      })
    },
    // 获取表的内容
    async findFqcList () {
      let { searchForm, page, timeValue } = this
      let startTime = timeValue[0] ? timeValue[0] : ''
      let endTime = timeValue[1] ? timeValue[1] : ''
      let data = Object.assign(page, searchForm, { startTime, endTime })
      let res = await this.$api.findFqcList(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    handleCheck (row) {
      if (row) {
        let status = this.searchForm.docStatus
        const { batchNo, tQomFqcMainId } = row
        this.$router.push(`FqcCheck/edit?id=${tQomFqcMainId}&status=${status}&unitNumber=${batchNo}`)
      } else {
        this.$router.push(`FqcCheck/add?status=DRAFT`)
      }
    },
    async deletetableData (id) {
      let { selectList } = this
      const ids = id ? [id] : selectList
      const len = ids.length
      if (len > 0) {
        let confirm = await this.$myPrompt.confirm(this.$t('fqcCheck_AreYouSureChecInfo'))
        if (confirm) {
          let res = await this.$api.deleteFqcById(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.findFqcList()
          })
        }
      } else {
        this.$message.warning(this.$t('fqcCheck_selecFinaChecInfoDele'))
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.findFqcList()
    }
  },
  created () {
    this.findFqcList()
    this.getLineData()
  }

}
</script>
