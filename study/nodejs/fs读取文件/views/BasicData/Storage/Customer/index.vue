<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('customer_custoMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input :placeholder="$t('common_CustoCode')" v-model.trim="mWmsCustomerCode" size="mini" style="width:35%;" @keydown.enter.native="getCustomer">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getCustomer">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handTable('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteCustomer('')">{{$t('common_Delete')}}</el-button>
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
      <div class="mes-table-content" >
        <el-table :data="tableData" border @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="50" align="center" ></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="mWmsCustomerCode" sortable :label="$t('common_CustoCode')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsCustomerName" sortable :label="$t('customer_CustoName')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsCustomerAddress" sortable :label="$t('customer_CompaAddr')" align="center" min-width="120"></el-table-column>
          <el-table-column prop="mWmsCustomerCity" sortable :label="$t('common_city')" align="center"></el-table-column>
          <el-table-column prop="mWmsCustomerProvince" sortable :label="$t('common_ProviAndStat')" align="center"></el-table-column>
          <el-table-column prop="mWmsCustomerCountry" sortable :label="$t('common_count')" align="center"></el-table-column>
          <el-table-column prop="mWmsCustomerUser" sortable :label="$t('common_conta')" align="center" min-width="100"></el-table-column>
          <el-table-column prop="mWmsCustomerPhone" sortable :label="$t('customer_Telep')" align="center"></el-table-column>
          <el-table-column prop="mWmsCustomerPostcode" sortable :label="$t('customer_Postc')" align="center"></el-table-column>
          <el-table-column prop="mWmsCustomerFax" sortable :label="$t('customer_Fax')" align="center"></el-table-column>
          <!-- <el-table-column prop="isInvalid" label="是否启用" align="center"></el-table-column> -->
          <!-- <el-table-column prop="creator" sortable label="创建人" align="center" ></el-table-column>
          <el-table-column prop="createdDt" sortable label="创建时间" align="center" width="180px"></el-table-column> -->
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handTable(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteCustomer(scope.row.mWmsCustomerId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getCustomer="getCustomer" ></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'

export default {
  data () {
    return {
      mWmsCustomerCode: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      isEdit: '',
      selectList: [],
      dialogVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('customer_EditCustForm') : this.$t('customer_NewCustForm')
    },
    editTable () {
      let { selectList } = this
      return selectList.length !== 1
    }
  },
  methods: {
    refreshPage () { },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getCustomer()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getCustomer()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async getCustomer () {
      let { mWmsCustomerCode } = this
      let data = Object.assign({ mWmsCustomerCode }, this.page)
      let res = await this.$api.getCustomers(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    // 刷新数据，重新查询
    refreshData () {
      this.mWmsCustomerCode = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getCustomer()
    },
    handTable (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mWmsCustomerId = row.mWmsCustomerId
        })
      } else {
        this.isEdit = false
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(select => {
        this.selectList.push(select.mWmsCustomerId)
      })
    },
    cannel () {
      this.dialogVisible = false
    },
    async deleteCustomer (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('customer_AreYouSureDeleC'))
        if (confirmRes) {
          let res = await this.$api.updateBasicCustomerBatch(ids)
          let { msg, code } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getCustomer()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('customer_PleasSeleCustIn'))
      }
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getCustomer()
  }

}
</script>
