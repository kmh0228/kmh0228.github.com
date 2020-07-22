<template>
  <div class="mes-main mes-workstation">
    <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress" :class="changeSize">
            <p>当前工单扫描进度：<span>0/0</span></p>
            <p>SSN Count：<span>0</span></p>
          </div>
        </el-alert>
      </el-col>
    </el-row>
    <station-info :workStationInfo="workStationInfo" workStationCode="login" :isCheck="false"></station-info>
    <station-logs logName="操作日志" ref="logs"></station-logs>
    <scan-input scanType="工站代码" @scan-code="scaStationCode"></scan-input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import stationInfo from '../Module/info'
import stationLogs from '../Module/logs'
import scanInput from '../Module/scanInput'
export default {
  data () {
    return {
      workStationInfo: {}
    }
  },
  computed: {
    ...mapGetters('workStation', ['workStationType']),
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
    async scaStationCode (lineStationCode) {
      await this.$store.dispatch('workStation/getWorkStationInfo', { lineStationCode })
      let stationType = this.workStationType
      switch (stationType) {
        case '组装':
          sessionStorage.assembleCode = lineStationCode
          this.$router.push('/WorkStation/Assemble')
          break
        case '测试':
          sessionStorage.testCode = lineStationCode
          this.$router.push('/WorkStation/Test')
          break
        case '包装':
          sessionStorage.packCode = lineStationCode
          this.$router.push('/WorkStation/Pack')
          break
        case '上栈板':
          sessionStorage.storageCode = lineStationCode
          this.$router.push('/WorkStation/Storage')
          break
        case '维修':
          sessionStorage.repairCode = lineStationCode
          this.$router.push('/WorkStation/Repair')
          break
        case '出货':
          sessionStorage.shipoutCode = lineStationCode
          this.$router.push('/WorkStation/Shipout')
          break
        default:
          this.$refs.logs.createLogsInfo(lineStationCode, 0, stationType)
          break
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
