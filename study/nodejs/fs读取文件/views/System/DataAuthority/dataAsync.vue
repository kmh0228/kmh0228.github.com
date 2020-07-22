<template>
  <div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input v-model="tenantCode" style="width:35%;" placeholder="租户代码"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="initData">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-copy-document" @click="batchSynchronize()">批量同步</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="initData">刷新</el-button>
        </el-col>
        <el-col :span="13">
          <mes-page ref="mesPage" :initData="initData"  :total="total"/>
        </el-col>
      </el-row>
      <el-table :data="tableData" border  @selection-change="handleSelectionChange">>
        <el-table-column type="selection" width="50" align="center" ></el-table-column>
        <el-table-column type="index" label="序号" align="center" fixed="left" :index="indexMethod"></el-table-column>
        <el-table-column sortable prop="corpName" label="租户名称" align="center"></el-table-column>
        <el-table-column sortable prop="corpCode" label="租户代码" align="center"></el-table-column>
        <el-table-column sortable  prop="createTime"  label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <handle-button iconClass='el-icon-copy-document' tipText="同步"  @click="synchronizeBasicData([scope.row.corpCode])"></handle-button>
            <handle-button iconClass='el-icon-set-up' tipText="重置"  @click="resetBasicData([scope.row.corpCode])"></handle-button>
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
      tenantCode: '',
      tableData: [],
      selectData: [],
      total: 0
    }
  },
  methods: {
    indexMethod (index) {
      const { pageIndex, pageSize } = this.$refs.mesPage.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // refreshPage () {
    //   this.tenantCode = ''
    //   this.$refs.mesPage.resetPage()
    //   this.initData()
    // },
    async initData () {
      const { page } = this.$refs.mesPage
      let res = await this.$api.getAllTenantInformation({ ...page, tenantCode: this.tenantCode })
      if (res.code === '200') {
        this.tableData = res.data.list ? res.data.list : []
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    handleSelectionChange (val) {
      this.selectData = val
    },
    batchSynchronize () {
      if (!this.selectData.length) {
        this.$message.warning('请选择同步数据！')
        return false
      }
      this.synchronizeBasicData(this.selectData.map(item => item.corpCode))
    },
    async synchronizeBasicData (corpCodeList) {
      let res = await this.$api.synchronizeBasicData({ corpCodeList: corpCodeList })
      if (res.code === '200') {
        this.$message.success('同步成功!')
        // this.initData()
      }
    },
    async resetBasicData (corpCodeList) {
      let res = await this.$api.synchronizeBasicData({ corpCodeList: corpCodeList })
      if (res.code === '200') {
        this.$message.success('重置成功!')
        // this.initData()
      }
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
