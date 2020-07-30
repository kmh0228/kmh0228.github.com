<template>
  <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="printingMethod">{{$t('common_Print')}}</el-button>
      <el-button type="primary" plain size="mini" @click="getdata">{{$t('lrr_see')}}</el-button>
    </div>
    <el-row :gutter="20" style="margin-top:1vh">
    <el-col :span="15">
      <span style="margin:0 1vw">{{$t('lrr_InspeType')}}</span>
       <el-select v-model="checkType" style="width:30%;line-height:2"  size="mini" >
         <el-option v-for="(option,i) in checkTypeList" :key="i" :label="option" :value="option"></el-option>
       </el-select>
       <el-date-picker  style="width:30%;float:right" v-model="timeList" type="daterange"  align="right"  unlink-panels  :range-separator="$t('common_to')"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')"  :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
       <span style="float:right;line-height:2;margin-right:1vw">{{$t('lrr_InspePeri')}}</span>
    </el-col>
    </el-row>
   <div style="margin:5vh 0">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('lrr_ByTime')" name="dateTime"></el-tab-pane>
      <el-tab-pane :label="$t('lrr_BySupp')" name="vendorCode"></el-tab-pane>
      <el-tab-pane :label="$t('lrr_ByItemNo')" name="material"></el-tab-pane>
    </el-tabs>
     <el-radio-group v-model="chartType"  v-if="activeName !== 'dateTime'" size="mini" style="margin-left:0.5vw">
        <el-radio-button label="pie"> <i style="font-size:0.8vw" class="fa fa-pie-chart" aria-hidden="true"></i></el-radio-button>
        <el-radio-button label="bar"> <i style="font-size:0.8vw" class="fa fa-bar-chart" aria-hidden="true"></i></el-radio-button>
     </el-radio-group>
      <el-form class="el-row mes-form-rule"  ref="dialogFrom"  label-position="left"  label-width="80px" v-if="activeName === 'dateTime'">
        <el-form-item :label="$t('common_suppl')" class="el-col el-col-7">
          <el-select v-model="vendorCode"  style="width:70%">
            <el-option v-for="(option,i) in vendorList" :key="i" :label="option.mWmsVendorName" :value="option.mWmsVendorCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_PorN')" class="el-col el-col-7 el-col-offset-1">
           <material-select v-model="materialId"  style="width:70%"></material-select>
        </el-form-item>
        <el-form-item :label="$t('lrr_timeSlot')" class="el-col-9">
          <el-radio-group v-model="byType">
            <el-radio-button label="byDay">{{$t('lrr_ByDay')}}</el-radio-button>
            <el-radio-button label="byWeek">{{$t('lrr_ByWeek')}}</el-radio-button>
            <el-radio-button :disabled="disabledButton" label="byMonth">{{$t('lrr_month')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
   </div>
   <div v-if="activeName === 'dateTime'">
      <div style="height:40vh;width:60%;float:left" >
          <lrr-bar id="bar1" :xData="xData" :barSeiesData="barSeiesData" :barTitle="this.$t('lrr_TimePeriBatcRateRepo')"></lrr-bar>
      </div>
      <div style="height:40vh;width:40%;float:right">
        <el-scrollbar style="height:100%;">
        <el-table :data="barTable" border>
          <el-table-column :label="$t('lrr_timeSlot')" prop="reportName" align="center"></el-table-column>
          <el-table-column :label="$t('lrr_RejecRate')" prop="reportValue" align="center"></el-table-column>
        </el-table>
        </el-scrollbar>
      </div>
   </div>
    <div v-else>
     <div style="height:40vh;width:60%;float:left">
      <lrr-bar id="bar2" :xData="xData" :barSeiesData="barSeiesData"  v-if="chartType === 'bar'" :barTitle="echartTitle"></lrr-bar>
      <lrr-chart id="pie1" :pieData="pieData" :echartTitle="echartTitle" v-else></lrr-chart>
    </div>
    <div style="height:40vh;width:40%;float:right">
      <el-scrollbar style="height:100%;">
      <el-table :data="pieTable" border>
        <el-table-column :label="$t('common_suppl')" prop="reportName" align="center" v-if="activeName === 'vendorCode'"></el-table-column>
        <el-table-column :label="$t('common_PorN')" prop="reportName" align="center" v-if="activeName === 'material'"></el-table-column>
        <el-table-column :label="$t('lrr_RejecRate')" prop="reportValue" align="center"></el-table-column>
      </el-table>
      </el-scrollbar>
    </div>
   </div>
  </div>
</template>

<script>
import lrrChart from './echartComponent/lrrChart'
import lrrBar from './echartComponent/lrrBar'
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import echarts from 'echarts'

export default {
  data () {
    return {
      dateType: '',
      activeName: 'dateTime',
      byType: 'byDay',
      pieData: [],
      xData: [],
      barSeiesData: [],
      barTable: [],
      vendorList: [],
      chartType: 'pie',
      checkTypeList: ['IQC'],
      checkType: 'IQC',
      timeList: [],
      pickerOptions: {
        shortcuts: [{
          text: this.$t('lrr_LastWeek'),
          onClick: (picker) => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
            this.dateType = 'week'
          }
        }, {
          text: this.$t('lrr_LastMont'),
          onClick: (picker) => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
            this.dateType = 'month'
          }
        }]
      },
      materialId: '',
      vendorCode: '',
      pieTable: []
    }
  },
  computed: {
    echartTitle () {
      return this.activeName === 'vendorCode' ? this.$t('lrr_SupplRejeRateRepo') : this.$t('lrr_MaterNumbBatcRateRepo')
    },
    disabledButton () {
      return this.dateType === 'week'
    }
  },
  watch: {
    activeName (val) {
      this.getdata()
    },
    chartType (val) {
      this.getdata()
    }
  },
  methods: {
    setArray () {
      this.xData = []
      this.barSeiesData = []
      let { xData, barSeiesData, barTable } = this
      barTable.forEach(item => {
        xData.push(item.reportName)
        barSeiesData.push(item.reportValue)
      })
    },
    async getdata () {
      let { byType, timeList, materialId, vendorCode, activeName, dateType } = this
      let startTime = timeList[0] ? timeList[0] : ''
      let endTime = timeList[1] ? timeList[1] : ''
      const reportType = activeName
      if (reportType !== 'dateTime') {
        vendorCode = ''
        byType = ''
        materialId = ''
      }
      // let data = Object.assign({ byType, materialId, vendorCode, reportType, dateType, startTime, endTime })
      const data = new FormData()
      data.append('byType', byType)
      data.append('materialId', materialId)
      data.append('vendorCode', vendorCode)
      data.append('reportType', reportType)
      data.append('dateType', dateType)
      data.append('startTime', startTime)
      data.append('endTime', endTime)
      const res = await this.$api.getLrrReportData(data)
      if (this.activeName === 'dateTime') {
        this.barTable = res.data
        this.pieData = []
        this.setArray()
      } else {
        if (this.chartType === 'pie') {
          this.pieData = []
          this.pieTable = []
          let obj = {}
          res.data.forEach(item => {
            if (item.reportName !== null) {
              obj = {
                name: item.reportName,
                value: item.reportValue
              }
              this.pieData.push(obj)
              this.pieTable.push(item)
            }
          })
          this.barTable = []
        } else {
          this.barTable = []
          this.pieData = []
          this.pieTable = []
          res.data.forEach(item => {
            if (item.reportName !== null) {
              this.barTable.push(item)
              this.pieTable.push(item)
            }
          })
          this.setArray()
        }
      }
    },
    async getVendors () {
      let data = {
        mWmsVendorCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getVendors(data)
      // if (res.code === '200') {
      //   this.vendorList = res.data.list
      // } else {
      //   this.vendorList = []
      // }
      this.vendorList = res.code === '200' ? res.data.list : []
    },
    printingMethod () {
      let id
      if (this.activeName === 'dateTime') {
        id = 'bar1'
      } else {
        if (this.chartType === 'bar') {
          id = 'bar2'
        } else {
          id = 'pie1'
        }
      }
      let myChart = echarts.init(document.getElementById(id))
      let canvas = myChart.getRenderedCanvas({
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      let data = canvas.toDataURL('image/png', 1)
      // const image = new Image()
      // image.src = data
      this.downloadFile('批退率.png', data)
    },
    // 下载
    downloadFile (fileName, content) {
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content) // new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      // aLink.dispatchEvent(evt);
      aLink.click()
    },
    // base64转blob
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length

      let uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    }
  },
  created () {
    this.setArray()
    this.getVendors()
  },
  components: {
    lrrChart, lrrBar, materialSelect, echarts
  }

}
</script>
