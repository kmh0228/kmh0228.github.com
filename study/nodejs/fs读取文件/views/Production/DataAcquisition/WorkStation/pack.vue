<template>
  <div class="mes-main mes-workstation">
    <!-- 顶部 -->
    <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress" :class="changeSize">
            <p>工单完成进度：<span>[{{ progress.start }}]/[{{ progress.end }}]</span></p>
             <p>当前包装进度：<span>[{{ packProgress.stdQty }}]/[{{ packProgress.currentQty }}]</span></p>
            <p>SSN Count：<span>[{{ ssnCount }}]</span></p>
          </div>
          <div class="workstation-head-handle">
            <ul>
              <li>
                <span @click="showRouter = !showRouter" :class="changeSize">查看路由</span>
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
              <div class="process-station-group" :class="changeSize">
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
        <el-button size="mini" :class="changeSize">完成</el-button>
        <el-button size="mini" :class="changeSize">清单打印</el-button>
      </el-col>
    </el-row>
    <!-- 基本信息 -->
    <station-info :workStationInfo="workStationInfo" workStationStype="pack" :workStationCode="workStationCode" ref="info"></station-info>
    <!-- 操作日志及记录 -->
    <station-logs logName="操作日志" logTableName="未关闭包装预警" :showCheckBox="true" :logTableLabel="logTableLabel" recordName="包装记录" :checkedCurrentRow="checkedCurrentRow" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <!-- 扫描区 -->
    <scan-input :scanType="nextStep" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
/**
 * 包装工站逻辑
 * @param command 指令
 * @param palletId 栈板号ID
 * 1、扫描员工号
 * 2、第一次扫描必须是SSN，若扫描特殊指令则提示扫描特殊指令失败
 * 3、开始扫描SSN，调用公共SSN接口，认证通过则获取未关闭栈板预警以及包装SSN过站
 * 4、NEW关键字清空palletId
 * 5、UNPACK 解除包装关联关系 必须带有palletId
 * 6、CLOSE 关闭当前包装 必须带有palletId
 */
import stationInfo from '../Module/info'
import stationLogs from '../Module/logs'
import scanInput from '../Module/scanInput'
export default {
  data () {
    return {
      workStationCode: sessionStorage.packCode || null,
      progress: {
        start: 0,
        end: 0
      },
      packProgress: {
        stdQty: 0,
        currentQty: 0
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
        productSn: '',
        pack_no: ''
      },
      nextStep: '员工号',
      logTableLabel: [{
        key: 'pack_no',
        label: '箱号'
      }, {
        key: 'current_qty',
        label: '包装数'
      }, {
        key: 'std_qty',
        label: '存放数量'
      }],
      recordTableLabel: [{
        key: 'pack_no',
        label: '包装号'
      }, {
        key: 'PRODUCT_SN',
        label: '产品序列号'
      }, {
        key: 'CREATED_DT',
        label: '包装时间'
      }],
      command: '',
      palletId: '',
      commandList: ['NEW', 'UNPACK', 'CLOSE']
    }
  },
  computed: {
    routerClass () {
      return this.showRouter ? 'fa-angle-double-up' : 'fa-angle-double-down'
    },
    senData () {
      let { employeeCardId, masterId } = this.workStationInfo
      let { command, palletId } = this
      return { masterId, command, palletId, employeeCardId }
    },
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
          size = 'font-normal'
          break
      }
      return size
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
      } else {
        this.getRecordList(code)
      }
    },
    // 获取未关闭包装预警
    async getNotColsePallet () {
      let res = await this.$api.getNotColsePallet()
      let logTableList = res.data
      logTableList.map(item => {
        item.isChecked = false
      })
      this.$refs.logs.logTableList = logTableList
    },
    // 选择箱号
    checkedCurrentRow (row) {
      const currentRow = { ...row }
      if (currentRow.isChecked) {
        let logTableList = this.$refs.logs.logTableList
        logTableList.map((val, index) => {
          val.isChecked = false
          if (val.pack_no === currentRow.pack_no) {
            logTableList.splice(index, 1, currentRow)
            this.palletId = currentRow.pack_no
            this.workStationInfo.pack_no = currentRow.pack_no
            this.$message.success(`当前已选择箱号[${this.palletId}]`)
            this.getPackRecordList(currentRow.pack_no)
          }
        })
      } else {
        this.palletId = ''
        this.workStationInfo.pack_no = ''
        this.getPackRecordList('')
      }
    },
    // 获取包装记录
    async getPackRecordList (tPomJobActPackId) {
      let res = await this.$api.getPackRecords({ tPomJobActPackId })
      let recordList = res.data
      recordList.forEach(item => {
        item.CREATED_DT = this.$dayjs(item.CREATED_DT).format('YYYY-MM-DD HH:mm:ss')
      })
      this.$refs.logs.recordList = recordList
    },
    // SSN扫描及获取包装记录
    async getRecordList (scanValue) {
      if (!this.palletId && this.commandList.indexOf(scanValue) !== -1) {
        return this.$refs.logs.createLogsInfo(scanValue, 0, '扫描指令失败，请先扫描SSN')
      }
      if (scanValue === 'NEW') {
        this.command = scanValue
        this.palletId = ''
        this.$refs.logs.createLogsInfo(scanValue, 1, '扫描指令成功，请继续扫描SSN')
      } else if (scanValue === 'UNPACK') {
        this.command = scanValue
        this.$refs.logs.createLogsInfo(scanValue, 1, '扫描指令成功，请继续扫描SSN')
      } else if (scanValue === 'CLOSE') {
        this.command = scanValue
        this.$refs.logs.createLogsInfo(scanValue, 1, '扫描指令成功，请继续扫描SSN')
      } else {
        let res = await this.$refs.info.sacnSSNCommon(scanValue)
        if (res.code === '200') {
          // 设置工单扫描进度
          this.progress.start = this.workStationInfo.passedSSnCount
          this.progress.end = this.workStationInfo.requestQty
          // 公共SSN验证成功后 获取未关闭栈板预警以及包装记录
          // let { masterId } = this.workStationInfo
          await this.packScan(scanValue)
          await this.getNotColsePallet()
        } else {
          let { logMsg, nextStep, scanStatus } = res.data
          this.nextStep = nextStep
          this.$refs.logs.createLogsInfo(scanValue, scanStatus, logMsg)
        }
      }
    },
    // 扫描SSN
    async packScan (scanValue) {
      let keys = ['masterId', 'orderId', 'employeeCardId', 'nextValue', 'stationId', 'lineId', 'productId', 'shiftId', 'mWorkFlowSpecLastId', 'mWorkflowSpecLastNodeId', 'mWorkflowSpecNextNodeId', 'tPomJobResponseId', 'inoutFlag', 'mComEqpId']
      let info = {}
      keys.forEach(key => {
        info[key] = this.workStationInfo[key] || ''
      })
      let data = Object.assign(this.senData, info, { scanValue })
      let res = await this.$api.packSsnScan(data)
      let { logMsg, scanStatus, nextArg, packNo } = res.data.scanResult
      if (res.code === '200') {
        // SSN计数V
        if (res.data.data) {
          const { stdQty, currentQty } = res.data.data
          this.packProgress.stdQty = stdQty
          this.packProgress.currentQty = currentQty
        }
        if (packNo) {
          this.getPackRecordList(packNo)
        } else {
          this.getPackRecordList(this.palletId)
        }
        this.ssnCount++
      }
      this.palletId = nextArg
      if (packNo) {
        this.workStationInfo.pack_no = packNo
      }
      this.$refs.logs.createLogsInfo(scanValue, scanStatus, logMsg)
    }
  },
  components: {
    stationInfo,
    stationLogs,
    scanInput
  },
  created () {
    this.getNotColsePallet()
  }
}
</script>
