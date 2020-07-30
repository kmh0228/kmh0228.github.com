<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('documentType_DocumType')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('common_code')" v-model.trim="code" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input :placeholder="$t('common_Name')" v-model.trim="name" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getBillManageCategoryList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </div>
      </table-list>
    </div>
    <div class="mes-main-tabs" v-if="showTabs">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('documentType_DocumCate')" name="category">
          <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" icon="el-icon-plus" @click="showPop">{{$t('documentType_choic')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-delete-solid" :loading="deleteLoading" @click="deleteFun">{{$t('common_Del')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-setting" :loading="setLoading" @click="setUpDefault">{{$t('documentType_setDefa')}}</el-button>
              </el-col>
            </el-row>
            <div class="mes-table-content">
              <el-table :data="childData" border highlight-current-row size="mini" @selection-change="tableSelectionChange">
                <el-table-column type="selection" width="50" align="center" ></el-table-column>
                <el-table-column prop="code" :label="$t('common_code')" align="center" ></el-table-column>
                <el-table-column prop="name" :label="$t('common_Name')" align="center" ></el-table-column>
                <el-table-column prop="description" :label="$t('common_Description')" align="center" ></el-table-column>
                <el-table-column prop="isInvalid" :label="$t('common_Status')" align="center" >
                  <template slot-scope="scope">
                    <div>{{scope.row.isInvalid === '1' ? $t('documentType_avail') : $t('documentType_NotAvai')}} </div>
                  </template>
                </el-table-column>
                <el-table-column prop="functionType" :label="$t('documentType_class')" align="center" ></el-table-column>
                <el-table-column prop="isDefault" :label="$t('documentType_Defau')" align="center" >
                  <template slot-scope="scope">
                    <div>{{scope.row.isDefault === '1' ? $t('common_Yes') : $t('common_No')}} </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
     <el-dialog
      :title="$t('documentType_SelecDocuCate')"
      :visible.sync="addVisible"
      width="1100px">
      <div class="mes-table">
        <el-table :data="popTableData" border highlight-current-row size="mini" max-height="400px" ref="popTable" @selection-change="popTableSelectionChange">
          <el-table-column type="selection" width="50" align="center" ></el-table-column>
          <el-table-column prop="code" :label="$t('common_code')" align="center" ></el-table-column>
          <el-table-column prop="name" :label="$t('common_Name')" align="center" ></el-table-column>
          <el-table-column prop="description" :label="$t('common_Description')" align="center" ></el-table-column>
          <el-table-column prop="isInvalid" :label="$t('common_Status')" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.isInvalid === '1' ? $t('documentType_avail') : $t('documentType_NotAvai')}} </div>
            </template>
          </el-table-column>
          <el-table-column prop="functionType" :label="$t('documentType_class')" align="center" ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">{{$t('common_cancel')}}</el-button>
        <el-button type="primary" @click="saveBillManageBillRelation" :loading="saveLoading">{{$t('common_ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      code: '',
      name: '',
      addVisible: false,
      saveLoading: false,
      setLoading: false,
      deleteLoading: false,
      total: 0,
      option: tableOption(this),
      mWmsBillCategoryId: '',
      tableData: [],
      childData: [],
      showTabs: false,
      activeName: 'category',
      selectList: [],
      popSelectList: [],
      popTableData: []
    }
  },
  computed: {
  },
  watch: {
    mWmsBillCategoryId (n) {
      this.selectBillManageByKey(n)
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.code = ''
      this.name = ''
      this.$refs.tableList.queryList(true)
    },
    showPop () {
      this.addVisible = true
      this.getSubCategory()
    },
    tableSelectionChange (val) {
      this.selectList = val
    },
    popTableSelectionChange (val) {
      this.popSelectList = val
    },
    async deleteFun () {
      if (!this.selectList.length) {
        this.$message.warning(this.$t('documentType_PleasSeleDocuCa'))
        return false
      }
      let selectIds = this.selectList.map(item => item.mWmsBillSubcategoryId)
      let list = this.childData.filter(item => selectIds.indexOf(item.mWmsBillSubcategoryId) === -1).map(item => {
        return {
          isDefault: item.isDefault,
          mWmsBillSubcategoryId: item.mWmsBillSubcategoryId,
          mWmsBillCategoryId: this.mWmsBillCategoryId
        }
      })
      this.deleteLoading = true
      let res = await this.$api.saveBillManageBillRelation(list)
      this.deleteLoading = false
      if (res.code === '200') {
        this.selectBillManageByKey(this.mWmsBillCategoryId)
      }
    },
    async setUpDefault () {
      if (this.selectList.length === 1) {
        let list = this.childData.map(item => {
          return {
            isDefault: this.selectList[0].mWmsBillSubcategoryId === item.mWmsBillSubcategoryId ? '1' : '0',
            mWmsBillSubcategoryId: item.mWmsBillSubcategoryId,
            mWmsBillCategoryId: this.mWmsBillCategoryId
          }
        })
        this.setLoading = true
        let res = await this.$api.saveBillManageBillRelation(list)
        this.setLoading = false
        if (res.code === '200') {
          this.selectBillManageByKey(this.mWmsBillCategoryId)
        }
      } else {
        this.$message.warning(this.$t('documentType_PleasSeleOneBeS'))
      }
    },
    async getSubCategory () {
      let res = await this.$api.getSubCategory({ pageSize: 1000, pageIndex: 1 })
      if (res.code === '200') {
        this.popTableData = res.data.list
        this.$nextTick(() => {
          // 设置默认选中项
          this.popTableData.forEach(item => {
            if (this.childData.map(ite => ite.mWmsBillSubcategoryId).indexOf(item.mWmsBillSubcategoryId) > -1) {
              item.isDefault = this.childData.find(ite => ite.mWmsBillSubcategoryId === item.mWmsBillSubcategoryId).isDefault
              this.$refs.popTable.toggleRowSelection(item, true)
            }
          })
        })
      } else {
        this.popTableData = []
      }
    },
    async getBillManageCategoryList (page) {
      let res = await this.$api.getBillManageCategoryList({ ...page, code: this.code, name: this.name })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async selectBillManageByKey (id) {
      let res = await this.$api.selectBillManageByKey({ mWmsBillCategoryId: id })
      if (res.code === '200') {
        this.childData = res.data
      } else {
        this.childData = []
      }
    },
    async saveBillManageBillRelation () {
      if (this.popSelectList.length) {
        let list = this.popSelectList.map(item => {
          return {
            isDefault: item.isDefault ? item.isDefault : '0',
            mWmsBillSubcategoryId: item.mWmsBillSubcategoryId,
            mWmsBillCategoryId: this.mWmsBillCategoryId
          }
        })
        this.saveLoading = true
        let res = await this.$api.saveBillManageBillRelation(list)
        this.saveLoading = false
        if (res.code === '200') {
          this.addVisible = false
          this.selectBillManageByKey(this.mWmsBillCategoryId)
        }
      } else {
        this.$message.warning(this.$t('documentType_PleasSeleDataBe'))
      }
    }
  },
  components: {
    TableList
  },
  created () {
  }
}
</script>
