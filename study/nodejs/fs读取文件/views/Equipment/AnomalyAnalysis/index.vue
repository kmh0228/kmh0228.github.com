<template>
<div class="mes-main mes-work-order">
    <h3 class="mes-main-title">设备异常Top分析</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:35%" ></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="设备类别名称" v-model="searchForm.typeName" style="width:40%;float:right;">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getTroubleData"></i>
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item label="责任层级" prop="hierarchyId" class="el-col el-col-11">
            <el-select style="width:100%" size="mini" clearable placeholder="请选择责任层级"  v-model="searchForm.hierarchyId" >
              <el-option v-for="(option,i) in hierarchyList" :key="i" :label="option.hierarchyName" :value="option.mMomHierarchyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线别" prop="lineId" class="el-col el-col-11 el-col-offset-2">
            <el-select style="width:100%" size="mini" clearable placeholder="请选择线别"  v-model="searchForm.lineId">
              <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障起始时间" prop="hierarchyId" class="el-col el-col-11">
            <el-date-picker  v-model="dateList"  type="daterange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" style="width:100%"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
      <el-row>
        <el-col :span="12" style="height:40vh;padding:2%">
          <bar-echart id="deviceTrobleNumber" barTitle="设备异常次数Top5" :barData="deviceTrobleNumList"></bar-echart>
        </el-col>
        <el-col :span="12" style="height:40vh;padding:2%">
          <bar-echart id="deviceTrobleTime" barTitle="设备异常时间Top5" :barData="deviceTrobleTimeList"></bar-echart>
        </el-col>
         <el-col :span="12" style="height:40vh;padding:2%">
          <pie-echart id="trobleNumber" pieTitle="故障异常次数Top5" :pieData="trobleNumberList"></pie-echart>
        </el-col>
        <el-col :span="12" style="height:40vh;padding:2%">
          <pie-echart id="trobleTime" pieTitle="故障异常时间Top5" :pieData="trobleTimeList"></pie-echart>
        </el-col>
      </el-row>
</div>

</template>

<script>
import barEchart from './echartCompment/bar'
import pieEchart from './echartCompment/pie'
export default {
  data () {
    return {
      searchForm: {
        officeCode: '',
        typeName: '',
        hierarchyId: '',
        lineId: '',
        startTime: '',
        endTime: ''
      },
      showMore: false,
      hierarchyList: [],
      dateList: [],
      lineList: [],
      deviceTrobleNumList: [],
      deviceTrobleTimeList: [],
      trobleNumberList: [],
      trobleTimeList: []
    }
  },
  methods: {
    // 获取责任层级列表
    async findHierarchyList () {
      let data = { pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.findHierarchyList(data)
      if (res.code === '200') {
        this.hierarchyList = res.data.list
      } else {
        this.hierarchyList = []
      }
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      } else {
        this.lineList = []
      }
    },
    async getTroubleData () {
      let { searchForm, dateList } = this
      searchForm.startTime = dateList[0] ? this.$dayjs(dateList[0]).format('YYYY-MM-DD 00:00:00') : ''
      searchForm.endTime = dateList[1] ? this.$dayjs(dateList[1]).format('YYYY-MM-DD 00:00:00') : ''
      let res = await this.$api.getresExcAna(searchForm)
      if (res.code === '200') {
        this.deviceTrobleNumList = res.data.brokenNumber
        this.deviceTrobleTimeList = res.data.brokenTime
        this.trobleNumberList = res.data.downNumber
        this.trobleTimeList = res.data.downTime
      } else {
        this.deviceTrobleNumList = []
        this.deviceTrobleTimeList = []
        this.trobleNumberList = []
        this.trobleTimeList = []
      }
    }
  },
  created () {
    this.findHierarchyList()
    this.getLineData()
    this.getTroubleData()
  },
  components: {
    barEchart, pieEchart
  }
}
</script>
