<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('processTime_RespoProcTimeRepo')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.factoryCode" style="width:35%" ></cascader-select>
        <el-button size="mini" icon="el-icon-search" @click="getTimeData">{{$t('common_Inquire')}}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMore = !showMore">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-select style="float:right;width:35%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="searchForm.lineId">
          <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('processTime_FaultStarTime')"  class="el-col el-col-11">
            <el-date-picker  v-model="dateList"  type="daterange"  range-separator="至"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')" style="width:100%" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('processTime_AlarmType') + ' :'" class="el-col el-col-11 el-col-offset-2" >
            <el-select style="width:100%" v-model="searchForm.mAlmTypeId" @focus="getAlarmType">
              <el-option v-for="(option,i) in alarmList" :key="i" :label="option.typeName" :value="option.typeCode"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" style="height:35vh;padding:1vh 1.5vw">
        <pie-echart id="reponseRate" :pieTitle="$t('processTime_RespoTimeTimeRate')" :pieData="reponseRateData" :legendData="reponseLegendData"></pie-echart>
      </el-col>
      <el-col :span="8" style="height:35vh;padding:1vh 1.5vw">
        <line-echart id="reponseNoOvertimeCount" :lineTitle="$t('processTime_RespoAverTimeTren')" :lineData="reponseNoOvertimeCountList"></line-echart>
      </el-col>
      <el-col :span="8" style="height:35vh;padding:1vh 1.5vw">
        <bar-echart id="alarmQuestionTop" :barTitle="$t('common_AlarmProb') + ' TOP5'" :barData="alarmProblemTopList"></bar-echart>
      </el-col>
      <el-col :span="8" style="height:35vh;padding:1vh 1.5vw">
        <pie-echart id="processRateRate" :pieTitle="$t('processTime_TimeoRateProc')" :pieData="processRateData" :legendData="processLegendData"></pie-echart>
      </el-col>
      <el-col :span="8" style="height:35vh;padding:1vh 1.5vw">
        <line-echart id="processNoOvertimeCount" :lineTitle="$t('processTime_TrendAverProcTime')"  :lineData="processNoOvertimeCountList"></line-echart>
      </el-col>
      <el-col :span="8" style="height:35vh;padding:1vh 1.5vw">
        <bar-echart id="alarmTimeTop" :barTitle="$t('processTime_AlarmProcTime') + ' TOP5'" :barData="alarmProcessTimeTop"></bar-echart>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import barEchart from './Echart/barEchart'
import lineEchart from './Echart/lineEchart'
import pieEchart from './Echart/pieEchart'
export default {
  data () {
    return {
      searchForm: {
        factoryCode: '',
        lineId: '',
        mAlmTypeId: '',
        startTime: '',
        endTime: ''
      },
      showMore: false,
      lineList: [],
      alarmList: [],
      dateList: [],
      reponseRateData: [],
      processRateData: [],
      reponseLegendData: [this.$t('processTime_NumbeRespTimeTime'), this.$t('processTime_NumbeRespTimeTimeOut')],
      processLegendData: [this.$t('processTime_NumbeProcTimeOuts'), this.$t('processTime_NumbeProcTimeTimeOut')],
      reponseNoOvertimeCountList: [],
      processNoOvertimeCountList: [],
      alarmProblemTopList: [],
      alarmProcessTimeTop: []
    }
  },
  methods: {
    async getTimeData () {
      let { searchForm, dateList } = this
      searchForm.startTime = dateList[0] || ''
      searchForm.endTime = dateList[1] || ''
      const res = await this.$api.queryResponseProcessReport(searchForm)
      if (res.code === '200') {
        let reponseRateKey = ['responseOvertimeCount', 'responseNoOvertimeCount']
        this.reponseRateData = this.$global.fileterData(reponseRateKey, res.data)
        let processRateKey = ['processOvertimeCount', 'processNoOvertimeCount']
        this.processRateData = this.$global.fileterData(processRateKey, res.data)
        this.reponseNoOvertimeCountList = res.data.responseAverageTimeChart
        this.processNoOvertimeCountList = res.data.processAverageTimeChart
        this.alarmProblemTopList = res.data.alarmProblemTop5
        this.alarmProcessTimeTop = res.data.alarmProcessTimeTop5
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
    // 获取报警类型
    async getAlarmType () {
      let { factoryCode } = this.searchForm
      if (factoryCode) {
        const data = {
          officeCode: factoryCode,
          pageIndex: 1,
          pageSize: 1000
        }
        let res = await this.$api.getAlarmType(data)
        if (res.code === '200') {
          this.alarmList = res.data.list
        } else {
          this.alarmList = []
        }
      } else {
        this.$message.warning(this.$t('processTime_selecFactFirs'))
      }
    }
  },
  created () {
    this.getLineData()
    this.getTimeData()
  },
  components: {
    barEchart, pieEchart, lineEchart
  }
}
</script>
