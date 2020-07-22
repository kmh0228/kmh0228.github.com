<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">保养内容</div>
     <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:40%"></cascader-select>
        <dict-select v-model="searchForm.maintainFrequency" dictType="MAINTAIN_FREQUENCY"  style="width:40%;float:right" placeholder="请选择保养方式"></dict-select>
      </el-col>
      <el-col :span="12">
        <mes-select placeholder="请选择设备" v-model.trim="searchForm.resourceName"  style="float:right;width:40%" @keydown.enter.native="getMainitemTable" clearable  labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
      </el-col>
    </el-row>
     <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getMainitemTable">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handletable('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMainTain('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshTableData">刷新</el-button>
          <span class="split-line">|</span>
          <el-button size="mini"  :disabled="publisDisabled" @click="publishMaintain('1')">发布</el-button>
          <span class="split-line">|</span>
          <el-button size="mini"  :disabled="publisDisabled" @click="publishMaintain('0')">取消发布</el-button>
        </el-col>
        <el-col :span="12">
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange"   @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange"  @cell-click="cellClick">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="officeName"  sortable label="工厂" align="center"></el-table-column>
          <el-table-column prop="workKindId" sortable label="工种" align="center"></el-table-column>
          <el-table-column prop="typeCode" sortable min-width="130" label="设备类别代码" align="center"></el-table-column>
          <el-table-column prop="typeName" sortable min-width="130" label="设备类别名称" align="center"></el-table-column>
          <el-table-column prop="productionTimes" sortable width="100" label="生产次数" align="center"></el-table-column>
          <el-table-column prop="maintainDate" sortable min-width="130" label="保养日期" align="center" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="maintainStatus" sortable width="100" label="状态" align="center" :formatter="statusFormatter"></el-table-column>
          <el-table-column prop="isDowmtime" sortable width="100" label="是否停机" align="center" :formatter="isDowmtimeFormatter"></el-table-column>
          <el-table-column prop="planWorktime" sortable width="100" label="计划工时" align="center" ></el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteMainTain(scope.row.mMomMaintainitemId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="800px" class="handle-dialog">
        <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getMainitemTable="getMainitemTable" ></dialog-form>
      </el-dialog>
      <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="保养项目明细" name="maintainContent">
              <el-row class="mes-table-handle">
                <el-col :span="12">
                  <el-button size="mini" @click="handleDetailtable('')">新增保养项目明细</el-button>
                  <span class="split-line">|</span>
                  <el-button size="mini"  @click="deleteDetailMainTain('')">批量删除</el-button>
                </el-col>
                <el-col :span="12">
                    <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                      layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                    @current-change="handleCurrentChange1"   @size-change="handleSizeChange1">
                  </el-pagination>
                </el-col>
              </el-row>
              <div class="mes-table-content" >
                <el-table :data="detailData"  size="mini" border highlight-current-row  @selection-change="selectionDetailChange" @cell-click="cellDetailClick">
                  <el-table-column type="selection" width="50" align="center"></el-table-column>
                  <el-table-column type="index" label="序号" align="center" ></el-table-column>
                  <el-table-column label="保养内容" align="center" prop="maintainContent"></el-table-column>
                  <el-table-column label="保养方法" align="center" prop="maintainMethod"></el-table-column>
                  <el-table-column label="附件" align="center" prop="attachment" label-class-name="mes-table-label" class-name="mes-table-click" :formatter="downFormatter"></el-table-column>
                  <el-table-column label="标准时长（分）" align="center" prop="standardTime"></el-table-column>
                  <el-table-column label="操作" align="center" >
                    <template slot-scope="scope">
                      <handle-button @click="handleDetailtable(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
                      <handle-button @click="deleteDetailMainTain(scope.row.mMomMaintainitemDetailId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          <el-dialog :visible.sync="dialogDetailVisible" :title="dialogDetailTitle"  width="1000px" class="handle-dialog">
            <detail-dialog v-if="dialogDetailVisible" ref="detailDialog" :isDetailEdit="isDetailEdit" @detailDialogCannel="detailDialogCannel" @getMainitemDetailTable="getMainitemDetailTable" :mMomMaintainitemId="mMomMaintainitemId"></detail-dialog>
          </el-dialog>
          </el-tab-pane>
           <el-tab-pane label="设备明细" name="equipmentDetails">
            <div class="mes-table">
                <el-row class="mes-table-handle">
                  <!-- <el-col :span="12">
                    <el-button size="mini" @click="refreshCheckitemResource">重新导入设备</el-button>
                  </el-col> -->
                  <el-col :span="12" style="float:right">
                    <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                        layout="total, sizes, prev, pager, next, jumper, ->" :total="total2"
                      @current-change="handleCurrentChange2"   @size-change="handleSizeChange2">
                    </el-pagination>
                  </el-col>
                </el-row>
                <div class="mes-table-content">
                  <el-table :data="resourceData" border highlight-current-row size="mini" @selection-change="deviceSelectionChange">
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column prop="lineCode" sortable label="线别" align="center"></el-table-column>
                    <el-table-column prop="resourceName" sortable label="设备代码" align="center"></el-table-column>
                    <el-table-column prop="resourceName" sortable label="设备名称" align="center"></el-table-column>
                  </el-table>
                </div>
              </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import detailDialog from './detailDialog'

export default {
  data () {
    return {
      searchForm: {
        officeCode: '',
        maintainFrequency: '',
        resourceName: ''
      },
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      page2: {
        pageSize: 10,
        pageIndex: 1
      },
      total2: 0,
      tableData: [],
      isEdit: false,
      isDetailEdit: false,
      showTabs: false,
      activeName: 'maintainContent',
      detailData: [],
      editDetail: false,
      resourceData: [],
      dialogVisible: false,
      dialogDetailVisible: false,
      selectedList: [],
      selectedDetailList: [],
      mMomMaintainitemId: ''
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑保养内容' : '新增保养内容'
    },
    dialogDetailTitle () {
      return this.isDetailEdit ? '编辑保养项目明细' : '新增保养项目明细'
    },
    publisDisabled () {
      return this.selectedList.length === 0
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getMainitemTable()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getMainitemTable()
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.page1
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange1 (size) {
      this.page1.pageSize = size
      this.findCheckitemDetailList()
    },
    handleSizeChange1 (index) {
      this.page1.pageIndex = index
      this.findCheckitemDetailList()
    },
    indexMethod2 (index) {
      let { pageIndex, pageSize } = this.page2
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange2 (size) {
      this.page2.pageSize = size
    },
    handleSizeChange2 (index) {
      this.page2.pageIndex = index
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    statusFormatter (row, column, cellValue, index) {
      return cellValue === '0' ? '未发布' : '已发布'
    },
    isDowmtimeFormatter (row, column, cellValue, index) {
      return cellValue ? '已停机' : '未停机'
    },
    downFormatter (row, column, cellValue, index) {
      return cellValue ? '下载' : ''
    },
    refreshTableData () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageSize: 10,
        pageIndex: 1
      }
      this.getMainitemTable()
    },
    // 获取保养内容主表
    async getMainitemTable () {
      let data = Object.assign(this.searchForm, this.page)
      let res = await this.$api.getMaintainItem(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 获取保养项目明细表
    async getMainitemDetailTable (mMomMaintainitemId) {
      let { page1 } = this
      let data = Object.assign(page1, { mMomMaintainitemId })
      let res = await this.$api.getMaintainDetailItem(data)
      if (res.code === '200') {
        this.total1 = res.data.totalNum
        this.detailData = res.data.list
      } else {
        this.total1 = 0
        this.detailData = []
      }
    },
    // 获取设备明细
    async getMaintainResource (mMomMaintainitemDetailId) {
      let { page2 } = this
      let data = Object.assign(page2, { mMomMaintainitemDetailId })
      let res = await this.$api.getMaintainResource(data)
      if (res.code === '200') {
        this.total2 = res.data.totalNum
        this.resourceData = res.data.list
      } else {
        this.total2 = 0
        this.resourceData = []
      }
    },
    tableSelectionChange (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mMomMaintainitemId)
      })
    },
    selectionDetailChange (selection) {
      this.selectedDetailList = []
      selection.forEach(val => {
        this.selectedDetailList.push(val.mMomMaintainitemDetailId)
      })
    },
    // 发布和取消保养内容
    async  publishMaintain (maintainStatus) {
      let mMomMaintainitemIds = this.selectedList
      const data = Object.assign({ maintainStatus, mMomMaintainitemIds })
      let res = await this.$api.publishMaintain(data)
      this.$myPrompt.handleMsg(res, () => {
        this.getMainitemTable()
      })
    },
    cellClick (row, column, cell, event) {
      this.showTabs = true
      this.getMainitemDetailTable(row.mMomMaintainitemId)
      this.getMaintainResource(row.mMomMaintainitemId)
      this.mMomMaintainitemId = row.mMomMaintainitemId
    },
    cellDetailClick (row, column, cell, event) {
      if (column.property === 'attachment') {
        if (row.attachment) {
          let aLink = document.createElement('a')
          aLink.href = `http://10.157.138.206:8989/dfs/dfsFile/downloadFile?fileId=${row.attachment}`
          aLink.click()
        }
      }
    },
    handletable (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mMomMaintainitemId = row.mMomMaintainitemId
        })
      } else {
        this.isEdit = false
      }
    },
    handleDetailtable (row) {
      this.dialogDetailVisible = true
      if (row) {
        this.isDetailEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.detailDialog.detailForm)
          this.$refs.detailDialog.detailForm = this.$global.filterForm(row, keys)
          this.$refs.detailDialog.detailForm.mMomMaintainitemDetailId = row.mMomMaintainitemDetailId
        })
      } else {
        this.isDetailEdit = false
      }
    },
    // 重新导入设备
    // async  refreshCheckitemResource () {
    //   let mMomCheckitemId = this.mMomMaintainitemId
    //   const data = Object.assign({ mMomCheckitemId })
    //   let res = await this.$api.refreshCheckitemResource(data)
    //   this.$myPrompt.handleMsg(res, () => {
    //     this.resourceData = res.data.list
    //   })
    // },
    cannel () {
      this.dialogVisible = false
    },
    detailDialogCannel () {
      this.dialogDetailVisible = false
    },
    // 删除保养内容
    async deleteMainTain (id) {
      let ids = id ? [id] : this.selectedList
      let len = ids.length
      if (ids.length > 0) {
        let text = id ? '当前' : '选中'
        let confirmRes = await this.$myPrompt.confirm(`确定删除${text}的保养内容吗？`)
        if (confirmRes) {
          let res = await this.$api.deleteMaintainitem(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.getMainitemTable()
            this.showTabs = false
          })
        }
      } else {
        this.$message.warning('请选择需要删除的保养内容！')
      }
    },
    // 删除保养内容明细
    async deleteDetailMainTain (id) {
      let ids = id ? [id] : this.selectedDetailList
      if (ids.length > 0) {
        let text = id ? '当前' : '选中'
        let confirmRes = await this.$myPrompt.confirm(`确定删除${text}的保养内容明细吗？`)
        if (confirmRes) {
          let res = await this.$api.deleteMaintainDetail(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getMainitemDetailTable(this.mMomMaintainitemId)
          })
        }
      } else {
        this.$message.warning('请选择需要删除的保养内容明细！')
      }
    }
  },
  components: {
    dialogForm, detailDialog
  },
  created () {
    this.getMainitemTable()
  }
}

</script>
