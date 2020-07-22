<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">出货明细查询</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="请输入DN号" v-model.trim="searchForm.docNo" size="mini" style="width:40%;" @keydown.enter.native="initData">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
         <el-button size="mini" style="margin-left:10px;"  @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
      </el-col>
       <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="计划开始时间：" class="el-col el-col-11">
            <el-date-picker v-model="searchForm.startTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划结束时间：" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker v-model="searchForm.endTime" style="width:100%" size="mini" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
       <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="initData">查询</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resetList">刷新</el-button>
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
          <el-table-column prop="docNo" sortable label="DN" label-class-name="mes-table-label" align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable label="成品料号" align="center"></el-table-column>
          <el-table-column prop="tPomJobActPackId" sortable label="栈板号" align="center"></el-table-column>
          <el-table-column prop="shippedQty" sortable label="数量" align="center"></el-table-column>
          <el-table-column prop="creator" sortable label="扫描人" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable label="完成时间" align="center"></el-table-column>
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
      snType: [{ type: '成品' }, { type: '零件' }],
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
        endTime: '',
        docNo: ''
      },
      tableData: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取出货明细结果
    async initData () {
      let data = Object.assign(this.searchForm, this.page)
      let res = await this.$api.getShipmentDetail(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    resetList () {
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      this.searchForm.docNo = ''
      this.initData()
    }

  },
  created () {
    this.initData()
  }
}
</script>
