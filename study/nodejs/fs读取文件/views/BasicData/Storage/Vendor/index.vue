<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">供应商管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input placeholder="供应商代码" v-model.trim="mWmsVendorCode" size="mini" style="width:35%;" @keydown.enter.native="getVendors">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getVendors">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleVendor('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteVendor('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="50" align="center" fixed></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="mWmsVendorCode" label="供应商代码" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="mWmsVendorName" label="供应商名称" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="mWmsVendorAddress" label="公司地址" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="mWmsVendorCity" label="城市" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorProvince" label="省州" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorCountry" label="国家" sortable width="80" align="center"></el-table-column>
          <el-table-column prop="mWmsVendorUser" label="联系人" sortable width="100" align="center"></el-table-column>
          <el-table-column prop="mWmsVendorPhone" label="电话" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorPostcode" label="邮编" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorFax" label="传真" sortable align="center"></el-table-column>
          <!-- <el-table-column prop="isInvalid" label="是否启用" width="80" align="center"></el-table-column> -->
          <!-- <el-table-column prop="creator" label="创建人" sortable align="center"></el-table-column>
          <el-table-column prop="createdDt" label="创建时间" sortable align="center"></el-table-column> -->
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleVendor(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteVendor(scope.row.mWmsVendorId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getVendors="getVendors"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      mWmsVendorCode: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      selectList: [],
      dialogVisible: false,
      isEdit: false
    }
  },
  computed: {
    dialogTitle () {
      let { isEdit } = this
      return isEdit ? '编辑供应商' : '新增供应商'
    }

  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getVendors()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getVendors()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(select => {
        this.selectList.push(select.mWmsVendorId)
      })
    },
    async getVendors () {
      let { mWmsVendorCode, page } = this
      let data = Object.assign({ mWmsVendorCode }, page)
      let res = await this.$api.getVendors(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.mWmsVendorCode = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getVendors()
    },
    handleVendor (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mWmsVendorId = row.mWmsVendorId
        })
      } else {
        this.isEdit = false
      }
    },
    async deleteVendor (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的供应商信息吗？')
        if (confirmRes) {
          let res = await this.$api.deleteVendor(ids)
          let { code, msg } = res
          if (code === '200') {
            this.getVendors()
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择需要删除的供应商信息！')
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getVendors()
  }
}
</script>
