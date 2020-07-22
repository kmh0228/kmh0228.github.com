<template>
  <div class="mes-main mes-main-common mes-workstation">
    <div class="main-common-head">
      <p style="padding-left:45%;font-size:1vw;">抽检</p>
    </div>
    <el-row class="mes-workstation-info" :gutter="10">
      <el-col v-for="(item,i) in infoLabel" :key="i" :span="12" class="el-row">
        <p class="el-col el-col-6">{{ item.label }}</p>
        <p class="el-col el-col-18">{{ info[item.key] }}</p>
      </el-col>
    </el-row>
    <station-logs logName="操作日志" recordName="抽检记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <scan-input :scanType="scanType" @scan-code="scanCode"></scan-input>
  </div>
</template>

<script>
import stationLogs from '../../Production/DataAcquisition/Module/logs'
import scanInput from '../../Production/DataAcquisition/Module/scanInput'
export default {
  data () {
    return {
      infoLabel: [
        {
          key: 'userName',
          label: '员工号'
        },
        {
          label: 'SN',
          key: 'productSn'
        },
        {
          label: '产品系列',
          key: 'model'
        },
        {
          label: '料号',
          key: 'materialNo'
        },
        {
          label: '工单号',
          key: 'docNo'
        },
        {
          label: '线别',
          key: 'lineCode'
        },
        {
          label: '当前工站',
          key: 'lineStationName'
        }
      ],
      info: {
        userName: '',
        productSn: '',
        model: '',
        materialNo: '',
        docNo: '',
        lineStationName: '',
        lineCode: ''
      },
      recordTableLabel: [
        {
          key: 'productSn',
          label: '产品序列号'
        },
        {
          key: 'materialNo',
          label: '料号'
        },
        {
          key: 'docNo',
          label: '工单号'
        },
        {
          key: 'dateTime',
          label: '抽检时间'
        },
        {
          key: 'employeeName',
          label: '检验人'
        },
        {
          key: 'result',
          label: '判定结果'
        }
      ],
      scanType: '员工号'
    }
  },
  methods: {
    scanCode (code) {
      const { scanType } = this
      if (scanType === '员工号') {
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
        this.$refs.logs.createLogsInfo(employeeCardId, 1, `请扫描${nextStep}`)
      } else {
        this.$refs.logs.createLogsInfo(employeeCardId, 0, `请扫描${this.scanType}`)
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
        this.$refs.logs.createLogsInfo(productSn, 1, `请扫描${this.scanType}`)
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
        this.$refs.logs.createLogsInfo(command, 1, `请扫描${nextStep}`)
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
