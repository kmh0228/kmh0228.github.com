<template>
   <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button v-if="listIndex===0" type="primary" plain size="mini" @click="$router.push('/ControlChart/Home')">{{$t('common_close')}}</el-button>
      <el-button v-else type="primary">{{listIndex+1}}</el-button>
    </div>
    <div  id="imageWrapper">
      <el-card class="box-card"  shadow="never">
       <div slot="header" class="clearfix">
        <span>{{$t('conChartHome_ContrInfo')}}</span>
      </div>
      <control-info ref="controlInfo" :tSpcControlItemId="tSpcControlItemId" :hiddenButton="hiddenButton" :len="len"></control-info>
      </el-card>
      <el-card class="box-card"  shadow="never" style="margin-top:15px">
       <div slot="header" class="clearfix">
        <span>{{$t('common_ContrChar')}}SL&CL</span>
      </div>
      <control-chart ref="controlChart"></control-chart>
      </el-card>
      <el-card class="box-card"  shadow="never" style="margin-top:15px">
       <div slot="header" class="clearfix">
        <span>{{$t('conChartHome_MeasuDataShee')}}</span>
      </div>
      <measurement-table v-if="tableData.length>0" :tableData="tableData"></measurement-table>
      </el-card>
      <el-card class="box-card"  shadow="never" style="margin-top:15px">
       <div slot="header" class="clearfix">
        <span>{{$t('conChartHome_ContrChar')}}</span>
        <el-button v-if="hiddenButton" type="primary" style="margin-left:20px"  @click="enterControl">{{$t('conChartHome_EnterContStag')}}</el-button>
        <el-button v-if="hiddenButton" type="primary" style="margin-left:20px"  @click="exportChart">{{$t('conChartHome_ExporDataGrap')}}</el-button>
      </div>
        <el-row>
          <el-col :span="24" style="height:40vh">
            <point-chart :id="firstChart" :pointData="pointData" :cData="cData0" @setDefaultId="setDefaultId" :hiddenButton="hiddenButton"></point-chart>
          </el-col>
          <el-col :span="24" style="height:40vh">
            <point-chart :id="secondChart" :pointData="pointData" :cData="cData1"  @setDefaultId="setDefaultId" :hiddenButton="hiddenButton"></point-chart>
          </el-col>
          <el-col :span="24" style="height:40vh">
            <boxplot-chart :id="boxplotChart" :tableData="tableData"></boxplot-chart>
          </el-col>
          <el-col :span="24" style="height:40vh">
            <scatter-chart :id="scatterChart" :tableData="tableData"></scatter-chart>
          </el-col>
        </el-row>
      </el-card>
    </div>
      <el-dialog :visible.sync="dialogVisible" :title="$t('conChartHome_ChangCont')"  width="600px" class="handle-dialog" >
        <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :tSpcControlItemId="tSpcControlItemId" @setDefaultId="setDefaultId"></dialog-form>
      </el-dialog>
   </div>
</template>

<script>
import controlInfo from './controlComponment/controlInfo'
import controlChart from './controlComponment/controlChartSLCL'
import measurementTable from './controlComponment/measuremenTable'
import pointChart from './controlComponment/pointChart'
import dialogForm from './dialogForm'
import scatterChart from './controlComponment/scatterChart'
import boxplotChart from './controlComponment/boxplotChart'

export default {
  data () {
    return {
      tSpcControlItemId: '',
      pointData: [],
      cData0: {},
      cData1: {},
      dialogVisible: false,
      tableData: [],
      chartTitle1: '',
      chartTitle2: ''
    }
  },
  props: {
    chartDataList: {
      type: Object,
      default: () => { }
    },
    listIndex: {
      type: Number,
      default: 0
    },
    allData: {
      type: Array,
      default: () => []
    },
    hiddenButton: {
      type: Boolean,
      default: true
    },
    len: {
      type: Number,
      default: 0
    }
  },
  computed: {
    firstChart () {
      return 'firstChart' + this.listIndex.toString()
    },
    secondChart () {
      return 'secondChart' + this.listIndex.toString()
    },
    boxplotChart () {
      return 'boxplotChart' + this.listIndex.toString()
    },
    scatterChart () {
      return 'scatterChart' + this.listIndex.toString()
    }
  },
  methods: {
    async setDefaultId () {
      this.tSpcControlItemId = this.$route.query.id
      let controlItemIds = [].concat(this.tSpcControlItemId)
      let res = await this.$api.getQueryControlData(controlItemIds)
      if (res.code === '200') {
        this.resetData(res.data[0], 0)
      } else {
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.controlChart.controlChartFromSC)
          keys.forEach(key => {
            this.$refs.controlChart.controlChartFromSC[key] = ''
          })
          this.chartData1 = []
          this.chartData2 = []
        })
      }
    },
    enterControl () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dialog.chartType1 = this.chartTitle1
        this.$refs.dialog.chartType2 = this.chartTitle2
        let keys = Object.keys(this.$refs.dialog.dialogForm)
        keys.forEach(key => {
          this.$refs.dialog.dialogForm[key] = this[key]
        })
      })
    },
    exportChart () {
      this.getPdf('imageWrapper', this.$t('conChartHome_ContrCharPDF'))
    },
    resetData (data, i) {
      this.chartTitle1 = data.chartData[0].chartType
      this.chartTitle2 = data.chartData[1].chartType
      let { allData, listIndex } = this
      if (allData.length > 0) {
        this.tableData = allData[listIndex].measureData
        this.cData0 = allData[listIndex].chartData[0]
        this.cData1 = allData[listIndex].chartData[1]
        this.pointData = allData[listIndex].pointData
      } else {
        this.tableData = data.measureData
        this.cData0 = data.chartData[0]
        this.cData1 = data.chartData[1]
        this.pointData = data.pointData
      }
      this.$nextTick(() => {
        this.$refs.controlChart.chartType1 = data.chartData[0].chartType
        this.$refs.controlChart.chartType2 = data.chartData[1].chartType
        this.$refs.controlInfo.infoDataFrom = data.itemData
        for (let j in data.formulaData) {
          this.$refs.controlChart.controlChartFromSC[j] = data.formulaData[j]
        }
        this.$refs.controlChart.controlChartFromSC.usl = data.itemData.usl
        this.$refs.controlChart.controlChartFromSC.sl = data.itemData.sl
        this.$refs.controlChart.controlChartFromSC.lsl = data.itemData.lsl
        this.$refs.controlChart.controlChartFromSC.ucl1 = data.chartData[0].ucl
        this.$refs.controlChart.controlChartFromSC.cl1 = data.chartData[0].cl
        this.$refs.controlChart.controlChartFromSC.lcl1 = data.chartData[0].lcl
        this.$refs.controlChart.controlChartFromSC.ucl2 = data.chartData[1].ucl
        this.$refs.controlChart.controlChartFromSC.cl2 = data.chartData[1].cl
        this.$refs.controlChart.controlChartFromSC.lcl2 = data.chartData[1].lcl
      })
    },
    cannel () {
      this.dialogVisible = false
    },
    setContrastResult () {
      let { chartDataList } = this
      if (chartDataList) {
        this.resetData(chartDataList)
      } else {
        this.setDefaultId()
      }
    }
  },
  components: {
    controlInfo, controlChart, measurementTable, pointChart, dialogForm, scatterChart, boxplotChart
  },
  created () {
    this.setContrastResult()
  }
}
</script>
