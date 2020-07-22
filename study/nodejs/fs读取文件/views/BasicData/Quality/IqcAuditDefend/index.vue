<template>
<div class="mes-main mes-work-order">
  <h3 class="mes-main-title">IPQC稽核项维护</h3>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-select style="width:35%" size="mini" v-model="productionUnit"  placeholder="请选择生产部门" clearable >
        <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-button size="mini" style="float:right;margin-left:10px;"  @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
      </el-button>
      <el-input size="mini" v-model="searchForm.keywords" placeholder="请输入关键词" style="width:40%;float:right;" @keydown.enter.native="findItemPage">
      </el-input>
    </el-col>
    <el-col :span="24"  style="padding-top:1vh;">
       <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="产品系列" class="el-col el-col-11">
             <el-select v-model="searchForm.model" clearable placeholder="请选择产品系列" style="width:100%">
              <el-option v-for="(option,i) in machineList" :key="i" :label="option.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="稽核项目" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.inspectItem" style="width:100%" size="mini">
            </el-input>
          </el-form-item>
        </el-form>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="findItemPage">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleAudit('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="ipqcDeleteItem('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-download " @click="downLoad">导出</el-button>
      </el-col>
       <el-col :span="12">
           <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border size="mini"   @selection-change="tableChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="productionUnitCode" label="生产单位" align="center" sortable></el-table-column>
        <el-table-column prop="modelCode" label="产品系列" align="center" sortable></el-table-column>
        <el-table-column prop="inspectItem" label="稽核项目" align="center" sortable></el-table-column>
        <el-table-column prop="inspectContent" label="稽核内容" align="center" sortable></el-table-column>
        <el-table-column prop="frequency" label="点检频率" align="center" sortable></el-table-column>
        <el-table-column prop="frequencyUom" label="频率单位" align="center" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="120" >
          <template slot-scope="scope">
            <handle-button @click="handleAudit(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="ipqcDeleteItem(scope.row.mqomIpqcCheckitemId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" >
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @findItemPage="findItemPage"></dialog-form>
    </el-dialog>
  </div>
</div>
</template>

<script>
import paging from '@/mixins/paging'
import dialogForm from './dialogForm'
export default {
  mixins: [paging],
  data () {
    return {
      tableData: [

      ],
      machineList: [],
      productionUnitList: [],
      dialogVisible: false,
      isEdit: false,
      showMoreConditon: false,
      productionUnit: '',
      searchForm: {
        queryLevel: 1,
        productionUnit: '',
        model: '',
        inspectItem: ''
      },
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑检验规则维护' : '新增检验规则维护'
    },
    editDisabled () {
      let len = this.selectList.length
      return len !== 1
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mqomIpqcCheckitemId)
      })
    },
    handleAudit (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mqomIpqcCheckitemId = row.mqomIpqcCheckitemId
        })
      }
    },
    // 获取生产单位
    async getProductionUnit () {
      let res = await this.$api.getProductionUnit()
      this.productionUnitList = res.data
    },
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.machineList = res.data.list
    },
    async findItemPage () {
      let { searchForm, page } = this
      if (this.productionUnit === 'all') {
        searchForm.productionUnit = ''
      } else {
        searchForm.productionUnit = this.productionUnit
      }
      let data = Object.assign(searchForm, page)
      let res = await this.$api.findItemPage(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.findItemPage()
    },
    async ipqcDeleteItem (id) {
      let ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除选中的信息吗？')
        if (confirm) {
          let res = await this.$api.ipqcDeleteItem(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.findItemPage()
          })
        }
      } else {
        this.$message.warning('请选择要删除信息')
      }
    },
    downLoad () {
      this.$message.warning('功能还在开发中 敬请期待！')
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.findItemPage()
    this.getModelList()
    this.getProductionUnit()
  }

}
</script>
