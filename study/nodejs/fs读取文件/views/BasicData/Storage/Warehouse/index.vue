<template>
<div class="mes-main mes-work-order">
  <div class="mes-main-title">仓库管理</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input placeholder="请输入仓库代码" v-model.trim="keywords" size="mini" style="width:40%" @keydown.enter.native="getWarehouses">
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getWarehouses">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleDialog('warehouseDialog','warehouse','')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteWarehouse('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
          layout="total,sizes,prev,pager,next,jumper,->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange" @current-change="tableCurrentChange" @cell-click="cellClick">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod" sortable></el-table-column>
        <el-table-column prop="mWmsWarehouseCode" label="仓库代码"  align="center" sortable></el-table-column>
        <el-table-column prop="mWmsWarehouseName" label="仓库名称" align="center" sortable></el-table-column>
        <el-table-column prop="dictName" label="仓库类型" align="center" sortable></el-table-column>
        <el-table-column prop="mWmsWarehouseAdmin" label="管理员" align="center" sortable></el-table-column>
        <el-table-column prop="mWmsWarehouseRatio" label="使用情况" align="center" sortable></el-table-column>
        <el-table-column prop="picking" label="是否拣货" align="center" sortable>
          <template slot-scope="scope">
              {{scope.row.picking === 1 ? '否' : '是' }}
            </template>
        </el-table-column>
        <el-table-column prop="frozen" label="是否冻结" align="center"  sortable>
          <template slot-scope="scope">
              {{scope.row.frozen === 1 ? '冻结' : '未冻结' }}
            </template>
        </el-table-column>
        <el-table-column prop="invalid" label="是否启用" align="center" :formatter="formatter" sortable></el-table-column>
        <!-- <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createdDt" label="创建时间" align="center"></el-table-column> -->
        <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <handle-button @click="handleDialog('warehouseDialog','warehouse',scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteWarehouse(scope.row.mWmsWarehouseId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="mes-main-tabs" v-if="showAreaTabs">
    <el-tabs v-model="areaActiveName">
      <el-tab-pane label="区域维护" name="area">
         <div class="mes-table">
          <el-row class="mes-table-handle">
            <!-- <el-col :span="12">
              <el-button size="mini" icon="el-icon-plus"  @click="handleDialog('areaDialog','area','')">新增</el-button>
              <span class="split-line">|</span>
              <el-button size="mini" icon="el-icon-delete-solid" @click="deleteArea('')">批量删除</el-button>
            </el-col> -->
            <el-col :span="12" :offset="12">
              <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
                layout="total,sizes,prev,pager,next,jumper,->" :total="total1"
                @current-change="handleCurrentChange1" @size-change="handleSizeChange1"></el-pagination>
            </el-col>
          </el-row>
          <div class="mes-table-content">
            <el-table :data="areaData" border highlight-current-row size="mini" @selection-change="tableSelectionChange1" @current-change="tableCurrentChange1"  @cell-click="cellClick1">
              <el-table-column type="selection" width="50" align="center" ></el-table-column>
              <el-table-column type="index" label="序号" align="center" :index="indexMethod1"></el-table-column>
              <el-table-column prop="mWmsWarehouseAreaCode" label="区域代码" align="center" sortable></el-table-column>
              <el-table-column prop="mWmsWarehouseAreaName" label="区域名称" align="center" sortable></el-table-column>
              <el-table-column prop="fName" label="功能作用" align="center" sortable></el-table-column>
              <el-table-column prop="cName" label="存储环境" align="center" sortable></el-table-column>
              <el-table-column prop="vName" label="存储贵重类型" align="center" sortable></el-table-column>
              <el-table-column prop="mWmsWarehouseAreaUse" label="储位使用情况" align="center" sortable></el-table-column>
              <!-- <el-table-column label="操作" align="center" width="120" >
                <template slot-scope="scope">
                  <handle-button @click="handleDialog('areaDialog','area',scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
                  <handle-button @click="deleteArea(scope.row.mWmsWarehouseAreaId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="仓库关联用户" name="adssociatedUsers">
         <adssociated-users :mWmsWarehouseId="mWmsWarehouseId"></adssociated-users>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!-- <div class="mes-main-tabs" v-if="showShelfTabs" >
    <el-tabs v-model="shelfActiveName">
      <el-tab-pane label="货架维护" name="shelf" >
         <div class="mes-table">
          <el-row class="mes-table-handle">
            <el-col :span="12">
              <el-button size="mini" icon="el-icon-plus"  @click="handleDialog('shelfDialog','shelf','')">新增</el-button>
              <span class="split-line">|</span>
              <el-button size="mini" icon="el-icon-delete-solid" @click="deleteShelf('')">批量删除</el-button>
            </el-col>
             <el-col :span="12">
              <el-pagination background :page-size="page2.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
                layout="total,sizes,prev,pager,next,jumper,->" :total="total2"
                @current-change="handleCurrentChange2" @size-change="handleSizeChange2"></el-pagination>
            </el-col>
          </el-row>
          <div class="mes-table-content">
            <el-table :data="shelfData" border highlight-current-row size="mini" @selection-change="tableSelectionChange2"  >
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center" :index="indexMethod2"></el-table-column>
              <el-table-column prop="mWmsWarehouseShelfCode" label="货架编号" align="center" sortable></el-table-column>
              <el-table-column prop="dictName" label="货架类型" align="center" sortable></el-table-column>
              <el-table-column prop="mWmsWarehouseShelfNumber" label="储位个数" align="center" sortable></el-table-column>
              <el-table-column prop="mWmsWarehouseShelfUse" label="储位使用情况" align="center" sortable></el-table-column>
              <el-table-column label="操作" align="center" width="120" >
                <template slot-scope="scope">
                  <handle-button @click="handleDialog('shelfDialog','shelf',scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
                  <handle-button @click="deleteShelf(scope.row.mWmsWarehouseShelfId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div> -->
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" class="handle-dialog" >
    <component v-if="dialogVisible" :is="dialogComponent" @cannel="cannel" ref="dialog" :isEdit="isEdit" @getWarehouses="getWarehouses"  @getArea="getArea(mWmsWarehouseId)" :mWmsWarehouseId="mWmsWarehouseId" :mWmsWarehouseAreaId="mWmsWarehouseAreaId" @getShelf="getShelf(mWmsWarehouseAreaId)"></component>
  </el-dialog>
</div>
</template>

<script>
import warehouseDialog from './warehouseDialog'
import areaDialog from './areaDialog'
import shelfDialog from './shelfDialog'
import adssociatedUsers from './adssociatedUsers'

export default {
  data () {
    return {
      // 1是区域的  2是货架的
      keywords: '',
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      page2: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      total1: 0,
      total2: 0,
      tableData: [],
      selectList: [],
      selectList1: [],
      selectList2: [],
      isEdit: false,
      mWmsWarehouseId: '',
      dialogVisible: false,
      usersVisible: false,
      dialogComponent: '',
      dialogType: '',
      areaActiveName: 'area',
      shelfActiveName: 'shelf',
      areaData: [],
      mWmsWarehouseAreaId: '',
      shelfData: [],
      handlTypeName: ''
    }
  },
  computed: {
    showAreaTabs () {
      return !!this.mWmsWarehouseId
    },
    showShelfTabs () {
      return !!this.mWmsWarehouseAreaId
    },
    dialogTitle () {
      let handlename = this.isEdit ? '编辑' : '新增'
      let { dialogType, handlTypeName } = this
      if (dialogType === 'warehouse') {
        handlTypeName = '仓库信息'
      } else if (dialogType === 'area') {
        handlTypeName = '区域信息'
      } else {
        handlTypeName = '货架信息'
      }
      return `${handlename}${handlTypeName}`
    }
  },
  methods: {
    refreshPage () { },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    indexMethod2 (index) {
      let { pageIndex, pageSize } = this.page2
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (size) {
      this.page.pageSize = size
      this.getWarehouses()
    },
    handleSizeChange (index) {
      this.page.pageIndex = index
      this.getWarehouses()
    },
    handleCurrentChange1 (size) {
      this.page1.pageSize = size
      this.getArea(this.mWmsWarehouseId)
    },
    handleSizeChange1 (index) {
      this.page1.pageIndex = index
      this.getArea(this.mWmsWarehouseId)
    },
    handleCurrentChange2 (size) {
      this.page2.pageSize = size
      this.getShelf(this.mWmsWarehouseAreaId)
    },
    handleSizeChange2 (index) {
      this.page2.pageIndex = index
      this.getShelf(this.mWmsWarehouseAreaId)
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(select => {
        this.selectList.push(select.mWmsWarehouseId)
      })
    },
    tableSelectionChange1 (selection) {
      this.selectList1 = []
      selection.map(select => {
        this.selectList1.push(select.mWmsWarehouseAreaId)
      })
    },
    tableSelectionChange2 (selection) {
      this.selectList2 = []
      selection.map(select => {
        this.selectList2.push(select.mWmsWarehouseShelfId)
      })
    },
    tableCurrentChange (row) {
      if (row) {
        this.mWmsWarehouseId = row.mWmsWarehouseId
      }
    },
    tableCurrentChange1 (row) {
      if (row) {
        this.mWmsWarehouseAreaId = row.mWmsWarehouseAreaId
      }
    },
    cellClick (row, column, cell, event) {
      this.mWmsWarehouseId = row.mWmsWarehouseId
      this.mWmsWarehouseAreaId = ''
      // let { mWmsWarehouseId } = row
      this.getArea(this.mWmsWarehouseId)
    },
    cellClick1 (row, column, cell, event) {
      let { mWmsWarehouseAreaId } = row
      this.getShelf(mWmsWarehouseAreaId)
    },
    formatter (row) {
      return row.invalid ? '是' : '否'
    },
    // 获取仓库信息
    async getWarehouses () {
      let { keywords, page } = this
      let data = Object.assign({ keywords }, page)
      let res = await this.$api.getWarehouses(data)
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
      this.keywords = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getWarehouses()
    },
    // 根据仓库获取区域信息
    async getArea (mWmsWarehouseId) {
      let { page1 } = this
      let data = Object.assign({ mWmsWarehouseId }, page1)
      let res = await this.$api.getArea(data)
      if (res.code === '200') {
        this.total1 = res.data.totalNum
        this.areaData = res.data.list
      } else {
        this.total1 = 0
        this.areaData = []
      }
    },
    // 根据区域获取货架信息
    async getShelf (mWmsWarehouseAreaId) {
      let { page2 } = this
      let mWmsWarehouseShelfAreaid = mWmsWarehouseAreaId
      let data = Object.assign({ mWmsWarehouseShelfAreaid }, page2)
      let res = await this.$api.getShelf(data)
      if (res.code === '200') {
        this.total2 = res.data.totalNum
        this.shelfData = res.data.list
      } else {
        this.total2 = 0
        this.shelfData = []
      }
    },
    // 删除仓库信息
    async deleteWarehouse (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的仓库信息吗?')
        if (confirmRes) {
          let res = await this.$api.deleteWarehouses(ids)
          let { msg, code } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getWarehouses()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择要删除的仓库信息')
      }
    },
    // 删除区域信息
    async deleteArea (id) {
      let { selectList1, mWmsWarehouseId } = this
      let ids = id ? [id] : selectList1
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的区域信息吗')
        if (confirmRes) {
          let res = await this.$api.deleteArea(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getArea(mWmsWarehouseId)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择要删除的区域信息')
      }
    },
    // 删除货架信息
    async deleteShelf (id) {
      let { selectList2, mWmsWarehouseAreaId } = this
      let ids = id ? [id] : selectList2
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm('确定要删除当前选中的货架信息')
        if (confirmRes) {
          let res = await this.$api.deleteShelf(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getShelf(mWmsWarehouseAreaId)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择要删除的货架信息')
      }
    },
    handleDialog (dialogName, type, row) {
      this.dialogComponent = dialogName
      this.dialogType = type
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        if (type === 'warehouse') {
          // let { selectList, tableData } = this
          // let mWmsWarehouseId = selectList[0]
          // selectObj = tableData.filter(item => {
          //   return item.mWmsWarehouseId === mWmsWarehouseId
          // })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.wareHouseForm)
            this.$refs.dialog.wareHouseForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.wareHouseForm.mWmsWarehouseId = row.mWmsWarehouseId
          })
        } else if (type === 'area') {
          // let { selectList1, areaData } = this
          // let mWmsWarehouseAreaId = selectList1[0]
          // selectObj = areaData.filter(item => {
          //   return item.mWmsWarehouseAreaId === mWmsWarehouseAreaId
          // })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.areaForm)
            this.$refs.dialog.areaForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.areaForm.mWmsWarehouseAreaId = row.mWmsWarehouseAreaId
          })
        } else if (type === 'shelf') {
          // let { selectList2, shelfData } = this
          // let mWmsWarehouseShelfId = selectList2[0]
          // selectObj = shelfData.filter(item => {
          //   return item.mWmsWarehouseShelfId === mWmsWarehouseShelfId
          // })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.shelfForm)
            this.$refs.dialog.shelfForm = this.$global.filterForm(row, keys)
            this.$refs.dialog.shelfForm.mWmsWarehouseShelfId = row.mWmsWarehouseShelfId
          })
        }
      } else {
        this.isEdit = false
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    warehouseDialog, areaDialog, shelfDialog, adssociatedUsers
  },
  created () {
    this.getWarehouses()
  }
}
</script>
