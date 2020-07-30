<template>
<div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('anomalyAna_AbnorEqui')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:35%" ></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_EquipCateName')" v-model="searchForm.typeName" style="width:40%;float:right;">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getTroubleData"></i>
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('common_RespoLeve')" prop="hierarchyId" class="el-col el-col-11">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('anomalyAna_selecRespLeve')"  v-model="searchForm.hierarchyId" >
              <el-option v-for="(option,i) in hierarchyList" :key="i" :label="option.hierarchyName" :value="option.mMomHierarchyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_Line')" prop="lineId" class="el-col el-col-11 el-col-offset-2">
            <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="searchForm.lineId">
              <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('anomalyAna_FaultStarTime')" prop="hierarchyId" class="el-col el-col-11">
            <el-date-picker  v-model="dateList"  type="daterange"  :range-separator="$t('common_to')"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')" style="width:100%"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
      <el-row>
        <el-col :span="12" style="height:40vh;padding:2%">
          <bar-echart id="deviceTrobleNumber" :barTitle="$t('anomalyAna_AbnorTimeEqui') + 'Top5'" :barData="deviceTrobleNumList"></bar-echart>
        </el-col>
        <el-col :span="12" style="height:40vh;padding:2%">
          <bar-echart id="deviceTrobleTime" :barTitle="$t('anomalyAna_EquipAbnoTime') + 'Top5'" :barData="deviceTrobleTimeList"></bar-echart>
        </el-col>
         <el-col :span="12" style="height:40vh;padding:2%">
          <pie-echart id="trobleNumber" :pieTitle="$t('anomalyAna_NumbeAbnoFaul') + 'Top5'" :pieData="trobleNumberList"></pie-echart>
        </el-col>
        <el-col :span="12" style="height:40vh;padding:2%">
          <pie-echart id="trobleTime" :pieTitle="$t('anomalyAna_AbnorFaulTime') + 'Top5'" :pieData="trobleTimeList"></pie-echart>
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
