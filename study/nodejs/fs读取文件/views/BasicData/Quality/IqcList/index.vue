<template>
<div class="mes-main mes-work-order">
  <h3 class="mes-main-title">进料检验列表</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <dict-select  v-model="searchForm.docStatus" placeholder="进料单状态" clearable dictType="SUBMIT_STATUS" @change="initData" selectKey="dictCode" style="width:35%"></dict-select>
    </el-col>
    <el-col :span="12">
       <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
      </el-button>
      <el-input size="mini" v-model="searchForm.keywords" placeholder="请输入关键字" style="width:40%;float:right;" @keydown.enter.native="initData"></el-input>
    </el-col>
    <el-col :span="24"   style="padding-top:1vh;">
      <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
        <el-form-item label="料号"  class="el-col el-col-11">
          <el-input size="mini" v-model="searchForm.mComMaterialNo"></el-input>
        </el-form-item>
        <el-form-item label="检验单号" class="el-col el-col-11 el-col-offset-1">
          <el-input size="mini"   v-model="searchForm.grNo"></el-input>
        </el-form-item>
        <el-form-item label="检验日期" class="el-col el-col-11">
          <el-date-picker style="width:100%"  v-model="valueTime"  type="daterange"   start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd" >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="initData">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="initData">刷新</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border size="mini" @selection-change="tableSelect">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="grNo" label="进料单号" align="center" sortable></el-table-column>
        <el-table-column prop="mComMaterialNo" label="料号" align="center" sortable></el-table-column>
        <el-table-column prop="vendorName" label="供应商" align="center" sortable></el-table-column>
        <el-table-column prop="inspectDate" label="检验日期" align="center" sortable></el-table-column>
        <el-table-column prop="docStatusName" label="状态" align="center" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template slot-scope="scope">
            <handle-button iconClass="el-icon-edit-outline" @click="handleFAI(scope.row)" tipText="编辑"></handle-button>
          </template>
        </el-table-column>
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
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      tableData: [],
      isEdit: false,
      showMoreConditon: false,
      valueTime: [],
      searchForm: {
        docStatus: 'DRAFT',
        mComMaterialNo: '',
        keywords: '',
        startTime: '',
        endTime: ''
      },
      selectList: []
    }
  },
  computed: {
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    handleFAI (row) {
      if (row) {
        const { grNo } = row
        const status = this.searchForm.docStatus
        this.$router.push({ path: '/BasicData/Quality/IqcList/edit', query: { grNo, status } })
      } else {
        this.$router.push('/BasicData/Quality/IqcList/Add')
      }
    },
    tableSelect (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.grNo)
      })
    },
    async initData () {
      const { page, searchForm, valueTime } = this
      searchForm.startTime = valueTime[0] ? valueTime[0] : ''
      searchForm.endTime = valueTime[1] ? valueTime[1] : ''
      const params = Object.assign(page, searchForm)
      const res = await this.$api.getIqcTests(params)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    }
  },
  created () {
    this.initData()
  }
}
</script>
