<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">{{$t('inspecItem_SpotInspProjMana')}}</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
       <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1" @change="findCheckitemList"></cascader-select>
    </el-col>
    <el-col :span="12">
      <el-input :placeholder="$t('inspecItem_EquipCate')"  v-model="searchForm.typeCode"  style="width:40%;float:right"></el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="findCheckitemList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus" @click="handletable('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTable('','')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" :disabled="publisDisabled" @click="publishCheckitem('1')">{{$t('inspecItem_relea')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" :disabled="publisDisabled" @click="publishCheckitem('0')">{{$t('inspecItem_calcelPub')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="findCheckitemList">{{$t('common_Refresh')}}</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange" @cell-click="cellClick">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName" sortable :label="$t('common_Factory')" align="center"></el-table-column>
        <el-table-column prop="dictWorkKind" sortable :label="$t('common_TypeWork')" align="center"></el-table-column>
        <el-table-column prop="typeCode" sortable width="120" :label="$t('inspecItem_EquipCateCode')" align="center"></el-table-column>
        <el-table-column prop="typeName" sortable width="120" :label="$t('common_EquipCateName')" align="center"></el-table-column>
        <el-table-column prop="frequency" sortable width="100" :label="$t('common_SpotChecFreq')" align="center" :formatter="frequencyFromatter"></el-table-column>
        <el-table-column prop="time" sortable width="100" :label="$t('inspecItem_SpotChecTime')" align="center"></el-table-column>
        <el-table-column prop="date" sortable width="100" :label="$t('inspecItem_SpotChecDate')" align="center" :formatter="dateFromatter"></el-table-column>
        <el-table-column prop="status" sortable :label="$t('common_Status')" align="center" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="isautogenerate" sortable width="155" :label="$t('inspecItem_WhethGeneADocuAuto')" :formatter="autogenerateFromatter" align="center"></el-table-column>
        <el-table-column prop="standardTime" sortable width="120" :label="$t('inspecItem_StandSpotChecDura')" align="center"></el-table-column>
        <el-table-column prop="remark" sortable :label="$t('common_remarks')" align="center"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteTable(scope.row.mMomCheckitemId,scope.row.status)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="1000px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @findCheckitemList="findCheckitemList"  ></dialog-form>
  </el-dialog>
   <div class="mes-main-tabs" v-if="troubleDetail">
      <el-tabs v-model="activeName" >
      <el-tab-pane :label="$t('inspecItem_DetaiSpotChecItem')" name="checkItemDetails">
          <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" @click="handleDetailtable('')">{{$t('inspecItem_DetaiNewlAddeChecItem')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini"  @click="deleteDetailTable('')">{{$t('common_Delete')}}</el-button>
              </el-col>
              <el-col :span="12" >
                <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                    layout="total, sizes, prev, pager, next, jumper, ->" :total="total1"
                  @current-change="handleCurrentChange1"   @size-change="handleSizeChange1">
                </el-pagination>
              </el-col>
            </el-row>
             <div class="mes-table-content">
              <el-table :data="checkDetailData" border highlight-current-row size="mini"  @selection-change="tableDetailSelectionChange">
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod1"></el-table-column>
                <el-table-column prop="item" sortable :label="$t('inspecItem_SpotChecMode')" align="center"></el-table-column>
                <el-table-column prop="detail" sortable :label="$t('inspecItem_SpotChecCont')" align="center"></el-table-column>
                <el-table-column prop="method" sortable :label="$t('inspecItem_SpotChecMeth')" align="center"></el-table-column>
                <el-table-column prop="dictStatus" sortable :label="$t('inspecItem_EquipStat')" align="center"></el-table-column>
                <el-table-column prop="lowerValue" sortable :label="$t('inspecItem_LowerLimi')" align="center"></el-table-column>
                <el-table-column prop="upperValue" sortable :label="$t('inspecItem_UpperLimi')" align="center"></el-table-column>
                <el-table-column prop="remark" sortable :label="$t('common_remarks')" align="center"></el-table-column>
                <el-table-column prop="creator" sortable :label="$t('common_Creator')" ></el-table-column>
                <el-table-column :label="$t('common_Operate')" align="center" width="120">
                  <template slot-scope="scope">
                    <handle-button @click="handleDetailtable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
                    <handle-button @click="deleteDetailTable(scope.row.mMomCheckitemDetailId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-dialog :visible.sync="detailDialogVisible" :title="detaildialogTitle"  width="1000px" class="handle-dialog">
                <detail-dialog v-if="detailDialogVisible" ref="detailDialog" @detailDialogCannel="detailDialogCannel" :isDetailEdit="isDetailEdit" :mMomCheckitemId="onCheckitemId" @findCheckitemDetailList="findCheckitemDetailList"></detail-dialog>
              </el-dialog>
            </div>
          </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('inspecItem_EquipDeta')" name="equipmentDetails">
         <div class="mes-table">
            <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" @click="refreshCheckitemResource">{{$t('inspecItem_ReImpoDevi')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini"  @click="deletedeviceTable('')">{{$t('common_Delete')}}</el-button>
              </el-col>
              <el-col :span="12">
                <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
                    layout="total, sizes, prev, pager, next, jumper, ->" :total="total2"
                  @current-change="handleCurrentChange2"   @size-change="handleSizeChange2">
                </el-pagination>
              </el-col>
            </el-row>
             <div class="mes-table-content">
              <el-table :data="deviceTableData" border highlight-current-row size="mini" @selection-change="deviceSelectionChange">
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod2"></el-table-column>
                <el-table-column prop="lineCode" sortable :label="$t('common_Line')" align="center"></el-table-column>
                <el-table-column prop="resourceCode" sortable :label="$t('common_EquipCode')" align="center"></el-table-column>
                <el-table-column prop="resourceName" sortable :label="$t('common_EquipName')" align="center"></el-table-column>
                  <el-table-column :label="$t('common_Operate')" align="center" width="120">
                  <template slot-scope="scope">
                    <handle-button @click="deletedeviceTable(scope.row.mMomCheckitemResourceId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
      </el-tab-pane>
      </el-tabs>
     </div>
</div>
</template>

<script>
import dialogForm from './dialogForm'
import detailDialog from './detailDialog'
export default {
  data () {
    return {
      // 0是点检项目   1是点检项目明细   2设备明细
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
      isEdit: false,
      isDetailEdit: false,
      tableData: [],
      checkDetailData: [],
      deviceTableData: [],
      dialogVisible: false,
      detailDialogVisible: false,
      searchForm: {
        officeCode: '',
        typeCode: '',
        queryLevel: 1
      },
      selectList: [],
      troubleDetail: false,
      activeName: 'checkItemDetails',
      failReasonList: [],
      onCheckitemId: '',
      selectDetailList: [],
      selcetStatusList: [],
      selectDeviceList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('inspecItem_EditChecItem') : this.$t('inspecItem_NewlyAddeSpotChecItem')
    },
    publisDisabled () {
      return this.selectList.length === 0
    },
    detaildialogTitle () {
      return this.isDetailEdit ? this.$t('inspecItem_EditChecItemDeta') : this.$t('inspecItem_DetaiNewlAddeChecItem')
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
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
    tableSelectionChange (selection) {
      this.selectList = []
      this.selcetStatusList = []
      selection.map(item => {
        this.selectList.push(item.mMomCheckitemId)
        this.selcetStatusList.push(item.status)
      })
    },
    tableDetailSelectionChange (selection) {
      this.selectDetailList = []
      selection.map(item => {
        this.selectDetailList.push(item.mMomCheckitemDetailId)
      })
    },
    deviceSelectionChange (selection) {
      this.selectDeviceList = []
      selection.map(item => {
        this.selectDeviceList.push(item.mMomCheckitemResourceId)
      })
    },
    frequencyFromatter (row, column, cellValue, index) {
      return cellValue === '1' ? this.$t('common_day') + '/' + this.$t('inspecItem_SpotChec') : cellValue === '2' ? this.$t('common_week') + '/' + this.$t('inspecItem_SpotChec') : this.$t('common_month') + '/' + this.$t('inspecItem_SpotChec')
    },
    dateFromatter (row, column, cellValue, index) {
      if (cellValue === 'Mon') {
        return this.$t('inspecItem_Monda')
      } else if (cellValue === 'Tues') {
        return this.$t('inspecItem_Tuesd')
      } else if (cellValue === 'Wed') {
        return this.$t('inspecItem_Wedne')
      } else if (cellValue === 'Thur') {
        return this.$t('inspecItem_Thurs')
      } else if (cellValue === 'Fri') {
        return this.$t('inspecItem_Frida')
      } else if (cellValue === 'Sat') {
        return this.$t('inspecItem_Satur')
      } else if (cellValue === 'Sun') {
        return this.$t('inspecItem_Sunda')
      } else {
        return cellValue
      }
    },
    autogenerateFromatter (row, column, cellValue, index) {
      return cellValue ? this.$t('common_Yes') : this.$t('common_No')
    },
    statusFormatter (row, column, cellValue, index) {
      return cellValue === '0' ? this.$t('inspecItem_Unpub') : this.$t('inspecItem_Publi')
    },
    cellClick (row, column, cell, event) {
      this.troubleDetail = true
      this.onCheckitemId = row.mMomCheckitemId
      this.findCheckitemDetailList()
      this.findCheckitemResourceList()
    },

    // 获取故障原因代码
    async getTpmFailReasonList () {
      const params = {
        pageSize: 10,
        pageIndex: 1,
        failReason: '',
        officeCode: ''
      }
      const res = await this.$api.getTpmFailReasonList(params)
      const { code, data } = res
      if (code === '200') {
        this.failReasonList = data.list
      } else {
        this.failReasonList = []
      }
    },
    // 获取点检项目表
    async findCheckitemList () {
      let { searchForm, page } = this
      const data = Object.assign(searchForm, page)
      let res = await this.$api.findCheckitemList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      }
    },
    // 获取点检项目明细表
    async findCheckitemDetailList () {
      let { page1 } = this
      let mMomCheckitemId = this.onCheckitemId
      const data = Object.assign({ mMomCheckitemId }, page1)
      let res = await this.$api.findCheckitemDetailList(data)
      if (res.code === '200') {
        this.checkDetailData = res.data.list
        this.total1 = res.data.totalNum
      } else {
        this.checkDetailData = []
        this.total1 = 0
      }
    },
    // 处理点检项目表
    handletable (selectObj) {
      if (selectObj) {
        this.isEdit = true
        this.dialogVisible = true
        let mMomCheckitemId = selectObj.mMomCheckitemId
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogForm.mMomCheckitemId = mMomCheckitemId
          if (selectObj.date === this.$t('inspecItem_EveryDay')) {
            this.$refs.dialog.dateDisabeld = true
          }
          if (selectObj.frequency === '3') {
            this.$refs.dialog.isSelectDateType = false
          }
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    // 处理点检项目明细表
    handleDetailtable (selectObj) {
      if (selectObj) {
        this.isDetailEdit = true
        this.detailDialogVisible = true
        let mMomCheckitemDetailId = selectObj.mMomCheckitemDetailId

        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.detailDialog.detailForm)
          this.$refs.detailDialog.detailForm = this.$global.filterForm(selectObj, keys)
          this.$refs.detailDialog.detailForm.mMomCheckitemDetailId = mMomCheckitemDetailId
        })
      } else {
        this.isDetailEdit = false
        this.detailDialogVisible = true
      }
    },
    // 获取设备明细列表
    async findCheckitemResourceList () {
      let { page2 } = this
      let mMomCheckitemId = this.onCheckitemId
      const data = Object.assign({ mMomCheckitemId }, page2)
      let res = await this.$api.findCheckitemResourceList(data)
      if (res.code === '200') {
        this.deviceTableData = res.data.list
        this.total2 = res.data.totalNum
      } else {
        this.deviceTableData = []
        this.total2 = 0
      }
    },
    // 刷新设备明细
    async refreshCheckitemResource () {
      let mMomCheckitemId = this.onCheckitemId
      const data = Object.assign({ mMomCheckitemId })
      let res = await this.$api.refreshCheckitemResource(data)
      this.$myPrompt.handleMsg(res, () => {
        this.findCheckitemResourceList()
      })
    },
    // 删除点检项目表
    async deleteTable (mMomCheckitemId, status) {
      let { selectList, selcetStatusList } = this
      selectList = mMomCheckitemId ? [mMomCheckitemId] : selectList
      let len = selectList.length
      if (len > 0 || mMomCheckitemId) {
        if (selcetStatusList.indexOf('1') > -1 || status === '1') {
          this.$message.warning(this.$t('inspecItem_PubliCannBeDele'))
        } else {
          const confirm = await this.$myPrompt.confirm(this.$t('inspecItem_AreYouSureItemInfo'))
          if (confirm) {
            let res = await this.$api.deleteCheckitem(selectList)
            this.$myPrompt.handleMsg(res, () => {
              this.findCheckitemList()
            })
          }
        }
      } else {
        this.$message.warning(this.$t('inspecItem_selecChecItemDeleFirs'))
      }
    },
    // 删除点检项目明细
    async deleteDetailTable (mMomCheckitemDetailId) {
      let { selectDetailList, onCheckitemId } = this
      let ids = mMomCheckitemDetailId ? [mMomCheckitemDetailId] : selectDetailList
      let len = selectDetailList.length
      if (len > 0 || mMomCheckitemDetailId) {
        const confirm = await this.$myPrompt.confirm(this.$t('inspecItem_AreYouSureChecItem'))
        if (confirm) {
          let mMomCheckitemId = onCheckitemId
          const data = Object.assign({ mMomCheckitemId, ids })
          let res = await this.$api.deleteCheckitemDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.findCheckitemDetailList()
          })
        }
      } else {
        this.$message.warning(this.$t('inspecItem_selecChecItemDeleFirs'))
      }
    },
    // 删除设备明细
    async deletedeviceTable (mMomCheckitemResourceId) {
      let { selectDeviceList, onCheckitemId } = this
      let len = selectDeviceList.length
      if (len > 0 || mMomCheckitemResourceId) {
        const confirm = await this.$myPrompt.confirm(this.$t('inspecItem_AreYouSureDeviInfo'))
        if (confirm) {
          let ids = mMomCheckitemResourceId ? [mMomCheckitemResourceId] : selectDeviceList
          let mMomCheckitemId = onCheckitemId
          const data = Object.assign({ mMomCheckitemId, ids })
          let res = await this.$api.deleteCheckitemResource(data)
          this.$myPrompt.handleMsg(res, () => {
            this.findCheckitemResourceList()
          })
        }
      } else {
        this.$message.warning(this.$t('inspecItem_selecInfoDeleFirs'))
      }
    },
    // 发布和取消发布点检项目
    async publishCheckitem (status) {
      let mMomCheckitemIds = this.selectList
      const data = Object.assign({ status, mMomCheckitemIds })
      let res = await this.$api.publishCheckitem(data)
      this.$myPrompt.handleMsg(res, () => {
        this.findCheckitemList()
      })
    },
    cannel () {
      this.dialogVisible = false
    },
    detailDialogCannel () {
      this.detailDialogVisible = false
    }
  },
  components: {
    dialogForm, detailDialog
  },
  created () {
    this.findCheckitemList()
  }
}
</script>
