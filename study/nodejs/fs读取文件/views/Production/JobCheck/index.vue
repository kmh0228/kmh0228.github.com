<template>
  <div class="mes-main mes-workstation">
    <el-row class="mes-workstation-info" :gutter="10" :class="changeSize">
      <el-col v-for="(item,i) in infoLabel" :key="i" :span="12" class="el-row">
        <p class="el-col el-col-6">{{ item.label }}</p>
        <p class="el-col el-col-18">{{ info[item.key] }}</p>
      </el-col>
    </el-row>
     <station-logs logName="操作日志" recordName="检验记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
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
          label: '工单号:',
          key: 'docNo'
        },
        {
          label: '料号:',
          key: 'materialNo'
        },
        {
          label: '需求数量:',
          key: 'requestQty'
        },
        {
          label: '生产日期:',
          key: 'productDate'
        }
      ],
      recordTableLabel: [
        {
          label: '零件序列号',
          key: 'productSn'
        }, {
          label: '扫描结果',
          key: 'checkoutStatus'
        }, {
          label: '扫描时间',
          key: 'checkDate'
        }
      ],
      scanType: '序列号',
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
      if (scanType === '序列号') {
        this.scanPartSplitSn(code)
      } else if (scanType === '结果') {
        this.scanPartResult(code)
      }
    },
    // 扫描工单号
    // async scanPartOrder (docNo) {
    //   let res = await this.$api.scanPartOrder({ docNo })
    //   if (res.code === '200') {
    //     this.info = res.data
    //     this.orderId = res.data.tpomJobOrderId
    //     const nextStep = '序列号'
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
          this.scanType = '结果'
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
          this.scanType = '序列号'
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
      this.scanType = '序列号'
    }

  },
  components: {
    stationLogs, scanInput
  }
}
</script>
