<template>
  <div class="mes-main mes-workstation">
     <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress">
            <p>当前工单扫描进度：<span>[{{ progress.start }}]/[{{ progress.end }}]</span></p>
            <p>SSN Count：<span>[{{ ssnCount }}]</span></p>
          </div>
          <div class="workstation-head-handle">
            <ul>
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
    <station-logs logName="操作日志" recordName="测试记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <scan-input :scanType="nextStep" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
/**
 * 测试工站逻辑
 * 1.扫描公共SSN，获取返回的工作模版id，后台通过工作模版id判断是否存在文件路径
 * 2.若存在路径则读取文件名，通过文件名上的PASS或FAIL进行过站，向前台返回对应的操作日志
 * 3.若不存在路径，则向前台返回下一步需要手动扫描PASS或FAIL
 * 4.扫描PASS或FAIL后，向后台发起请求进行SSN过站，然后返回对应的操作日志
 * 5.无论扫描PASS或者FAIL，SSN Count始终累加
 */
import stationInfo from '../Module/info'
import stationLogs from '../Module/logs'
import scanInput from '../Module/scanInput'
export default {
  data () {
    return {
      workStationCode: sessionStorage.testCode || null,
      progress: {
        start: 0,
        end: 0
      },
      ssnCount: 0,
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
      recordTableLabel: [{
        key: 'productSn',
        label: '产品序列号'
      }, {
        key: 'workstation',
        label: '测试工站'
      }, {
        key: 'result',
        label: '测试结果'
      }, {
        key: 'dateTime',
        label: '测试时间'
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
          // 设置工单扫描进度
          this.progress.end = this.workStationInfo.requestQty
          await this.testScan()
          // 扫描SSN后，无论PASS或FAIL，累加SSN
          this.ssnCount++
        } else {
          let { logMsg, nextStep, scanStatus } = res.data
          this.nextStep = nextStep
          this.$refs.logs.createLogsInfo(code, scanStatus, logMsg)
        }
      } else {
        this.testScan(code)
      }
    },
    async testScan (code) {
      let command = code || ''
      // 从store仓库获取扫描需要传递的信息
      let keys = ['tPomJobResponseId', 'mWorkFlowSpecLastId', 'masterId', 'orderId', 'productId', 'inoutFlag', 'employeeCardId', 'processId', 'productSn', 'shiftId', 'lineId', 'stationId', 'mWorkflowSpecLastNodeId', 'mWorkflowSpecNextNodeId', 'mComEqpId']
      let info = {}
      keys.forEach(key => {
        info[key] = this.workStationInfo[key] || ''
      })
      let data = Object.assign(info, { command })
      let res = await this.$api.testScan(data)
      let dateTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      let { logMsg, nextStep, scanStatus } = res.data
      let currentStep = this.nextStep
      this.nextStep = nextStep
      let scanCode = code || this.workStationInfo.productSn
      this.$refs.logs.createLogsInfo(scanCode, scanStatus, logMsg)
      // 添加测试记录
      if (currentStep === 'SSN') {
        this.$refs.logs.recordList.push({
          productSn: this.workStationInfo.productSn,
          workstation: this.workStationInfo.lineStationName,
          result: nextStep === 'SSN' ? scanStatus === '0' ? 'FAIL' : 'PASS' : '',
          dateTime
        })
      } else {
        let index = this.$refs.logs.recordList.length - 1
        this.$refs.logs.recordList[index].result = code
        this.$refs.logs.recordList[index].dateTime = dateTime
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
