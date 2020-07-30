<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('vendor_SupplMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input :placeholder="$t('common_SupplCode')" v-model.trim="mWmsVendorCode" size="mini" style="width:35%;" @keydown.enter.native="getVendors">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getVendors">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleVendor('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteVendor('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
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
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="mWmsVendorCode" :label="$t('common_SupplCode')" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="mWmsVendorName" :label="$t('common_SupplName')" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="mWmsVendorAddress" :label="$t('vendor_CompaAddr')" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="mWmsVendorCity" :label="$t('common_city')" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorProvince" :label="$t('common_ProviAndStat')" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorCountry" :label="$t('common_count')" sortable width="80" align="center"></el-table-column>
          <el-table-column prop="mWmsVendorUser" :label="$t('common_conta')" sortable width="100" align="center"></el-table-column>
          <el-table-column prop="mWmsVendorPhone" :label="$t('vendor_Telep')" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorPostcode" :label="$t('vendor_Postc')" sortable align="center"></el-table-column>
          <el-table-column prop="mWmsVendorFax" :label="$t('vendor_Fax')" sortable align="center"></el-table-column>
          <!-- <el-table-column prop="isInvalid" label="是否启用" width="80" align="center"></el-table-column> -->
          <!-- <el-table-column prop="creator" label="创建人" sortable align="center"></el-table-column>
          <el-table-column prop="createdDt" label="创建时间" sortable align="center"></el-table-column> -->
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleVendor(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteVendor(scope.row.mWmsVendorId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
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
      return isEdit ? this.$t('vendor_EditSupp') : this.$t('vendor_NewSupp')
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
        let confirmRes = await this.$myPrompt.confirm(this.$t('vendor_AreYouSureDeleC'))
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
        this.$message.warning(this.$t('vendor_PleasSeleSuppIn'))
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
