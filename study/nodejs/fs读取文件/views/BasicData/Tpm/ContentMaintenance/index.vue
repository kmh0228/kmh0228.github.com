<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('contentMainT_MaintCont')}}</div>
     <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:40%"></cascader-select>
        <dict-select v-model="searchForm.maintainFrequency" dictType="MAINTAIN_FREQUENCY"  style="width:40%;float:right" :placeholder="$t('contentMainT_selecMainMeth')"></dict-select>
      </el-col>
      <el-col :span="12">
        <mes-select :placeholder="$t('contentMainT_selecDevi')" v-model.trim="searchForm.resourceName"  style="float:right;width:40%" @keydown.enter.native="getMainitemTable" clearable  labelKey="resourceName" valueKey="mMomResourceId" method="findResourceList"></mes-select>
      </el-col>
    </el-row>
     <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getMainitemTable">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handletable('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMainTain('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshTableData">{{$t('common_Refresh')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini"  :disabled="publisDisabled" @click="publishMaintain('1')">{{$t('contentMainT_relea')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini"  :disabled="publisDisabled" @click="publishMaintain('0')">{{$t('contentMainT_Cancelpub')}}</el-button>
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
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="officeName"  sortable :label="$t('common_Factory')" align="center"></el-table-column>
          <el-table-column prop="workKindId" sortable :label="$t('common_TypeWork')" align="center"></el-table-column>
          <el-table-column prop="typeCode" sortable min-width="130" :label="$t('contentMainT_EquipCateCode')" align="center"></el-table-column>
          <el-table-column prop="typeName" sortable min-width="130" :label="$t('common_EquipCateName')" align="center"></el-table-column>
          <el-table-column prop="productionTimes" sortable width="100" :label="$t('contentMainT_ProduTime')" align="center"></el-table-column>
          <el-table-column prop="maintainDate" sortable min-width="130" :label="$t('contentMainT_MaintDate')" align="center" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="maintainStatus" sortable width="100" :label="$t('common_Status')" align="center" :formatter="statusFormatter"></el-table-column>
          <el-table-column prop="isDowmtime" sortable width="100" :label="$t('contentMainT_ShutdOrNot')" align="center" :formatter="isDowmtimeFormatter"></el-table-column>
          <el-table-column prop="planWorktime" sortable width="100" :label="$t('contentMainT_PlannHour')" align="center" ></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteMainTain(scope.row.mMomMaintainitemId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="800px" class="handle-dialog">
        <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getMainitemTable="getMainitemTable" ></dialog-form>
      </el-dialog>
      <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('contentMainT_DetaiMainItem')" name="maintainContent">
              <el-row class="mes-table-handle">
                <el-col :span="12">
                  <el-button size="mini" @click="handleDetailtable('')">{{$t('contentMainT_DetaiNewMainItem')}}</el-button>
                  <span class="split-line">|</span>
                  <el-button size="mini"  @click="deleteDetailMainTain('')">{{$t('common_Delete')}}</el-button>
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
                  <el-table-column type="index" :label="$t('common_Number')" align="center" ></el-table-column>
                  <el-table-column :label="$t('contentMainT_MaintCont')" align="center" prop="maintainContent"></el-table-column>
                  <el-table-column :label="$t('contentMainT_MaintMeth')" align="center" prop="maintainMethod"></el-table-column>
                  <el-table-column :label="$t('common_enclo')" align="center" prop="attachment" label-class-name="mes-table-label" class-name="mes-table-click" :formatter="downFormatter"></el-table-column>
                  <el-table-column :label="$t('contentMainT_StandDuraMin')" align="center" prop="standardTime"></el-table-column>
                  <el-table-column :label="$t('common_Operate')" align="center" >
                    <template slot-scope="scope">
                      <handle-button @click="handleDetailtable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
                      <handle-button @click="deleteDetailMainTain(scope.row.mMomMaintainitemDetailId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          <el-dialog :visible.sync="dialogDetailVisible" :title="dialogDetailTitle"  width="1000px" class="handle-dialog">
            <detail-dialog v-if="dialogDetailVisible" ref="detailDialog" :isDetailEdit="isDetailEdit" @detailDialogCannel="detailDialogCannel" @getMainitemDetailTable="getMainitemDetailTable" :mMomMaintainitemId="mMomMaintainitemId"></detail-dialog>
          </el-dialog>
          </el-tab-pane>
           <el-tab-pane :label="$t('contentMainT_EquipDeta')" name="equipmentDetails">
            <div class="mes-table">
                <el-row class="mes-table-handle">
                  <!-- <el-col :span="12">
                    <el-button size="mini" @click="refreshCheckitemResource">{{$t('contentMainT_ReImpoDevi')}}</el-button>
                  </el-col> -->
                  <el-col :span="12" style="float:right">
                    <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                        layout="total, sizes, prev, pager, next, jumper, ->" :total="total2"
                      @current-change="handleCurrentChange2"   @size-change="handleSizeChange2">
                    </el-pagination>
                  </el-col>
                </el-row>
                <div class="mes-table-content">
                  <el-table :data="resourceData" border highlight-current-row size="mini">
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column prop="lineCode" sortable :label="$t('common_Line')" align="center"></el-table-column>
                    <el-table-column prop="resourceName" sortable :label="$t('common_EquipCode')" align="center"></el-table-column>
                    <el-table-column prop="resourceName" sortable :label="$t('common_EquipName')" align="center"></el-table-column>
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
      return this.isEdit ? this.$t('contentMainT_EditMainCont') : this.$t('contentMainT_NewMainCont')
    },
    dialogDetailTitle () {
      return this.isDetailEdit ? this.$t('contentMainT_EditMainItemDeta') : this.$t('contentMainT_DetaiNewMainItem')
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
      return cellValue === '0' ? this.$t('contentMainT_Unpub') : this.$t('contentMainT_Publi')
    },
    isDowmtimeFormatter (row, column, cellValue, index) {
      return cellValue ? this.$t('contentMainT_ShutDown') : this.$t('contentMainT_NoShut')
    },
    downFormatter (row, column, cellValue, index) {
      return cellValue ? this.$t('common_downLoad') : ''
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
        let text = id ? this.$t('contentMainT_curre') : this.$t('contentMainT_Selec')
        let confirmRes = await this.$myPrompt.confirm(this.$t('contentMainT_AreYouSureDele') + text + this.$t('contentMainT_theMain'))
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
        this.$message.warning(this.$t('contentMainT_selecMainContBeDele'))
      }
    },
    // 删除保养内容明细
    async deleteDetailMainTain (id) {
      let ids = id ? [id] : this.selectedDetailList
      if (ids.length > 0) {
        let text = id ? this.$t('contentMainT_curre') : this.$t('contentMainT_Selec')
        let confirmRes = await this.$myPrompt.confirm(this.$t('contentMainT_AreYouSureDele') + text + this.$t('contentMainT_sMainContDeta'))
        if (confirmRes) {
          let res = await this.$api.deleteMaintainDetail(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getMainitemDetailTable(this.mMomMaintainitemId)
          })
        }
      } else {
        this.$message.warning(this.$t('contentMainT_selecMainDetaBeDele'))
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
