<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">单据类型</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="编码" v-model.trim="code" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input placeholder="名称" v-model.trim="name" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getBillManageCategoryList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
        </div>
      </table-list>
    </div>
    <div class="mes-main-tabs" v-if="showTabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单据小类" name="category">
          <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" icon="el-icon-plus" @click="showPop">选择</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-delete-solid" :loading="deleteLoading" @click="deleteFun">删除</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" icon="el-icon-setting" :loading="setLoading" @click="setUpDefault">设置默认</el-button>
              </el-col>
            </el-row>
            <div class="mes-table-content">
              <el-table :data="childData" border highlight-current-row size="mini" @selection-change="tableSelectionChange">
                <el-table-column type="selection" width="50" align="center" ></el-table-column>
                <el-table-column prop="code" label="编码" align="center" ></el-table-column>
                <el-table-column prop="name" label="名称" align="center" ></el-table-column>
                <el-table-column prop="description" label="描述" align="center" ></el-table-column>
                <el-table-column prop="isInvalid" label="状态" align="center" >
                  <template slot-scope="scope">
                    <div>{{scope.row.isInvalid === '1' ? '可用' : '不可用'}} </div>
                  </template>
                </el-table-column>
                <el-table-column prop="functionType" label="分类" align="center" ></el-table-column>
                <el-table-column prop="isDefault" label="是否默认" align="center" >
                  <template slot-scope="scope">
                    <div>{{scope.row.isDefault === '1' ? '是' : '否'}} </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
     <el-dialog
      title="选择单据小类"
      :visible.sync="addVisible"
      width="1100px">
      <div class="mes-table">
        <el-table :data="popTableData" border highlight-current-row size="mini" max-height="400px" ref="popTable" @selection-change="popTableSelectionChange">
          <el-table-column type="selection" width="50" align="center" ></el-table-column>
          <el-table-column prop="code" label="编码" align="center" ></el-table-column>
          <el-table-column prop="name" label="名称" align="center" ></el-table-column>
          <el-table-column prop="description" label="描述" align="center" ></el-table-column>
          <el-table-column prop="isInvalid" label="状态" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.isInvalid === '1' ? '可用' : '不可用'}} </div>
            </template>
          </el-table-column>
          <el-table-column prop="functionType" label="分类" align="center" ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBillManageBillRelation" :loading="saveLoading">确 定</el-button>
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
        this.$message.warning('请选择需要删除的单据小类')
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
        this.$message.warning('请选择一条需要设置为默认小类')
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
        this.$message.warning('请选择需要设置的数据')
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
