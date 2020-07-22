<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">储位管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12" :offset="12" style="text-align: right;">
        <el-input placeholder="请输入储位编码" v-model.trim="keywords" size="mini" style="width:35%" @keydown.enter.native="getBin" >
        </el-input>
        <el-tooltip content="展开" placement="top-start">
          <el-button size="mini" style="margin-left:10px" @click=" showMoreConditon = !showMoreConditon" >
            <i class="fa fa-filter"></i>
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchFrom" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="仓库代码" class="el-col el-col-11">
            <el-select v-model="searchFrom.mWmsWarehouseBinWarehouseid" style="width:100%;" size="mini" clearable  placeholder="请选择仓库代码"  @change="getArea" >
              <el-option v-for="(option,i) in warehouseTypeList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId">
              </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="区域代码" class="el-col el-col-11 el-col-offset-1">
            <el-select v-model="searchFrom.mWmsWarehouseBinAreaid" style="width:100%" size="mini" clearable placeholder="请选择区域代码" @change="getShelf">
              <el-option v-for="(option,i) in areaTypeList" :key="i" :label="option.mWmsWarehouseAreaCode" :value="option.mWmsWarehouseAreaId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="储位名称" class="el-col el-col-11">
            <el-input size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="状态" class="el-col el-col-11 el-col-offset-1">
            <el-select v-model="searchFrom.mWmsWarehouseBinWarehouseid" style="width:100%;" size="mini"  placeholder="请选择状态"  @change="getArea" >
              <el-option label="启用" value="启用"></el-option>
              <el-option label="停用" value="停用"></el-option>
          </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getBin">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleBin('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteBin('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-set-up" @click="changeBinStatus">启用/停用</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-set-up" @click="updBinFrozen">冻结/解冻</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background  :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row @selection-change="tableSelctionChange" >
          <el-table-column type="selection" width="50" align="center" ></el-table-column>
          <el-table-column type="index" label="序号"  width="70" align="center" :index="indexMethod" fixed></el-table-column>
          <el-table-column prop="mWmsWarehouseCode" sortable label="仓库代码" align="center"  min-width="120"></el-table-column>
          <el-table-column prop="mWmsWarehouseAreaCode" sortable label="区域代码" align="center"  min-width="120"></el-table-column>
          <!-- <el-table-column prop="mWmsWarehouseShelfCode" sortable  label="货架编号" align="center"  min-width="120"></el-table-column> -->
          <el-table-column prop="mWmsWarehouseBinCode" sortable  label="储位编号" align="center"  min-width="120"></el-table-column>
          <el-table-column prop="mWmsWarehouseBinName" sortable  label="储位名称" align="center"  min-width="120"></el-table-column>
          <el-table-column prop="mWmsWarehouseBinType" sortable  label="储位类型" align="center"  min-width="120"></el-table-column>
          <el-table-column prop="mWmsWarehouseBinUse" sortable  label="储位使用情况" align="center"  width="150"></el-table-column>
          <el-table-column prop="mWmsWarehouseBinStatus" sortable  label="状态" align="center"  min-width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.mWmsWarehouseBinStatus==='1'?'danger':''" size="mini">{{ scope.row.mWmsWarehouseBinStatus==='1'?'停用':'启用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="frozen" sortable  label="是否冻结" align="center"  min-width="120">
            <template slot-scope="scope">
              <el-tag style="width:70px;" :type="scope.row.frozen ?'danger':''" size="mini">{{ scope.row.frozen ?'冻结':'未冻结'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="mWmsWarehouseBinIsmix" sortable label="是否允许混放" align="center" :formatter="foematterData"  width="150"></el-table-column>
          <el-table-column prop="pickTemp" sortable label="是否拣货暂存" align="center" :formatter="foematterData"  width="150"></el-table-column>
          <el-table-column prop="receiveTemp" sortable label="是否收货暂存" align="center" :formatter="foematterData"  width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleBin(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteBin(scope.row.mWmsWarehouseBinId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="diaLogTitle" class="handle-dialog">
      <dialog-from v-if="dialogVisible" ref="dialog" @cannel="cannel" @getBin="getBin"></dialog-from>
    </el-dialog>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      keywords: '',
      mWmsWarehouseBinId: '',
      tableData: [],
      searchFrom: {
        mWmsWarehouseBinWarehouseid: '',
        mWmsWarehouseBinAreaid: ''
      },
      selectList: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      pageList: {
        pageSize: 1000,
        pageIndex: 1
      },
      dialogVisible: false,
      isEdit: '',
      showMoreConditon: false,
      warehouseTypeList: [],
      areaTypeList: [],
      shelfTypeList: []
    }
  },
  computed: {
    editTable () {
      let { selectList } = this
      return selectList.length !== 1
    },
    diaLogTitle () {
      let { isEdit } = this
      return isEdit ? '编辑储位' : '新建储位'
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getBin()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getBin()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    foematterData (row, column, cellValue, index) {
      if (column.property === 'mWmsWarehouseBinIsmix' || column.property === 'pickTemp' || column.property === 'receiveTemp') {
        return cellValue ? '是' : '否'
      } else {
        return cellValue
      }
    },
    handleBin (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mWmsWarehouseBinId = row.mWmsWarehouseBinId
        })
      } else {
        this.isEdit = false
      }
    },
    tableSelctionChange (selection) {
      this.selectList = []
      selection.map(select => {
        this.selectList.push(select.mWmsWarehouseBinId)
      })
    },
    // 获取仓库列表
    async getWarehouses () {
      let page = this.pageList
      let keywords = ''
      let data = Object.assign(page, { keywords })
      let res = await this.$api.getWarehouses(data)
      this.warehouseTypeList = res.data.list
    },
    // 获取区域列表
    async getArea () {
      let page = this.pageList
      let mWmsWarehouseId = this.searchFrom.mWmsWarehouseBinWarehouseid
      let data = Object.assign({ mWmsWarehouseId }, page)
      let res = await this.$api.getArea(data)
      this.areaTypeList = res.data.list
      this.searchFrom.mWmsWarehouseBinAreaid = ''
      this.searchFrom.mWmsWarehouseBinShelfid = ''
    },
    async getShelf () {
      let page = this.pageList
      let mWmsWarehouseShelfAreaid = this.searchFrom.mWmsWarehouseBinAreaid
      let data = Object.assign({ mWmsWarehouseShelfAreaid }, page)
      let res = await this.$api.getShelf(data)
      this.shelfTypeList = res.data.list
      this.searchFrom.mWmsWarehouseBinShelfid = ''
    },
    async getBin () {
      const { keywords, page, searchFrom } = this
      const params = Object.assign({ keywords }, page, searchFrom)
      const res = await this.$api.getBin(params)
      this.$myPrompt.handleMsg(res, data => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    // 刷新数据，重新查询
    refreshData () {
      for (let i in this.searchFrom) {
        this.searchFrom[i] = ''
      }
      this.keywords = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getBin()
    },
    async deleteBin (id) {
      const ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm('确定删除当前选中的储位吗?')
        if (confirmRes) {
          const res = await this.$api.deleteBin(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getBin()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的储位！')
      }
    },
    async changeBinStatus () {
      const { selectList } = this
      if (selectList.length > 0) {
        const res = await this.$api.changeBinStatus(selectList)
        this.$myPrompt.handleMsg(res, () => {
          this.getBin()
        })
      } else {
        this.$message.warning('请先选择需要启用或停用的储位！')
      }
    },
    async updBinFrozen () {
      const { selectList } = this
      if (selectList.length > 0) {
        const res = await this.$api.updBinFrozen(selectList)
        this.$myPrompt.handleMsg(res, () => {
          this.getBin()
        })
      } else {
        this.$message.warning('请先选择需要解冻或冻结的储位！')
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getBin()
    this.getWarehouses()
  },
  components: {
    dialogFrom
  }
}
</script>
