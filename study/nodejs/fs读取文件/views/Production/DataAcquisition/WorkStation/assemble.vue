<template>
  <div class="mes-main mes-workstation">
    <!-- 顶部 -->
    <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress">
            <p>当前工单扫描进度：<span>[{{ progress.start }}]/[{{ progress.end }}]</span></p>
            <p>SSN Count：<span>[{{ ssnCount }}]</span></p>
          </div>
          <div class="workstation-head-handle">
            <ul>
              <li><span>已组装完成产品SN列表</span></li>
              <li>|</li>
              <li>
                <span @click="showRouter = !showRouter">查看路由</span>
                <i class="fa" :class="routerClass"></i>
              </li>
            </ul>
          </div>
        </el-alert>
      </el-col>
      <el-col :span="24">
         <el-collapse-transition>
          <div v-if="showRouter" class="router-process">
            <div class="process-wrap">
              <div class="process-station-group">
                <span class="process-wrap-station">组装工站</span>
                <span class="process-wrap-station">测试工站</span>
                <span class="process-wrap-station">包装工站</span>
              </div>
              <div class="process-wrap-line"></div>
            </div>
          </div>
        </el-collapse-transition>
      </el-col>
      <el-col :span="24" class="workstation-head-btn">
        <el-button size="mini">完成</el-button>
        <el-button size="mini">清单打印</el-button>
      </el-col>
    </el-row>
    <station-info :workStationInfo="workStationInfo" :workStationCode="workStationCode" ref="info"></station-info>
    <!-- 扫描详情及记录 -->
    <station-logs logName="扫描详情" logTableName="组装清单" recordName="组装记录" :logTableLabel="logTableLabel" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <!-- 扫描区 -->
    <scan-input :scanType="nextStep" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
import stationInfo from '../Module/info'
import stationLogs from '../Module/logs'
import scanInput from '../Module/scanInput'
export default {
  data () {
    return {
      workStationCode: sessionStorage.assembleCode || null,
      progress: {
        start: 0,
        end: 0
      },
      ssnCount: 0,
      ssn: '',
      showRouter: false,
      workStationInfo: {
        userName: '',
        ip: '',
        stationType: '',
        model: '',
        lineStationName: '',
        lineCode: '',
        docNo: '',
        mComMaterialId: '',
        productSn: ''
      },
      nextStep: '员工号',
      logTableLabel: [{
        key: 'materialNo',
        label: '零件料号'
      }, {
        key: 'materialDesc',
        label: '物料描述'
      }, {
        key: 'requestQty',
        label: '需求数量'
      }, {
        key: 'installedQty',
        label: '完成数量'
      }, {
        key: 'scanType',
        label: '扫描方式'
      }, {
        key: 'bcValue',
        label: 'EEE CODE'
      }],
      recordTableLabel: [{
        key: 'materialNo',
        label: '零件料号'
      }, {
        key: 'materialDesc',
        label: '物料描述'
      }, {
        key: 'parsedCsn',
        label: '零件序号'
      }]
    }
  },
  computed: {
    routerClass () {
      return this.showRouter ? 'fa-angle-double-up' : 'fa-angle-double-down'
    }
  },
  methods: {
    async scanCode (code) {
      // nextStep为员工号，则扫描员工号
      if (this.nextStep === '员工号') {
        let res = await this.$refs.info.getUserInfo(code)
        let { status, nextStep } = res
        if (status === 0) {
          this.$refs.logs.createLogsInfo(code, status, nextStep)
        } else {
          this.nextStep = nextStep
          this.$refs.logs.createLogsInfo(code, status, `请扫描${nextStep}`)
        }
      } else if (this.nextStep === 'SSN') {
        let res = await this.$refs.info.sacnSSNCommon(code)
        if (res.code === '200') {
          // 扫描SSN成功后 缓存SSN到本地
          this.ssn = code
          // 扫描SSN成功后 获取组装记录
          this.getRecordList(code)
          // this.assyScan(code)
          // this.nextStep = 'C_Materil'
          // this.$refs.logs.createLogsInfo(code, '1', `请扫描${this.nextStep}`)
          // 设置工单扫描进度
          this.progress.start = this.workStationInfo.passedSSnCount
          this.progress.end = this.workStationInfo.requestQty
        } else {
          let { logMsg, nextStep, scanStatus } = res.data
          this.nextStep = nextStep
          this.$refs.logs.createLogsInfo(code, scanStatus, logMsg)
        }
      } else {
        await this.assyScan(code)
        await this.getRecordList()
      }
    },
    async assyScan (scanValue) {
      let { ssn } = this
      // 从store仓库获取组装工站接口需要传递的信息
      let keys = ['masterId', 'orderId', 'employeeCardId', 'nextValue', 'stationId', 'lineId', 'productId', 'shiftId', 'mWorkFlowSpecLastId', 'mWorkflowSpecLastNodeId', 'mWorkflowSpecNextNodeId', 'tPomJobResponseId', 'inoutFlag', 'mComEqpId']
      let info = {}
      keys.forEach(key => {
        info[key] = this.workStationInfo[key] || ''
      })
      let data = Object.assign(info, { ssn, scanValue })
      let res = await this.$api.assyScan(data)
      if (res.code === '200' && this.nextStep === 'SSN') {
        // SSN计数
        this.ssnCount++
      }
      let { logMsg, nextStep, scanStatus, nextArg } = res.data.scanResult
      this.nextStep = nextStep
      this.workStationInfo.nextValue = nextArg || ''
      this.$refs.logs.createLogsInfo(scanValue, scanStatus, logMsg)
    },
    async getRecordList (scanValue) {
      let { masterId, orderId, productId, stationId } = this.workStationInfo
      let res = await this.$api.getPartList({ masterId, orderId, productId, stationId })
      if (res.code === '200') {
        let { list, otherInfo, scanResult } = res.data
        this.$refs.logs.logTableList = list
        this.$refs.logs.recordList = otherInfo
        if (scanValue) {
          let { nextStep, scanStatus, ssnArg } = scanResult
          if (ssnArg) {
            this.assyScan(scanValue)
          } else {
            this.nextStep = nextStep
            this.$refs.logs.createLogsInfo(scanValue, scanStatus, `请扫描${nextStep}`)
          }
        }
      }
    }
  },
  components: {
    stationInfo,
    stationLogs,
    scanInput
  }
}
</script>
