<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">工单备料</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <dict-select placeholder="请选择单据状态" v-model="searchForm.status" dictType="DOCUMENT_STATUS" @change="selectChange" style="float:right;width:40%" clearable></dict-select>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
          <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
            <el-form-item label="备料单号" class="el-col el-col-11">
              <el-input placeholder="请输入备料单号"  v-model.trim="searchForm.prepareNo" ></el-input>
            </el-form-item>
            <el-form-item label="工单号" class="el-col el-col-11 el-col-offset-1">
              <el-input placeholder="请输入工单号"  v-model.trim="searchForm.orderNo" ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getOrderTable">查询</el-button>
        </el-col>
        <el-col :span="12">
          <mes-page ref="mesPage1" :initData="getOrderTable" :total="total" />
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectChange" @cell-click="cellClick">
          <el-table-column type="selection" width="50" align="center" ></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="officeName" sortable label="工厂" align="center"></el-table-column>
          <el-table-column prop="prepareNo" sortable label="备料单号" align="center"></el-table-column>
          <el-table-column prop="orderNo" sortable label="工单号" align="center"></el-table-column>
          <el-table-column prop="status" sortable label="状态" align="center"></el-table-column>
          <el-table-column prop="preparer" sortable label="备料人" align="center"></el-table-column>
          <el-table-column prop="prepareStartTime" sortable label="备料开始时间" align="center"></el-table-column>
          <el-table-column prop="prepareEndTime" sortable label="备料结束时间" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-show="showTabs">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="物料列表" name="materialTable">
          <div class="mes-table">
          <el-row class="mes-table-handle">
            <el-col :span="24">
              <mes-page ref="mesPage2" :initData="getMateralTable" :total="total1" />
            </el-col>
          </el-row>
          <div class="mes-table-content">
            <el-table :data="materialData" border  size="mini">
              <el-table-column type="index" label="序号" align="center" :index="indexMethod1"></el-table-column>
              <el-table-column prop="materialsNo" sortable label="料号" align="center"></el-table-column>
              <el-table-column prop="materialsName" sortable label="物料名称" align="center"></el-table-column>
              <el-table-column prop="requiredQty" sortable label="需求数量" align="center"></el-table-column>
              <el-table-column prop="finishQty" sortable label="备料完成数量" align="center"></el-table-column>
              <el-table-column prop="unit" sortable label="单位" align="center"></el-table-column>
            </el-table>
          </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <scan-input scanType="PKGID" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
import scanInput from '@/views/Production/DataAcquisition/Module/scanInput'
export default {
  data () {
    return {
      tableData: [],
      materialData: [],
      searchForm: {
        officeCode: '',
        prepareNo: '',
        orderNo: '',
        status: ''
      },
      total: 0,
      selectList: [],
      total1: 0,
      showMoreConditon: false,
      showTabs: false,
      activeName: 'materialTable',
      prepareMainId: ''
    }
  },
  computed: {
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.$refs.mesPage1.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    indexMethod1 (index) {
      let { pageIndex, pageSize } = this.$refs.mesPage2.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async cellClick (row, column, cell, event) {
      this.materialData = []
      this.showTabs = true
      this.prepareMainId = row.prepareMainId
      this.getMateralTable()
    },
    selectChange () {
      this.$refs.mesPage1.resetPage()
      this.getOrderTable()
    },
    tableSelectChange (selection) {
      this.selectList = selection
    },
    // 获取工单表
    async getOrderTable () {
      const { searchForm } = this
      const { page } = this.$refs.mesPage1
      const params = Object.assign(page, searchForm)
      const res = await this.$api.getOrderPickPart(params)
      this.$myPrompt.handleMsg(res, data => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    // 获取物料表
    async getMateralTable () {
      const { prepareMainId } = this
      const { page } = this.$refs.mesPage2
      const params = Object.assign(page, { prepareMainId })
      const res = await this.$api.getOrderPickPartDetail(params)
      this.$myPrompt.handleMsg(res, data => {
        this.materialData = data.list
        this.total1 = data.totalNum
      }, false)
    },
    async scanCode (pkgId) {
      const { selectList } = this
      const len = selectList.length
      if (len > 0) {
        if (len === 1) {
          const { prepareMainId } = selectList[0]
          const data = { prepareMainId, pkgId }
          const res = await this.$api.scanPkgidByStock(data)
          this.$myPrompt.handleMsg(res, () => {
            this.getOrderTable()
          })
        } else {
          this.$message.warning('请勾选一条备料单号！')
        }
      } else {
        this.$message.warning('请先选择备料单号！')
      }
    }
  },
  mounted () {
    this.getOrderTable()
  },
  components: {
    scanInput
  }
}
</script>
