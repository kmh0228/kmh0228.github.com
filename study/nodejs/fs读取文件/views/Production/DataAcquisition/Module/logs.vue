<template>
  <el-row class="mes-workstation-logs" :gutter="10" :class="changeSize">
    <el-col class="mes-main-tabs" :span="logWidth">
      <el-tabs v-model="logActiveName" class="mes-table">
        <el-tab-pane :label="logName" name="log">
          <div class="workstation-logs-item" style="margin-top:15px;" v-if="logsInfo.length===0">
            <p>{{$t('common_NoDataAvai')}}</p>
          </div>
          <el-scrollbar ref="scrollbarLogs">
            <div class="workstation-logs-item" v-for="(logs,i) in logsInfo" :key="i">
              <span class="workstation-logs-time">{{ logs.time }}</span>
              <span :class="logs.status===1?'workstation-logs-success':'workstation-logs-error'">{{$t('common_scann')}} [{{ logs.code }}] {{ logs.status | statusFormat }}! {{ logs.info }}</span>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :label="logTableName" name="list" class="mes-table-content" v-if="showLogTable">
          <station-table :checkedCurrentRow="checkedCurrentRow" :showCheckBox="showCheckBox" :tableLabel="logTableLabel" :tableData="logTableList"></station-table>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="12" class="mes-main-tabs workstation-record" v-if="showRecord">
      <el-tabs v-model="recordActive" class="mes-table">
        <el-tab-pane :label="recordName" name="record" class="mes-table-content">
          <el-scrollbar ref="scrollbarRecord" style="margin-top:0;">
            <station-table :tableLabel="recordTableLabel" :tableData="recordList" :rowClassName="rowClassName"></station-table>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import stationTable from './stationTable'
export default {
  data () {
    return {
      logActiveName: 'log',
      recordActive: 'record',
      logsInfo: [],
      logTableList: [],
      recordList: []
    }
  },
  props: {
    logName: {
      type: String,
      default: ''
    },
    logTableName: {
      type: String
    },
    logTableLabel: {
      type: Array
    },
    recordName: {
      type: String
    },
    recordTableLabel: {
      type: Array
    },
    checkedCurrentRow: {
      type: Function,
      default () {
        return () => { }
      }
    },
    showCheckBox: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    logWidth () {
      return this.recordName ? 12 : 24
    },
    showLogTable () {
      return this.logTableName
    },
    showRecord () {
      return this.recordName
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
  watch: {
    recordList: {
      handler (val) {
        let scrollbarLogs = this.$refs['scrollbarRecord'].$refs.wrap
        this.$nextTick(() => {
          scrollbarLogs.scrollTop = scrollbarLogs.scrollHeight
        })
      },
      deep: true
    }
  },
  methods: {
    /**
     * 创建操作日志
     * @param code 扫描码
     * @param status 0 失败 1 成功 2 不存在
     * @param info 操作详情
     */
    createLogsInfo (code, status, info) {
      let time = this.$dayjs().format('MM-DD HH:mm:ss')
      this.logsInfo.push({
        time,
        code,
        status: Number(status),
        info
      })
      let scrollbarLogs = this.$refs['scrollbarLogs'].$refs.wrap
      this.$nextTick(() => {
        scrollbarLogs.scrollTop = scrollbarLogs.scrollHeight
      })
    },
    // 已组装零件颜色区分
    rowClassName ({ row }) {
      if (row.requsetQty) {
        let { requsetQty, installedQty } = row
        return requsetQty === installedQty ? 'table-row-success' : 'table-row-error'
      } else if (row.result) {
        let { result } = row
        return result.toUpperCase() === 'PASS' ? 'table-row-success' : 'table-row-error'
      } else {
        return ''
      }
    }
  },
  components: { stationTable }
}
</script>
