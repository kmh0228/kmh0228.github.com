<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">编码规则管理</h3>
    <el-form label-position="left">
      <el-form-item>
        <el-input v-model="mSeqName" size="mini" placeholder="编码名称" style="width:12vw;" @keydown.native.enter="searchCodingRules">
          <i slot="suffix" class="el-input__icon" @click="searchCodingRules"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="searchCodingRules">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus" @click="handlePage('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="delCodingRule('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="getCodingRules">刷新</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="codingData" border highlight-current-row size="mini" @selection-change="selectRule">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="mSeqName" sortable label="编码名称" align="center"></el-table-column>
          <el-table-column prop="seqNoFormat" sortable label="编码规则" :formatter="formatterRule" align="center"></el-table-column>
          <el-table-column prop="description" sortable label="描述" align="center"></el-table-column>
          <el-table-column prop="resetType" sortable label="重置类型" align="center"></el-table-column>
          <el-table-column prop="lastEditedDt" sortable label="最后编辑时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline mes-table-handle-icon" @click="handlePage(scope.row.mSeqId)"></i>
              <i class="el-icon-delete mes-table-handle-icon"  style="color:#F56C6C" @click="delCodingRule(scope.row.mSeqId)"></i>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mSeqName: '',
      queryLevel: 1,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      codingData: [],
      selectedList: []
    }
  },
  computed: {
    editDisabeld () {
      let len = this.selectedList.length
      return len !== 1
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getCodingRules()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getCodingRules()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatterRule (row, column, cellValue) {
      let reg = /\|/g
      if (reg.test(cellValue)) {
        return cellValue.replace(reg, '')
      } else {
        return cellValue
      }
    },
    // toEditPage (id) {
    //   this.$router.push(`/System/CodingRule/Edit?seqid=${id}`)
    // },
    searchCodingRules () {
      this.page.pageIndex = 1
      this.getCodingRules()
    },
    async getCodingRules () {
      let { mSeqName, page, queryLevel } = this
      let data = Object.assign({ mSeqName, queryLevel }, page)
      let res = await this.$api.getCodingRules(data)
      let { totalNum, list } = res.data
      this.total = totalNum
      this.codingData = list
    },
    handlePage (id) {
      if (id) {
        this.$router.push(`/System/CodingRule/Edit?seqid=${id}`)
      } else {
        this.$router.push('/System/CodingRule/Add')
      }
    },
    selectRule (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mSeqId)
      })
    },
    async delCodingRule (id) {
      let ids = id ? [id] : this.selectedList
      let len = ids.length
      if (ids.length > 0) {
        let text = id ? '当前' : '选中'
        let confirmRes = await this.$myPrompt.confirm(`确定删除${text}的编码规则吗？`)
        if (confirmRes) {
          let res = await this.$api.delCodingRules(ids)
          if ((this.total - len) % this.page.pageSize === 0) {
            this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
          }
          this.getCodingRules()
          this.$message.success(res.msg)
        }
      } else {
        this.$message.warning('请选择需要删除的编码规则！')
      }
    }
  },
  created () {
    this.getCodingRules()
  }
}
</script>
