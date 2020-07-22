<template>
  <div class="mes-main mes-workstation">
    <!-- <el-row class="mes-workstation-shipout-head mes-table">
      <el-form :model="shipoutForm" class="mes-workstation-head el-col el-col-12" label-width="25%" label-position="left">
        <el-form-item label="DN">
          <el-input v-model="shipoutForm.dn" placeholder="请输入DN" @keydown.native.enter="scanDn"></el-input>
        </el-form-item>
        <el-form-item label="销售单号">
          <el-input v-model="shipoutForm.docNo" readonly></el-input>
        </el-form-item>
        <el-form-item label="出货地点">
          <el-input v-model="shipoutForm.site" readonly></el-input>
        </el-form-item>
        <el-form-item label="栈板号">
          <el-input v-model="shipoutForm.packNo" placeholder="请扫描" @keydown.native.enter="shipoutScan"></el-input>
        </el-form-item>
      </el-form>
      <el-col :span="12" class="mes-table-content" style="background-color:#fff;">
        <el-table :data="shiptTable" border highlight-current-row size="mini">
          <el-table-column type="index" label="序号" align="center" width="60" :index="indexMethod"></el-table-column>
          <el-table-column label="成品料号" prop="mComMaterialId"></el-table-column>
          <el-table-column label="出货需求数量" prop="requestQty"></el-table-column>
          <el-table-column label="已出货数量" prop="shippedQty"></el-table-column>
        </el-table>
      </el-col>
    </el-row> -->
    <!-- <div style="margin:0 15px;" class="mes-table">
      <p style="padding-bottom:10px;border-bottom:1px solid #B2B2B2;">出货记录</p>
      <div class="mes-table-content">
        <el-table :data="shipoutRecord" border size="mini" empty-text="暂无出货记录">
          <el-table-column type="index" label="序号" align="center" width="60" :index="recordIndexMethod"></el-table-column>
          <el-table-column prop="docNo" label="DN" align="center"></el-table-column>
          <el-table-column prop="packNo" label="栈板号" align="center"></el-table-column>
          <el-table-column prop="mComMaterialId" label="成品料号" align="center"></el-table-column>
          <el-table-column prop="boxQty" label="箱数" align="center"></el-table-column>
          <el-table-column prop="currentQty" label="产品数量" align="center"></el-table-column>
          <el-table-column prop="shippedDt" label="扫描时间" align="center" :formatter="formatDateTime"></el-table-column>
        </el-table>
      </div>
    </div> -->
    <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress" :class="changeSize">
            <p>当前DN出货进度：<span>[{{ progress.start }}]/[{{ progress.end }}]</span></p>
            <p>栈板数量：<span>[{{ progress.count }}]</span></p>
          </div>
        </el-alert>
      </el-col>
    </el-row>
    <station-info :workStationInfo="workStationInfo" workStationStype="shipout" :workStationCode="workStationCode" ref="info"></station-info>
    <station-logs logName="操作日志" logTableName="DN详情列表" :logTableLabel="logTableLabel" recordName="出货记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <!-- 扫描区 -->
    <scan-input :scanType="nextStep" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
/**
 * 出货工站逻辑
 * 1.扫描员工号登录
 * 2.扫描DN,获取DN对应的销售单号、DN项次、出货地点，以及DN详情列表，已关闭/不存在的DN需重新扫描DN
 * 3.扫描栈板号，扫描一个栈板号，需重新获取一次DN详情列表
 */
import stationInfo from '../Module/info'
import stationLogs from '../Module/logs'
import scanInput from '../Module/scanInput'
export default {
  data () {
    return {
      progress: {
        count: 0,
        start: 0,
        end: 0
      },
      workStationCode: sessionStorage.shipoutCode || null,
      workStationInfo: {
        userName: '',
        ip: '',
        stationType: '',
        model: '',
        lineStationName: '',
        lineCode: '',
        docNo: '',
        productSn: ''
      },
      // dnResultInfo: {},
      // shiptTable: [],
      // shipoutRecord: [],
      logTableLabel: [{
        key: 'materialNo',
        label: '成品料号'
      }, {
        key: 'requestQty',
        label: '出货需求数量'
      }, {
        key: 'shippedQty',
        label: '已出货数量'
      }],
      recordTableLabel: [{
        key: 'docNo',
        label: 'DN'
      }, {
        key: 'packNo',
        label: '栈板号'
      }, {
        key: 'materialNo',
        label: '成品料号'
      }, {
        key: 'boxQty',
        label: '箱数'
      }, {
        key: 'currentQty',
        label: '产品数量'
      }, {
        key: 'shippedDt',
        label: '扫描时间'
      }],
      tipsOption: {
        show: false,
        title: '',
        tipsType: ''
      },
      nextStep: '员工号'
    }
  },
  computed: {
    changeSize () {
      const changeFontSize = Number(localStorage.getItem('fontSize'))
      let size = ''
      switch (changeFontSize) {
        case 1:
          size = 'font-small'
          break
        case 2:
          size = 'font-normal'
          break
        case 3:
          size = 'font-bigger'
          break
        case 4:
          size = 'font-oversize'
          break
        default:
          size = 'font-oversize'
          break
      }
      return size
    }
  },
  methods: {
    // indexMethod (index) {
    //   return index + 1
    // },
    // recordIndexMethod (index) {
    //   return index + 1
    // },
    // formatDateTime (row, column, cellValue, index) {
    //   return this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    // },
    async scanCode (scanValue) {
      if (this.nextStep === '员工号') {
        let res = await this.$refs.info.getUserInfo(scanValue)
        let { status, nextStep } = res
        if (status === 0) {
          this.$refs.logs.createLogsInfo(scanValue, status, nextStep)
        } else {
          this.nextStep = 'DN'
          this.$refs.logs.createLogsInfo(scanValue, status, `请扫描${this.nextStep}`)
        }
      } else if (this.nextStep === 'DN') {
        this.scanDn(scanValue)
      } else {
        this.shipoutScan(scanValue)
      }
    },
    /**
     * 扫描DN
     * @param scanValue 扫描值/DN
     * @param isOnly 是否只获取DN详情列表 true => 获取数据，不添加操作日志
     */
    async scanDn (scanValue, isOnly) {
      let sendData = { docNo: scanValue }
      let res = await this.$api.getUncompletedShipInfo(sendData)
      if (res.code === '200') {
        let { list, scan } = res.data
        this.$refs.logs.logTableList = list.length > 0 ? res.data.list[0].shipitemList : []
        let { scanStatus, nextStep, logMsg } = scan
        this.nextStep = scanStatus === '1' ? '栈板号' : nextStep
        this.workStationInfo = Object.assign(this.workStationInfo, sendData)
        if (!isOnly) {
          this.$refs.logs.createLogsInfo(scanValue, scanStatus, logMsg)
        }
      } else {
        this.$refs.logs.createLogsInfo(scanValue, '0', `请重新扫描${this.nextStep}`)
      }
    },
    // 扫描栈板号
    async shipoutScan (scanValue) {
      let { docNo } = this.workStationInfo
      let res = await this.$api.shipoutScan({ packNo: scanValue, docNo })
      if (res.code === '200') {
        if (res.data.shipRecordDto) {
          let { shipRecordDto } = res.data
          shipRecordDto.shippedDt = this.$dayjs(shipRecordDto.shippedDt).format('YYYY-MM-DD HH:mm:ss')
          this.$refs.logs.recordList.push(shipRecordDto)
        }
        let { scan } = res.data
        let { scanStatus, nextStep, logMsg } = scan
        if (scanStatus === '1') {
          this.progress.count++
          this.scanDn(docNo, true)
        }
        this.nextStep = nextStep === 'DN' ? nextStep : '栈板号'
        this.workStationInfo = Object.assign(this.workStationInfo, { packNo: scanValue })
        this.$refs.logs.createLogsInfo(scanValue, scanStatus, logMsg)
      } else {
        this.$refs.logs.createLogsInfo(scanValue, '0', `请重新扫描${this.nextStep}`)
      }
    }
  },
  components: {
    stationInfo, stationLogs, scanInput
  }
}
</script>
