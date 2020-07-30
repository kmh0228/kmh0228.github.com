<template>
  <div class="mes-main mes-main-common mes-workstation">
    <div class="main-common-head">
      <p style="padding-left:45%;font-size:1vw;">{{$t('Sampling_SpotCheck')}}</p>
    </div>
    <el-row class="mes-workstation-info" :gutter="10">
      <el-col v-for="(item,i) in infoLabel" :key="i" :span="12" class="el-row">
        <p class="el-col el-col-6">{{ item.label }}</p>
        <p class="el-col el-col-18">{{ info[item.key] }}</p>
      </el-col>
    </el-row>
    <station-logs :logName="$t('common_OperaLog')" :recordName="$t('Sampling_SpotCheckRecord')" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <scan-input :scanType="scanType" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
import stationLogs from '../../Production/DataAcquisition/Module/logs'
import scanInput from '../../Production/DataAcquisition/Module/scanInput'
export default {
  data () {
    return {
      info: {
        userName: '',
        productSn: '',
        model: '',
        materialNo: '',
        docNo: '',
        lineStationName: '',
        lineCode: ''
      }
    }
  },
  computed: {
    infoLabel () {
      return [
        {
          key: 'userName',
          label: this.$t('common_EmploNumb')
        },
        {
          label: 'SN',
          key: 'productSn'
        },
        {
          label: this.$t('common_ProduSeries'),
          key: 'model'
        },
        {
          label: this.$t('common_PorN'),
          key: 'materialNo'
        },
        {
          label: this.$t('common_WorkOrdeNo'),
          key: 'docNo'
        },
        {
          label: this.$t('common_Line'),
          key: 'lineCode'
        },
        {
          label: this.$t('Sampling_CurrentStation'),
          key: 'lineStationName'
        }
      ]
    },
    recordTableLabel () {
      return [
        {
          key: 'productSn',
          label: this.$t('Sampling_ProductSerialNumber')
        },
        {
          key: 'materialNo',
          label: this.$t('common_PorN')
        },
        {
          key: 'docNo',
          label: this.$t('common_WorkOrdeNo')
        },
        {
          key: 'dateTime',
          label: this.$t('Sampling_SamplingTime')
        },
        {
          key: 'employeeName',
          label: this.$t('Sampling_Inspector')
        },
        {
          key: 'result',
          label: this.$t('common_JudgmResu')
        }
      ]
    },
    scanType () {
      return this.$t('common_EmploNumb')
    }
  },
  methods: {
    scanCode (code) {
      const { scanType } = this
      if (scanType === this.$t('common_EmploNumb')) {
        this.scanEmployeeCard(code)
      } else if (scanType === 'SSN') {
        this.scanSsn(code)
      } else {
        this.scanResult(code)
      }
    },
    async scanEmployeeCard (employeeCardId) {
      const res = await this.$api.scanEmployeeCardId({ employeeCardId })
      if (res.code === '200') {
        const userInfo = res.data
        const userName = `${employeeCardId}（${userInfo.employeeName}）`
        this.info = Object.assign(this.info, { userName, employeeName: userInfo.employeeName, employeeCardId })
        const { nextStep } = userInfo
        this.scanType = res.data.nextStep
        this.$refs.logs.createLogsInfo(employeeCardId, 1, `${this.$t('common_PleasScan')}+${nextStep}`)
      } else {
        this.$refs.logs.createLogsInfo(employeeCardId, 0, `${this.$t('common_PleasScan')}${this.scanType}`)
      }
    },
    async scanSsn (productSn) {
      const { employeeCardId } = this.info
      const data = { employeeCardId, productSn }
      const res = await this.$api.scanSsnByAql(data)
      if (res.code === '200') {
        this.info = Object.assign(this.info, res.data)
        this.info.productSn = productSn
        this.scanType = res.data.nextStep
        this.$refs.logs.createLogsInfo(productSn, 1, `${this.$t('common_PleasScan')}${this.scanType}`)
      } else {
        this.$refs.logs.createLogsInfo(productSn, 0, res.msg)
      }
    },
    async scanResult (command) {
      const { productSn, employeeCardId } = this.info
      const data = { command, employeeCardId, productSn }
      const res = await this.$api.scanSsnByAql(data)
      if (res.code === '200') {
        const { nextStep } = res.data
        this.scanType = nextStep
        this.$refs.logs.createLogsInfo(command, 1, `${this.$t('common_PleasScan')}${nextStep}`)
        this.$refs.logs.recordList.push({
          productSn: this.info.productSn,
          materialNo: this.info.materialNo,
          docNo: this.info.docNo,
          dateTime: this.$dayjs().format('HH:mm:ss'),
          employeeName: this.info.employeeName,
          result: command
        })
      } else {
        this.$refs.logs.createLogsInfo(command, 0, res.msg)
      }
    }
  },
  components: {
    stationLogs, scanInput
  }
}
</script>
