<template>
  <div class="mes-main mes-workstation">
    <!-- 顶部 -->
    <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress">
            <!-- <p>工单完成进度：<span>[{{ progress.start }}]/[{{ progress.end }}]</span></p> -->
            <p>当前上栈板进度：<span>[{{ packProgress.start }}]/[{{ packProgress.end }}]</span></p>
            <p>上栈板 Count：<span>[{{ ssnCount }}]</span></p>
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
    <!-- 基本信息 -->
    <station-info :workStationInfo="workStationInfo" workStationStype="storage" :workStationCode="workStationCode" ref="info"></station-info>
    <!-- 操作日志及记录 -->
    <station-logs logName="操作日志" logTableName="未关闭栈板预警" :showCheckBox="true" :logTableLabel="logTableLabel" :checkedCurrentRow="checkedCurrentRow" recordName="上栈板记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <!-- 扫描区 -->
    <scan-input :scanType="nextStep" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
/**
 * 栈板工站逻辑与包装工站一致
 * 为后面扩展性或需求变更，故未用同一个组件
 */
import stationInfo from '../Module/info'
import stationLogs from '../Module/logs'
import scanInput from '../Module/scanInput'
export default {
  data () {
    return {
      workStationCode: sessionStorage.storageCode || null,
      progress: {
        start: 0,
        end: 0
      },
      packProgress: {
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
        productSn: '',
        pack_no: ''
      },
      nextStep: '员工号',
      logTableLabel: [{
        key: 'pack_no',
        label: '栈板号'
      }, {
        key: 'current_qty',
        label: '栈板数'
      }, {
        key: 'std_qty',
        label: '存放数量'
      }],
      recordTableLabel: [{
        key: 'pack_no',
        label: '栈板号'
      }, {
        key: 'BOXID',
        label: '箱号'
      }, {
        key: 'PRODUCT_SN',
        label: 'SN'
      }, {
        key: 'CREATED_DT',
        label: '上栈板时间'
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
          this.nextStep = '箱号'
          this.$refs.logs.createLogsInfo(code, status, `请扫描${nextStep}`)
        }
      } else {
        this.getRecordList(code)
      }
    },
    // 获取未关闭栈板预警
    async getStorageNotColsePallet (id) {
      let res = await this.$api.getStorageNotColsePallet(id)
      let logTableList = res.data
      logTableList.map(item => {
        item.isChecked = false
      })
      this.$refs.logs.logTableList = logTableList
    },
    // 选择栈板号
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
            this.$message.success(`当前已选择栈板号[${this.palletId}]`)
            this.getStorageRecordList(currentRow.pack_no)
          }
        })
      } else {
        this.palletId = ''
        this.workStationInfo.pack_no = ''
        this.getStorageRecordList('')
      }
    },
    // 获取上栈板记录
    async getStorageRecordList (tPomJobActPackId) {
      let res = await this.$api.getStorageRecords({ tPomJobActPackId })
      let recordList = res.data
      recordList.forEach(item => {
        item.CREATED_DT = this.$dayjs(item.CREATED_DT).format('YYYY-MM-DD HH:mm:ss')
      })
      this.$refs.logs.recordList = recordList
    },
    // SSN扫描及获取上栈板记录
    async getRecordList (scanValue) {
      if (!this.palletId && this.commandList.indexOf(scanValue) !== -1) {
        return this.$refs.logs.createLogsInfo(scanValue, 0, '扫描指令失败，请先扫描箱号')
      }
      if (scanValue === 'NEW') {
        this.command = scanValue
        this.palletId = ''
        this.$refs.logs.createLogsInfo(scanValue, 1, '扫描指令成功，请继续扫描箱号')
      } else if (scanValue === 'UNPACK') {
        this.command = scanValue
        this.$refs.logs.createLogsInfo(scanValue, 1, '扫描指令成功，请继续扫描箱号')
      } else if (scanValue === 'CLOSE') {
        this.command = scanValue
        this.$refs.logs.createLogsInfo(scanValue, 1, '扫描指令成功，请继续扫描箱号')
      } else {
        await this.storageSsnScan(scanValue)
        await this.getStorageNotColsePallet('ABC')
      }
    },
    async storageSsnScan (scanValue) {
      let data = Object.assign(this.senData, { scanValue })
      let res = await this.$api.storageSsnScan(data)
      let { logMsg, scanStatus, nextArg, packNo } = res.data.scanResult
      if (res.code === '200') {
        // SSN计数
        if (res.data.data) {
          const { stdQty, currentQty } = res.data.data
          this.packProgress.stdQty = stdQty
          this.packProgress.currentQty = currentQty
        }
        if (packNo) {
          this.getStorageRecordList(packNo)
        } else {
          this.getStorageRecordList(this.palletId)
        }
        this.ssnCount++
      }
      this.palletId = nextArg
      this.workStationInfo.pack_no = packNo
      this.$refs.logs.createLogsInfo(scanValue, scanStatus, logMsg)
    }
  },
  components: {
    stationInfo,
    stationLogs,
    scanInput
  },
  created () {
    this.getStorageNotColsePallet('ABC')
  }
}
</script>
