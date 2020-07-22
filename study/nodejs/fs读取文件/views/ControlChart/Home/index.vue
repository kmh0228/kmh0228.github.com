<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">控制图主页</div>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input placeholder="请输入查询内容" v-model.trim="searchForm.itemCode" size="mini" style="width:35%;" clearable @keydown.enter.native="getTableData"></el-input>
    </el-col>
    <el-col :span="12">
      <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
        <i class="fa fa-filter"></i>
      </el-button>
      <dict-select style="width:40%;float:right" v-model="searchForm.itemStatus" placeholder="控制项状态" dictType="ControlItem_Status" @change="selectChange" clearable selectKey="dictCode"></dict-select>
    </el-col>
    <el-col :span="24" style="padding-top:1vh;" v-show="showMoreConditon">
      <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
        <el-form-item label="产品系列" class="el-col el-col-11">
          <el-select v-model="searchForm.MComMaterialfamilyId" clearable @change="selectChange" filterable style="width:100%;">
            <el-option v-for="option in productList" :key="option.mComMaterialfamilyId" :label="option.mComMaterialfamilyName" :value="option.mComMaterialfamilyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线别" class="el-col el-col-11 el-col-offset-1">
          <el-select v-model="searchForm.MPomLineId" clearable filterable style="width:100%" @change="selectChange">
            <el-option v-for="option in lineList" :key="option.mPomLineId" :value="option.mPomLineId" :label="option.lineName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="料号" class="el-col el-col-11">
          <material-select v-model="searchForm.MComMaterialId" style="width:100%" @change="selectChange"></material-select>
        </el-form-item>
        <el-form-item label="控制图" class="el-col el-col-11 el-col-offset-1">
          <dict-select style="width:100%;" v-model="searchForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode" @change="selectChange" clearable></dict-select>
        </el-form-item>
        <el-form-item label="模穴号/零件位置" class="el-col el-col-11">
          <el-select v-model="searchForm.moldCavityNo" clearable filterable style="width:100%" @change="selectChange">
            <el-option v-for="(item,i) in moldList" :key="i" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控制图点数" class="el-col el-col-11 el-col-offset-1">
          <dict-select style="width:100%;" v-model="searchForm.controlChartCount" dictType="CONTROL_OPTION" clearable selectKey="dictCode" @change="selectChange" ></dict-select>
        </el-form-item>
        <el-form-item label="控制图时间" class="el-col el-col-11">
          <el-date-picker type="daterange" v-model="dateList" @change="selectChange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-form>
     </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12" >
        <el-button icon="el-icon-search" @click="getTableData">查询</el-button>
        <span class="split-line">|</span>
        <el-button icon="el-icon-s-operation" @click="contrastData">对比</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
      </el-col>
      <el-col :span="12" >
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center" fixed ></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed></el-table-column>
        <el-table-column prop="officeName" sortable label="部门" align="center"></el-table-column>
        <el-table-column prop="itemCode" sortable label="控制项名称" align="center" width="150"></el-table-column>
        <el-table-column prop="itemDesc" sortable label="控制项描述" align="center" width="180"></el-table-column>
        <el-table-column prop="materialNo" sortable label="料号" align="center" width="120"></el-table-column>
        <el-table-column prop="materialRev" sortable label="料号版次" align="center" width="100"></el-table-column>
        <el-table-column prop="materialfamilyCode" sortable label="产品系列" align="center" width="100"></el-table-column>
        <el-table-column prop="moldCavityNo" sortable label="模穴号/零件位置" align="center" width="160"></el-table-column>
        <el-table-column prop="lineCode" sortable label="线别" align="center"></el-table-column>
        <el-table-column prop="stationCode" sortable label="量测站/实验室" align="center" width="160"></el-table-column>
        <el-table-column prop="instrumentName" sortable label="测量仪器" align="center" width="120"></el-table-column>
        <el-table-column prop="controlChartType" sortable label="控制图" align="center" width="120"></el-table-column>
        <el-table-column prop="itemStatusName" sortable label="管控状态" align="center" width="120"></el-table-column>
        <!-- <el-table-column prop="officeName" sortable label="是否自动报警" align="center"></el-table-column>
        <el-table-column prop="typeCode" sortable label="是否自动更新" align="center"></el-table-column>
        <el-table-column prop="officeName" sortable label="最后维护人" align="center"></el-table-column>
        <el-table-column prop="typeCode" sortable label="最后维护时间" align="center"></el-table-column> -->
        <el-table-column label="操作" align="center"  width="80" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="viewControlChart(scope.row.tSpcControlItemId)" iconClass='el-icon-view' tipText="查看控制图"></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'

export default {
  data () {
    return {
      searchForm: {
        itemStatus: '',
        itemCode: '',
        MComMaterialfamilyId: '',
        lineList: '',
        MComMaterialId: '',
        controlChartType: '',
        moldCavityNo: '',
        controlChartCount: ''
      },
      dateList: [],
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      productList: [],
      lineList: [],
      moldList: [],
      controlItemList: [],
      tableData: [],
      selectList: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    selectChange () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getTableData()
    },
    // 获取所有产品系列
    async getProductList () {
      const params = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getMachine(params)
      const { code, data } = res
      if (code === '200') {
        this.productList = data.list
      } else {
        this.productList = []
      }
    },
    // 获取所有线别
    async getAllLine () {
      const params = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getLineList(params)
      const { code, data } = res
      if (code === '200') {
        this.lineList = data.list
      } else {
        this.lineList = []
      }
    },
    // 获取模穴号/零件位置
    async getSpcMoldCavityNo () {
      const res = await this.$api.getSpcMoldCavityNo()
      const { code, data } = res
      if (code === '200') {
        this.moldList = data
      } else {
        this.moldList = []
      }
    },
    // 获取所有管制项
    async getSpcControlItem () {
      const params = { pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getSpcControlItem(params)
      const { code, data } = res
      if (code === '200') {
        this.controlItemList = data.list
      } else {
        this.controlItemList = []
      }
    },
    async getTableData () {
      let { page, searchForm } = this
      const data = Object.assign(searchForm, page)
      const res = await this.$api.getControlChartList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.tSpcControlItemId)
      })
    },
    async contrastData () {
      let { selectList } = this
      if (selectList.length > 0) {
        this.$router.push({ path: 'Home/ContrastResult', query: { ContrastResult: selectList } })
      } else {
        this.$message.warning('请选择两个或两个以上管制项！')
      }
    },
    viewControlChart (tSpcControlItemId) {
      this.viewId = tSpcControlItemId
      this.$router.push(`Home/Control?id=${tSpcControlItemId}`)
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.searchForm)
      this.getSpcControlItem()
    }
  },
  created () {
    this.getProductList()
    this.getAllLine()
    this.getSpcControlItem()
    this.getTableData()
  },
  components: {
    materialSelect
  }

}
</script>
