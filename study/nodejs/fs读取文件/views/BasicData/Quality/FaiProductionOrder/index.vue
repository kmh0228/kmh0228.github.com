<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('failProductO_FirstAndLastProdOrde')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="docStatus" dictType="INSPECT_STATUS"  style="width:35%" @change="changeStatus"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;"  @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('common_PleasEnteKeyw')" v-model="searchForm.keywords" style="width:40%;float:right;" @keydown.enter.native="findMainBillPage">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findMainBillPage"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('failProductO_InspeDateF')" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="daterange"   start-:placeholder="$t('common_StartDate')" end-:placeholder="$t('common_EndDate')"  value-format="yyyy-MM-dd" clearable></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-11 el-col-offset-1">
            <mes-select v-model="searchForm.model" labelKey="mComMaterialfamilyCode" valueKey="mComMaterialfamilyId" method="getMachine"></mes-select>
          </el-form-item>
          <el-form-item :label="$t('common_Line')" class="el-col el-col-11">
            <mes-select v-model="searchForm.mPomLineId" labelKey="lineName" valueKey="mPomLineId" method="getLineList"></mes-select>
          </el-form-item>
          <el-form-item :label="$t('common_posit')" class="el-col el-col-11 el-col-offset-1">
            <el-input  v-model="searchForm.location"  style="width:100%" size="mini"  clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('failProductO_InspeCate')" class="el-col el-col-11">
            <dict-select v-model="searchForm.inspectCategory" dictType='QMS_CHECK-TYPE'></dict-select>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="findMainBillPage">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleCheck('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteMainBill('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" highlight-current-row border size="mini"  @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="batchNo" :label="$t('common_BatchNumb')" align="center" sortable></el-table-column>
          <el-table-column prop="productSn" label="SN" align="center" sortable></el-table-column>
          <el-table-column prop="sendTime" :label="$t('failProductO_InspeDate')" align="center" sortable min-width="120px"></el-table-column>
          <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center" sortable></el-table-column>
          <el-table-column prop="modelCode" :label="$t('common_ProduSeries')" align="center" sortable min-width="120px"></el-table-column>
          <el-table-column prop="location" :label="$t('common_posit')" align="center" sortable></el-table-column>
          <el-table-column prop="lineCode" :label="$t('common_Line')" align="center" sortable></el-table-column>
          <el-table-column prop="sendByName" :label="$t('failProductO_TestiPers')" align="center" sortable min-width="120px"></el-table-column>
          <el-table-column prop="inspectCategoryCode" :label="$t('failProductO_InspeCate')" align="center" sortable min-width="120px"></el-table-column>
          <el-table-column prop="docStatus" :label="$t('common_Status')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleCheck(scope.row)" iconClass="el-icon-edit-outline" :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteMainBill(scope.row.tQomFaiMainId)" iconClass="el-icon-delete" :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog  :visible.sync="dialogVisible" :title="dialogTitle"  width="700px" class="handle-dialog">
      <dialog-from  v-if="dialogVisible" ref="dialog"  @cannel="cannel" :isEdit="isEdit" @findMainBillPage="findMainBillPage" :docStatus="docStatus"></dialog-from>
    </el-dialog>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'

export default {
  data () {
    return {
      docStatus: 'UN_REGISTER',
      searchForm: {
        keywords: '',
        location: '',
        model: '',
        mPomLineId: '',
        inspectCategory: '',
        startTime: '',
        endTime: ''
      },
      showMoreConditon: false,
      tableData: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      timeValue: [],
      productionUnitList: [],
      dialogVisible: false,
      isEdit: false,
      selectedList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('failProductO_EditFirsAndProdOrde') : this.$t('failProductO_AddFirsAndProdOrde')
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findMainBillPage()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findMainBillPage()
    },
    selectionChange (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.tQomFaiMainId)
      })
    },
    async findMainBillPage () {
      let { searchForm, page, timeValue, docStatus } = this
      searchForm.startTime = timeValue[0] ? timeValue[0] : ''
      searchForm.endTime = timeValue[1] ? timeValue[1] : ''
      let data = Object.assign(searchForm, page, { docStatus })
      let res = await this.$api.findMainBillPage(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    handleCheck (row) {
      // this.dialogVisible = true
      // if (row) {
      //   this.isEdit = true
      //   this.$nextTick(() => {
      //     let keys = Object.keys(this.$refs.dialog.dialogForm)
      //     this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
      //     this.$refs.dialog.dialogForm.tQomFaiMainId = row.tQomFaiMainId
      //     this.$refs.dialog.materialNo = row.materialNo
      //   })
      // } else {
      //   this.isEdit = false
      // }
      if (row) {
        const { tQomFaiMainId } = row
        const { docStatus } = this.searchForm
        this.$router.replace(`FaiProductionOrder/edit?id=${tQomFaiMainId}&status=${docStatus}`)
      } else {
        this.$router.replace(`FaiProductionOrder/add?status=UN_REGISTER`)
      }
    },
    async deleteMainBill (id) {
      let ids = id ? [id] : this.selectedList
      const len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('failProductO_AreYouSureProdOrde'))
        if (confirmRes) {
          let res = await this.$api.deleteMainBill(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.findMainBillPage()
          })
        }
      } else {
        this.$message.warning(this.$t('failProductO_selecFirsAndBeDele'))
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.findMainBillPage()
    },
    cannel () {
      this.dialogVisible = false
    },
    changeStatus () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.findMainBillPage()
    }
  },
  created () {
    this.findMainBillPage()
  },
  components: {
    dialogFrom
  }
}

</script>
