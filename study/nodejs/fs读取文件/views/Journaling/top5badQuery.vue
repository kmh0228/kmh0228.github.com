<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">TOP5不良查询</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="请输入工站名称" v-model.trim="searchForm.workStation" size="mini" style="width:40%;" @keydown.enter.native="getTopDefectCode">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getTopDefectCode"></i> -->
        </el-input>
         <el-button size="mini" style="margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="创建起始时间：" class="el-col el-col-12">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
            <el-form-item label="料号：" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
           <el-form-item label="创建截止时间：" class="el-col el-col-12">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime"  placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
       <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="getTopDefectCode">查询</el-button>
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
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="defectCode" sortable label="不良代码" label-class-name="mes-table-label"  align="center"></el-table-column>
          <el-table-column prop="defectDesc" sortable label="不良描述" align="center"></el-table-column>
          <el-table-column prop="count" sortable label="不良记录数量" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      badcode: '',
      showMoreConditon: false,
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
      searchForm: {
        startTime: '',
        materialNo: '',
        endTime: '',
        workStation: ''
      },
      total: 0,
      page: {
        pageSize: 10,
        pageIndex: 1
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
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    // 获取所有不良top5代码
    async getTopDefectCode () {
      let data = Object.assign(this.searchForm, this.page)
      let res = await this.$api.getTopDefectCode(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    // 重置查询条件
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.getTopDefectCode()
    }
  },
  created () {
    this.getTopDefectCode()
  }
}
</script>
