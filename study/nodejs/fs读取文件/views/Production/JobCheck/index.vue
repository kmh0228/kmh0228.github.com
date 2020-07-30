<template>
  <div class="mes-main mes-workstation">
    <el-row class="mes-workstation-info" :gutter="10" :class="changeSize">
      <el-col v-for="(item,i) in infoLabel" :key="i" :span="12" class="el-row">
        <p class="el-col el-col-6">{{ $t(item.label) }}:</p>
        <p class="el-col el-col-18">{{ info[item.key] }}</p>
      </el-col>
    </el-row>
     <station-logs :logName="$t('common_OperaLog')" :recordName="$t('common_InspeRecord')" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
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
        productDate: '',
        requertQty: ''
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
          label: 'common_DemanQuan',
          key: 'requestQty'
        },
        {
          label: 'common_dateManu',
          key: 'productDate'
        }
      ],
      recordTableLabel: [
        {
          label: 'jobCheck_PartSeriNumb',
          key: 'productSn'
        }, {
          label: 'jobCheck_ScanResu',
          key: 'checkoutStatus'
        }, {
          label: 'jobCheck_ScanTime',
          key: 'checkDate'
        }
      ],
      scanType: this.$t('jobCheck_seriaNumb'),
      orderId: '',
      splitSn: ''
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
      if (scanType === this.$t('jobCheck_seriaNumb')) {
        this.scanPartSplitSn(code)
      } else if (scanType === this.$t('jobCheck_resul')) {
        this.scanPartResult(code)
      }
    },
    // 扫描工单号
    // async scanPartOrder (docNo) {
    //   let res = await this.$api.scanPartOrder({ docNo })
    //   if (res.code === '200') {
    //     this.info = res.data
    //     this.orderId = res.data.tpomJobOrderId
    //     const nextStep = this.$t('jobCheck_seriaNumb')
    //     this.scanType = nextStep
    //     this.$refs.logs.createLogsInfo(docNo, 1, `请扫描${nextStep}`)
    //   }
    // },
    // 扫描序列号
    async scanPartSplitSn (splitSn) {
      if (splitSn === 'finish') {
        this.reduction()
      } else {
        let res = await this.$api.scanPartSplitSn({ splitSn })
        if (res.code === '200') {
          this.splitSn = splitSn
          this.info = res.data
          this.scanType = this.$t('jobCheck_resul')
          this.$refs.logs.createLogsInfo(splitSn, 1, res.msg)
        } else {
          this.$refs.logs.createLogsInfo(splitSn, 0, res.msg)
        }
      }
    },
    // 扫描结果
    async scanPartResult (checkoutStatus) {
      if (checkoutStatus === 'finish') {
        this.reduction()
      } else {
        let productSn = this.splitSn
        const data = Object.assign({ checkoutStatus, productSn })
        let res = await this.$api.scanPartResult(data)
        if (res.code === '200') {
          this.scanType = this.$t('jobCheck_seriaNumb')
          // this.$refs.logs.recordList.push({
          //   productSn: res.data.productSn,
          //   checkoutStatus: res.data.checkoutStatus,
          //   scanTime: res.data.checkDate
          // })
          this.$refs.logs.recordList.push(res.data)
          this.$refs.logs.createLogsInfo(this.info.docNo, 1, res.msg)
        } else {
          this.$refs.logs.createLogsInfo(this.splitSn, 0, res.msg)
        }
      }
    },
    // 还原
    reduction () {
      this.$refs.logs.logsInfo = []
      this.info = {
        docNo: '',
        materialNo: '',
        productDate: '',
        tpomJobOrderId: '',
        requertQty: ''
      }
      this.$refs.logs.recordList = []
      this.scanType = this.$t('jobCheck_seriaNumb')
    }

  },
  components: {
    stationLogs, scanInput
  }
}
</script>
