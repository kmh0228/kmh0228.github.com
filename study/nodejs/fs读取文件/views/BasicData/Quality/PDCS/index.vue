<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">PDCS</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select  v-model="searchForm.docStatus" dictType="SUBMIT_STATUS"  style="width:35%" selectKey="dictCode" @change="findPdcsList"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" :placeholder="$t('PDCS_inputItemNumbForInqu')" v-model="searchForm.partNoFilter" style="width:40%;float:right;" @keydown.enter.native="findPdcsList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findPdcsList"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('PDCS_numbe')" class="el-col el-col-11">
            <el-input v-model="searchForm.pdcsNoFilter"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_AuditDate')" class="el-col el-col-11 ">
            <el-date-picker style="width:100%"  v-model="timeValue"  type="datetimerange"   start-:placeholder="$t('common_StartDate')" end-:placeholder="$t('common_EndDate')"  value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      </el-row>
      <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="findPdcsList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleCheck()">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData(selectIds)">{{$t('common_Delete')}}</el-button>
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
        <el-table :data="tableData" highlight-current-row border size="mini" @cell-click="cellClick"  @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="pdcsNo" label="PDCS单号" align="center" sortable></el-table-column>
          <el-table-column prop="departmentVn" :label="$t('common_Department')" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.departmentVn && scope.row.departmentVn.replace(/,/g,'/')}}
            </template>
          </el-table-column>
          <el-table-column prop="partNoVn" :label="$t('common_PorN')" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.pdcsNoRev ? `${scope.row.partNoVn}:${scope.row.pdcsNoRev}` : scope.row.partNoVn}}
            </template>
          </el-table-column>
          <el-table-column prop="workOrderVn" :label="$t('PDCS_WorkOrde')" align="center" sortable></el-table-column>
          <el-table-column prop="manufactueDate" :label="$t('PDCS_ManufTime')" align="center" sortable></el-table-column>
          <el-table-column prop="failType" :label="$t('PDCS_TypesDefeProd')" align="center" sortable></el-table-column>
          <el-table-column prop="inspectNo" :label="$t('common_InspeOrdeNo')" align="center" sortable></el-table-column>
          <el-table-column prop="qty" :label="$t('PDCS_ProduQuan')" align="center" sortable></el-table-column>
          <el-table-column prop="failQty" :label="$t('common_NumbeDefe')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleCheck(scope.row)" iconClass="el-icon-edit-outline" :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="deletetableData([scope.row.pdcsId])" iconClass="el-icon-delete" :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('PDCS_Detai')" name="infoName">
          <base-index type="details" :pdcsId="pdcsId"></base-index>
        </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
import BaseIndex from './baseIndex'
export default {
  components: { BaseIndex },
  data () {
    return {
      activeName: 'infoName',
      showTabs: false,
      pdcsId: '',
      searchForm: {
        docStatus: 'DRAFT',
        partNoFilter: '',
        pdcsNoFilter: '',
        startDateFilter: '',
        endDateFilter: ''
      },
      selectIds: [],
      tableData: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      timeValue: [],
      showMoreConditon: false
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.findPdcsList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.findPdcsList()
    },
    cellClick (row, column, cell, event) {
      this.showTabs = true
      this.pdcsId = row.pdcsId
    },
    selectionChange (val) {
      this.selectIds = val.map(item => item.pdcsId)
    },
    async deletetableData (ids) {
      if (ids.length > 0) {
        let confirm = await this.$myPrompt.confirm(this.$t('PDCS_AreYouSureDeleSele'))
        if (confirm) {
          let res = await this.$api.deletePdcs(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - ids.length) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.findPdcsList()
          })
        }
      } else {
        this.$message.warning(this.$t('PDCS_selecDelePDCSS'))
      }
    },
    async findPdcsList () {
      this.searchForm.startDateFilter = this.timeValue.length > 1 ? this.timeValue[0] : ''
      this.searchForm.endDateFilter = this.timeValue.length > 1 ? this.timeValue[1] : ''
      let res = await this.$api.findPdcsList({ ...this.page, ...this.searchForm })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.timeValue = []
      this.$global.resetForm(this.searchForm)
      this.searchForm.status = 'DRAFT'
      this.findPdcsList()
    },
    handleCheck (row) {
      if (!row) {
        this.$router.push(`PDCS/add?status=DRAFT`)
        return false
      }
      this.$router.push(`PDCS/edit?pdcsId=${row.pdcsId}&status=${row.status ? row.status : 'DRAFT'}`)
    }
  },
  created () {
    this.findPdcsList()
  }
}

</script>
