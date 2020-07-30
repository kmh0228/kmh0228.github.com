<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">{{$t('capability_ProceCapaAnalRepo')}}</div>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
       <el-cascader
          v-model="searchForm.dept"
          :options="deptOptions"
          :placeholder="$t('common_PleasSeleDepa')"
          :props="{ expandTrigger: 'hover', value:'officeCode',label:'officeName'}"
           @change="selectChange"
          clearable></el-cascader>
    </el-col>
    <el-col :span="12">
      <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
        <i class="fa fa-filter"></i>
      </el-button>
      <el-input :placeholder="$t('capability_EnterContName')" v-model.trim="searchForm.itemCode" style="width:40%;float:right;" @keydown.enter.native="getTableData">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getTableData"></i>
      </el-input>
    </el-col>
    <el-col :span="24" style="padding-top:1vh;" v-show="showMoreConditon">
      <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="120px" label-position="left">
        <el-form-item :label="$t('common_ContrName')" class="el-col el-col-11">
          <el-input v-model="searchForm.itemCode" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('capability_MouldHoleNumb')" class="el-col el-col-11 el-col-offset-1">
          <el-select v-model="searchForm.moldCavityNo" clearable filterable style="width:100%"  >
            <el-option v-for="(item,i) in moldList" :key="i" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_ProduPartNumb')" class="el-col el-col-11 ">
          <material-select v-model="searchForm.mComMaterialId" style="width:100%" ></material-select>
        </el-form-item>
        <el-form-item :label="$t('capability_LineNumb')" class="el-col el-col-11 el-col-offset-1">
          <mes-select v-model="searchForm.mPomLineId" method="getLineList" labelKey="lineName" valueKey="mPomLineId"></mes-select>
        </el-form-item>
      </el-form>
     </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12" >
        <el-button icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
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
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed></el-table-column>
        <el-table-column prop="officeName" sortable :label="$t('common_Department')" align="center"></el-table-column>
        <el-table-column prop="itemCode" sortable :label="$t('common_ContrName')" align="center" width="150">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor: pointer;" @click="viewControlChart(scope.row.tSpcControlItemId)">
              {{scope.row.itemCode}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="itemDesc" sortable :label="$t('common_ContrDesc')" align="center" width="180"></el-table-column>
        <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center" width="120"></el-table-column>
        <el-table-column prop="materialRev" sortable :label="$t('common_ItemNoRev')" align="center" width="100"></el-table-column>
        <el-table-column prop="materialfamilyCode" sortable :label="$t('common_ProduSeries')" align="center" width="100"></el-table-column>
        <el-table-column prop="moldCavityNo" sortable :label="$t('common_MouldHoleNumb')" align="center" width="160"></el-table-column>
        <el-table-column prop="lineCode" sortable :label="$t('common_Line')" align="center"></el-table-column>
        <el-table-column prop="stationCode" sortable :label="$t('capability_measLabo')" align="center" width="160"></el-table-column>
        <el-table-column prop="instrumentName" sortable :label="$t('common_MeasuInst')" align="center" width="120"></el-table-column>
        <el-table-column prop="totalPoint" sortable :label="$t('capability_TotalPoin')" align="center" width="120"></el-table-column>
        <el-table-column prop="ca" sortable label="Ca" align="center" width="120"></el-table-column>
        <el-table-column prop="cp" sortable label="Cp" align="center" width="120"></el-table-column>
        <el-table-column prop="pp" sortable label="Pp" align="center" width="120"></el-table-column>
        <el-table-column prop="cpk" sortable label="Cpk" align="center" width="120"></el-table-column>
        <el-table-column prop="ppk" sortable label="Ppk" align="center" width="120"></el-table-column>
        <el-table-column prop="cpkLevel" sortable :label="'Cpk'+$t('capability_Grade')" align="center" width="120"></el-table-column>
      </el-table>
    </div>
  </div>
</div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import mesSelect from '@/components/Module/Select/select'
export default {
  components: { materialSelect, mesSelect },
  data () {
    return {
      deptOptions: [],
      moldList: [],
      searchForm: {
        dept: '',
        itemCode: '',
        mPomLineId: '',
        mComMaterialId: '',
        moldCavityNo: ''
      },
      showMoreConditon: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
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
    async getOfficeList () {
      const res = await this.$api.getOfficeList({ type: 2 })
      const { code, data } = res
      if (code === '200') {
        this.deptOptions = Array.isArray(data) ? data : []
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
    async getTableData () {
      let { page, searchForm } = this
      let deptLen = searchForm.dept && searchForm.dept.length > 0 ? searchForm.dept.length : 0
      const res = await this.$api.getCpkAnalysisList({ ...searchForm, page, dept: deptLen > 0 ? searchForm.dept[deptLen - 1] : '' })
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
    viewControlChart (tSpcControlItemId) {
      this.$router.push(`/ControlChart/Home/Control?id=${tSpcControlItemId}`)
    }
  },
  created () {
    this.getSpcMoldCavityNo()
    this.getOfficeList()
    this.getTableData()
  }

}
</script>
