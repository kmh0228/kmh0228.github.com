<template>
  <div class="mes-main mes-workstation">
    <el-row class="mes-workstation-head">
      <el-col :span="24">
        <el-alert type="warning" :closable="false">
          <div class="workstation-head-progress" :class="changeSize">
            <p>{{$t('jobLoading_CurreWorkOrdeFeedQuan')}}<span>{{countOrder}}</span></p>
          </div>
        </el-alert>
      </el-col>
    </el-row>
    <el-row class="mes-workstation-info" :gutter="10" :class="changeSize">
      <el-col v-for="(item,i) in infoLabel" :key="i" :span="12" class="el-row">
        <p class="el-col el-col-6">{{ $t(item.label) }}:</p>
        <p class="el-col el-col-18">{{ info[item.key] }}</p>
      </el-col>
    </el-row>
     <station-logs :logName="$t('common_OperaLog')" :recordName="$t('jobLoading_LoadiReco')" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
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
        docNo: '',
        materialNo: '',
        lineCode: '',
        shiftName: '',
        requestQty: 0
      },
      infoLabel: [
        {
          label: 'common_WorkOrdeNo',
          key: 'docNo'
        },
        {
          label: 'common_PorN',
          key: 'materialNo'
        },
        {
          label: 'common_Line',
          key: 'lineCode'
        },
        {
          label: 'common_Shift',
          key: 'shiftName'
        }
      ],
      recordTableLabel: [
        {
          label: 'jobLoading_PartMateSeriNumb',
          key: 'partSN'
        }, {
          label: 'common_PartNo',
          key: 'partNo'
        }, {
          label: 'jobLoading_ScanTime',
          key: 'scanTime'
        }
      ],
      scanType: this.$t('common_WorkOrdeNo'),
      snId: '',
      sn: '',
      countOrder: 0
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
          size = 'font-normal'
          break
      }
      return size
    }
  },
  methods: {
    scanCode (code) {
      let { scanType } = this
      if (scanType === this.$t('common_WorkOrdeNo')) {
        this.scanOrder(code)
      } else if (scanType === '物料SN') {
        this.scanPart(code)
      }
    },
    // 扫描工单号
    async scanOrder (docNo) {
      let res = await this.$api.scanOrder({ docNo })
      if (res.code === '200') {
        this.info = res.data
        const nextStep = '物料SN'
        this.scanType = nextStep
        this.$refs.logs.createLogsInfo(docNo, 1, res.msg)
        this.countOrder = 0
      } else {
        // let aud = 'static/download/pass.mp3'
        // let mp3 = new Audio(aud)
        // mp3.play()
        res.code === '406' ? this.$refs.logs.createLogsInfo(docNo, 0, res.msg) : this.$refs.logs.createLogsInfo(docNo, 0, `请重新扫描${this.scanType}`)
      }
    },
    // 扫描序列号
    // async scanSN (sn) {
    //   if (sn === 'FINISH') {
    //     this.reduction()
    //   } else {
    //     let orderId = this.info.tpomJobOrderId
    //     const data = Object.assign({ sn, orderId })
    //     let res = await this.$api.scanSN(data)
    //     if (res.code === '200') {
    //       this.sn = sn
    //       this.snId = res.data
    //       const nextStep = this.$t('common_PorN')
    //       this.scanType = nextStep
    //       this.$refs.logs.createLogsInfo(sn, 1, `请扫描${nextStep}`)
    //     } else {
    //       res.code === '406' ? this.$refs.logs.createLogsInfo(sn, 0, res.msg) : this.$refs.logs.createLogsInfo(sn, 0, `请重新扫描${this.scanType}`)
    //     }
    //   }
    // },
    // 扫描料号
    async scanPart (partSN) {
      if (partSN === 'finish') {
        this.reduction()
      } else {
        let orderId = this.info.tpomJobOrderId
        const data = Object.assign({ partSN, orderId })
        let res = await this.$api.scanPartSN(data)
        if (res.code === '200') {
          this.$refs.logs.createLogsInfo(partSN, 1, res.msg)
          this.$refs.logs.recordList.push({
            partSN: res.data.partSN,
            partNo: res.data.partNo,
            scanTime: this.$dayjs(this.$dayjs()).format('YYYY-MM-DD  HH:mm:ss')
          })
          this.countOrder = this.countOrder + 1
          // if (this.$refs.logs.recordList.length === this.info.requestQty) {
          //   this.$refs.logs.createLogsInfo(this.info.docNo, 1, `请输入完成指令`)
          // }
        } else {
          this.$refs.logs.createLogsInfo(partSN, 0, res.msg)
        }
      }
    },
    // 还原
    reduction () {
      this.$refs.logs.logsInfo = []
      this.info = {
        docNo: '',
        materialNo: '',
        lineCode: '',
        shiftName: ''
      }
      this.$refs.logs.recordList = []
      this.scanType = this.$t('common_WorkOrdeNo')
    }
  },
  components: {
    stationLogs, scanInput
  }
}
</script>
