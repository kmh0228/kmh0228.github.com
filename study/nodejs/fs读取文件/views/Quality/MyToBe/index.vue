<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">我的待办</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select size="mini" v-model="searchForm.docNo" placeholder="选择单号类型" @change="selectChange" clearable style="width:40%">
          <el-option v-for="(option,i) in checkList" :key="i" :label="option.name" :value="option.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px"  @click="showMoreDetail = ! showMoreDetail">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" v-model.trim="searchForm.creator" placeholder="请输入创建人" style="width:40%;float:right"></el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMoreDetail">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item label="创建时间" class="el-col el-col-11">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="datetimerange"   start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button size="mini" icon="el-icon-search" @click="findExamList">查找</el-button>
          <!-- <span class="split-line">|</span>
          <el-button size="mini">驳回</el-button> -->
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
           layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content" >
        <el-table :data="tableData" border highlight-current-row  size="mini" @cell-click="cellClick">
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="docNo"  sortable label="申请单号" align="center" label-class-name="mes-table-label" class-name="mes-table-click"></el-table-column>
          <el-table-column prop="type"  sortable label="类别" align="center"></el-table-column>
          <el-table-column prop="examPerson"  sortable label="签核人" align="center"></el-table-column>
          <el-table-column prop="examNode"  sortable label="审核节点" align="center"></el-table-column>
          <el-table-column prop="creator"  sortable label="创建人" align="center"></el-table-column>
          <el-table-column prop="creatorD"  sortable label="创建时间" align="center"></el-table-column>
           <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleExam(scope.row.id,'pass')" iconClass="el-icon-finished" tipText="通过"></handle-button>
              <handle-button @click="handleExam(scope.row.id,'reject')" iconClass="el-icon-circle-close" tipText="驳回" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" title="签核意见" class="handle-dialog" width="600px" >
        <dialog-from v-if="dialogVisible" @cancel="cancel" ref="dialog" :signatureType='signatureType' :id="id" @findExamList="findExamList"></dialog-from>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'

export default {
  data () {
    return {
      searchForm: {
        docNo: '',
        creator: '',
        startTime: '',
        endTime: ''
      },
      showMoreDetail: false,
      tableData: [],
      timeValue: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      checkList: [
        {
          name: '进料检验',
          value: 'IQC'
        }, {
          name: '首检',
          value: 'FAI'
        }, {
          name: '巡检',
          value: 'TOUR'
        }, {
          name: 'IPQC稽核',
          value: 'IPQC'
        }, {
          name: '最终检验',
          value: 'FQC'
        }, {
          name: '出货检验',
          value: 'OQC'
        }, {
          name: 'PDCS',
          value: 'PDCS'
        }, {
          name: 'VDCS',
          value: 'VDCS'
        }
      ],
      dialogVisible: false,
      signatureType: '',
      id: ''
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findExamList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findExamList()
    },
    selectChange () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.findExamList()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async findExamList () {
      let { searchForm, page, timeValue } = this
      searchForm.startTime = timeValue[0] ? timeValue[0] : ''
      searchForm.endTime = timeValue[1] ? timeValue[1] : ''
      let params = Object.assign(searchForm, page)
      let res = await this.$api.findExamList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    async handleExam (id, mQomAuditResult) {
      this.id = id
      this.signatureType = mQomAuditResult
      this.dialogVisible = true
    },
    cancel () {
      this.dialogVisible = false
    },
    resetForm () {
      this.$global.resetForm(this.searchForm)
      this.timeValue = []
      this.findExamList()
    },
    cellClick (row, column, cell, event) {
      if (column.property === 'type' && row.docNo) {
        if (row.type === 'IQC') {
          this.$router.replace(`/BasicData/Quality/IqcList/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'FAI') {
          this.$router.replace(`/BasicData/Quality/OnSiteCheck/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'TOUR') {
          this.$router.replace(`/BasicData/Quality/IpqcAudit/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'IPQC') {
          this.$router.replace(`/BasicData/Quality/IpqcAudit/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'FQC') {
          this.$router.replace(`/BasicData/Quality/FqcCheck/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'OQC') {
          this.$router.replace(`/BasicData/Quality/Oqc/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'PDCS') {
          this.$router.replace(`/Quality/PDCS/edit?grNo=${row.docNo}&status=SUBMITTED`)
        } else if (row.type === 'VDCS') {
          this.$router.replace(`/Quality/VDCS/edit?grNo=${row.docNo}&status=SUBMITTED`)
        }
      }
    }
  },
  created () {
    this.findExamList()
  },
  components: {
    dialogFrom
  }
}
</script>
