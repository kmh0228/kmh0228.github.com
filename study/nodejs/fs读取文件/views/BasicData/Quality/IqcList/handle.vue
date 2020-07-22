<template>
  <div class="mes-main mes-work-order mes-handle">
    <div class="mes-main-header_bg" style="color:#3B6F9A"></div>
      <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" :disabled="checkState ==='已提交'" @click="saveIqc('DRAFT')">保存</el-button>
          <el-button type="primary" plain size="mini" :disabled="checkState ==='已提交'" @click="saveIqc('SUBMITTED')">提交</el-button>
          <el-button type="primary" plain size="mini" @click="saveIqcVdcs('DRAFT')" >生成vdcs</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
          <span class="status_class">单号：{{unitNumber}}</span>
          <span class="status_class" style="margin-left:3vw">状态：{{ checkState }}</span>
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
        <info-form :iqcInfo="iqcInfo" ref="info" v-if="isShow"></info-form>
        <settings ref="settings" :stockInQty="iqcInfo.lotQty"></settings>
        <record :iqcTestDetailDtoList="iqcInfo.iqcTestDetailDtoList" ref="record"></record>
        <bad-type ref="badType"></bad-type>
        <determine ref="determine"></determine>
      </div>
    </div>
  </div>
</template>

<script>
import infoForm from './components/info'
import settings from './components/settings'
import record from './components/record'
import badType from './components/badType'
import determine from './components/determine'
export default {
  data () {
    return {
      isShow: false,
      iqcInfo: {},
      unitNumber: '',
      iqcStatus: ''
    }
  },
  props: {
    useType: {
      type: Number
    }
  },
  methods: {
    setStatus () {
      this.checkState = this.$route.query.status === 'DRAFT' ? '未提交' : '已提交'
    },
    async getInfoByGrNo () {
      this.unitNumber = this.$route.query.grNo
      const { grNo } = this.$route.query
      const res = await this.$api.getIqcInfoByGrNo({ grNo })
      if (res.code === '200') {
        this.iqcInfo = res.data
        this.$refs.badType.tQomIqcDefectVmList = this.iqcInfo.tQomIqcDefectVmList || []
        for (let i in this.$refs.determine.decideForm) {
          if (i === 'inspectResult') {

          } else {
            this.$refs.determine.decideForm[i] = this.iqcInfo[i] || ''
          }
        }
        this.$refs.determine.inspectResult = this.iqcInfo.inspectResult || 'ACCEPT'
        this.$refs.settings.inspectCategory = res.data.inspectCategory || 'sample'
        this.$refs.settings.aqlStandard = res.data.aqlStandard || ''
        this.$refs.settings.aql = res.data.aql || ''
        this.$refs.settings.inspectionLevel = res.data.inspectionLevel || ''
        this.$refs.settings.samplingForm.sampleQty = res.data.sampleQty || ''
        this.$refs.settings.samplingForm.defectQty = res.data.defectQty || ''
      } else {
        this.$message.error(res.msg)
      }
      this.isShow = true
    },
    async saveIqc (docStatus) {
      const { infoData } = this.$refs.info
      const { grNo } = this.$route.query
      const { samplingForm } = this.$refs.settings
      const { inspectCategory, aqlStandard, inspectionLevel, aql } = this.$refs.settings
      const { iqcTestDetailDtoList } = this.$refs.record
      const { tQomIqcDefectVmList } = this.$refs.badType
      const { decideForm } = this.$refs.determine
      const data = Object.assign({ docStatus, grNo, inspectCategory, aqlStandard, inspectionLevel, aql }, infoData, samplingForm, { tQomIqcItemVmList: iqcTestDetailDtoList, tQomIqcDefectVmList }, decideForm)
      const res = await this.$api.saveIqcTest(data)
      this.$myPrompt.handleMsg(res)
    },
    async saveIqcVdcs (status) {
      const { infoData } = this.$refs.info
      const { samplingForm } = this.$refs.settings
      const { decideForm } = this.$refs.determine
      if (decideForm.inspectResult === 'REJECT' && samplingForm.inspectCategory !== 'sample') {
        let partNo = infoData.mComMaterialNo || ''
        let qty = infoData.lotQty || ''
        let vendor = infoData.vendorName || ''
        let inspectNo = infoData.stockInNo || ''
        let lotNo = infoData.lotNo || ''
        let poNo = infoData.poNo || ''
        let sampleQty = samplingForm.sampleQty || ''
        let failQty = samplingForm.defectQty || ''
        let waiveNo = decideForm.aod || ''
        let qcConfirm = decideForm.sqe || ''
        let data = Object.assign({ partNo, qty, vendor, inspectNo, lotNo, poNo, sampleQty, failQty, waiveNo, qcConfirm, status })
        let res = await this.$api.saveIqcVdcs(data)
        this.$myPrompt.handleMsg(res, () => {
          this.closeCurrentPage()
        })
      } else {
        this.$message.warning('抽样设置中检查水平是免检 ，且判定是拒收才能生成VDCS单!')
      }
    },
    closeCurrentPage () {
      this.$router.push('/BasicData/Quality/IqcList')
    }
  },
  components: {
    infoForm,
    settings,
    record,
    badType,
    determine
  },
  created () {
    this.setStatus()
    this.getInfoByGrNo()
  }
}
</script>

<style lang="scss" >
.status_class {
  font-size: 1vw;
  margin-left: 20vw;
  color: #3b6f9a;
}
</style>
