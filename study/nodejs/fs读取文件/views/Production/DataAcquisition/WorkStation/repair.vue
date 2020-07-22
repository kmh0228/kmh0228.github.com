<template>
  <div class="mes-main mes-workstation">
    <el-row class="mes-workstation-head">
      <el-col :span="24" class="workstation-head-btn">
        <el-button size="mini" type="primary" @click="repairFinish" plain>维修完成</el-button>
        <el-button size="mini" type="primary" @click="repairScrap" plain>报废</el-button>
        <el-button size="mini" type="primary" @click="misjudge" plain>误判</el-button>
      </el-col>
      <el-col :span="24" style="padding:1.5vh 0;">
        <el-input v-model.trim="scanValue" autofocus :placeholder="'请扫描'+scanType" size="medium" @keydown.native.enter="scanSsnCode"></el-input>
      </el-col>
    </el-row>
    <el-row class="mes-workstation-info" :gutter="10">
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">用户名</p>
        <p class="el-col el-col-18">{{ workStationInfo.userName }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">产品系列</p>
        <p class="el-col el-col-18">{{ workStationInfo.model }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">料号</p>
        <p class="el-col el-col-18">{{ workStationInfo.materialNo }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">工单号</p>
        <p class="el-col el-col-18">{{ workStationInfo.docNo }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">线别</p>
        <p class="el-col el-col-18">{{ workStationInfo.lineCode }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">不良代码</p>
        <p class="el-col el-col-18">{{ workStationInfo.mQomDefectId }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">送修工站</p>
        <p class="el-col el-col-18">{{ workStationInfo.mWorkflowSpecPrevNode }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">SSN</p>
        <p class="el-col el-col-18">{{ workStationInfo.productSn }}</p>
      </el-col>
      <el-col class="el-row" :span="12">
        <p class="el-col el-col-6">送修时间</p>
        <p class="el-col el-col-18">{{ workStationInfo.createdDt | formatDateTime }}</p>
      </el-col>
    </el-row>
    <el-form :model="repairForm" ref="repairForm" class="mes-workstation-info el-row" label-width="25%" label-position="left">
      <el-form-item label="不良代码" prop="mQomDefectId" class="el-col el-col-11">
        <el-select v-model="repairForm.mQomDefectId" placeholder="请选择不良代码" style="width:100%" size="mini">
          <el-option v-for="(option,i) in badCodeList" :key="i" :label="option.defectName" :value="option.mQomDefectId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因代码" prop="mQomDefectReasonId" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="repairForm.mQomDefectReasonId" placeholder="请选择原因代码" filterable style="width:100%" size="mini">
          <el-option v-for="(option,i) in reasonList" :key="i" :label="option.defectReasonName" :value="option.mQomDefectReasonId" @click.native="changeDefectReason(option)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维修动作" prop="mQomRepairActionId" class="el-col el-col-11">
        <el-select v-model="repairForm.mQomRepairActionId" placeholder="请选择维修动作" filterable style="width:100%" size="mini">
          <el-option v-for="(option,i) in actionList" :key="i" :label="option.repairActionName" :value="option.mQomRepairActionId" @click.native="changeComponentReplace(option.componentReplace)"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="原因描述" prop="repairReasonDesc" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="repairForm.repairReasonDesc" disabled size="mini"></el-input>
      </el-form-item>
      <el-form-item label="旧零件" prop="parsedCsnOld" class="el-col el-col-11" v-if="componentReplace">
        <el-input v-model.trim="repairForm.parsedCsnOld" @blur="checkOldCsn" placeholder="请输入" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="新零件" prop="parsedCsnNew" class="el-col el-col-11 el-col-offset-1" v-if="componentReplace">
        <el-input v-model.trim="repairForm.parsedCsnNew" @blur="checkNewCsn" placeholder="请输入" size="mini"></el-input>
      </el-form-item>
       <el-form-item label="备注" prop="remark" class="el-col el-col-11">
        <el-input type="textarea" v-model="repairForm.remark" placeholder="备注信息" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin:0 15px;" class="mes-table">
      <div style="padding-bottom:10px;border-bottom:1px solid #B2B2B2;">
        <el-button size="mini" type="primary" plain @click="addRepairRecord">增加维修明细</el-button>
      </div>
      <el-table :data="repairRecordList" border size="mini" empty-text="暂未添加维修明细">
        <el-table-column type="index" label="序号" align="center" width="60" :index="indexMethod"></el-table-column>
        <el-table-column prop="repairPart.parsedCsnNew" label="零件SN" align="center"></el-table-column>
        <el-table-column prop="repairPart.parsedCsnOld" label="旧零件SN" align="center"></el-table-column>
        <el-table-column prop="repairActionName" label="维修动作" align="center"></el-table-column>
        <el-table-column prop="defectReasonCode" label="原因代码" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="createdDt" label="维修时间" align="center" :formatter="formatterDate"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
/**
 * 维修工站逻辑
 * 1.扫描SSN，获取productId，通过productId获取info信息，并缓存当前维修mianId
 * 2.通过维修mianId获取维修记录
 * 3.目前操作员以当前登录用户为准
 * 4.若维修动作中componentReplace为true，则显示新、旧零件
 * 5.点击增加记录，则把当前表单信息保存，保存成功重新获取维修记录
 *
 * 4/4号调整
 * 1.扫描SSN，扫描结果PASS，需弹框提示‘当前SN没有不良记录，是否还要继续维修’，是则创建主记录
 * 2.若为FAIL则直接进入维修工站，同时创建主记录
 * 3.然后添加维修记录，添加成功则需要清空所填信息
 */
import { mapState } from 'vuex'
export default {
  data () {
    return {
      scanType: '员工号',
      scanValue: '',
      sn: '',
      lineStationCode: null,
      workStationInfo: {
        userName: '',
        model: '',
        materialNo: '',
        docNo: '',
        lineCode: '',
        mQomDefectId: '',
        mQomDefectDesc: '',
        mPomWorkflowSpecNodeId: '',
        createdDt: '',
        employeeCardId: sessionStorage.userName
      },
      repairForm: {
        tQomRepairMainId: '',
        mQomDefectId: '',
        mQomDefectReasonId: '',
        repairReasonDesc: '',
        mQomRepairActionId: '',
        remark: '',
        parsedCsnOld: '',
        parsedCsnNew: ''
      },
      componentReplace: false,
      badCodeList: [],
      reasonList: [],
      actionList: [],
      repairRecordList: [],
      tipsOption: {
        show: false,
        title: '',
        tipsType: ''
      },
      result: {}
    }
  },
  computed: {
    ...mapState('workStation', ['workStationStates']),
    recordLength () {
      return this.repairRecordList.length
    },
    sendData () {
      let keys = ['masterId', 'orderId', 'employeeCardId', 'nextValue', 'stationId', 'lineId', 'productId', 'shiftId', 'mWorkFlowSpecLastId', 'mWorkflowSpecLastNodeId', 'mWorkflowSpecNextNodeId', 'tPomJobResponseId', 'inoutFlag', 'mComEqpId']
      let info = {}
      keys.forEach(key => {
        info[key] = this.workStationInfo[key] || ''
      })
      return info
    }
  },
  watch: {
    // 监听返回的数据，底部显示对应的提示信息
    result: {
      handler (newVal) {
        let { code, msg } = newVal
        if (code === '200') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      },
      deep: true
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    // 获取当前工站基本信息
    async setWorkStationInfo () {
      let { lineStationCode } = this
      if (lineStationCode) {
        await this.$store.dispatch('workStation/getWorkStationInfo', { lineStationCode })
        this.workStationInfo = Object.assign(this.workStationInfo, this.workStationStates)
      } else {
        this.$alert('系统检测到当前未扫描工站代码，请先扫描工站代码！', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push('/WorkStation/Login')
          }
        })
      }
    },
    // 获取不良代码option
    async getBadCodeList () {
      let res = await this.$api.getRepairBadCodes()
      this.badCodeList = res.data
    },
    // 获取原因代码option
    async getReasonList () {
      let res = await this.$api.getRepairReasons()
      this.reasonList = res.data
    },
    // 获取维修动作option
    async getActionList () {
      let res = await this.$api.getRepairActions()
      this.actionList = res.data
    },
    formatterDate (row, column, ceellValue) {
      return ceellValue ? this.$dayjs(ceellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    // 选择原因代码自动设置原因描述
    changeDefectReason (option) {
      this.repairForm.repairReasonDesc = option.defectReasonDesc
    },
    // 改变维修动作，若为更改零件则重置新旧SN号
    changeComponentReplace (isReplace) {
      if (isReplace) {
        this.componentReplace = true
      } else {
        this.componentReplace = false
      }
      this.repairForm.parsedCsnOld = ''
      this.repairForm.parsedCsnNew = ''
    },
    // 校验新旧零件
    async checkOldCsn () {
      let { productSn } = this.workStationInfo
      let { parsedCsnOld } = this.repairForm
      if (parsedCsnOld) {
        let data = { productSn, parsedCsnOld }
        let res = await this.$api.repariCheckOldCsn(data)
        if (res.code !== '200') {
          this.repairForm.parsedCsnOld = ''
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning('请输入旧零件')
      }
    },
    async checkNewCsn () {
      let { parsedCsnOld, parsedCsnNew } = this.repairForm
      if (parsedCsnNew) {
        let data = { parsedCsnOld, parsedCsnNew }
        let res = await this.$api.repariCheckNewCsn(data)
        if (res.code !== '200') {
          this.repairForm.parsedCsnNew = ''
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning('请输入新零件')
      }
    },
    // 扫描SSN
    async scanSsnCode () {
      const { scanValue, scanType } = this
      if (scanType === '员工号') {
        const employeeCardId = scanValue
        const res = await this.$api.scanEmployeeCardId({ employeeCardId })
        if (res.code === '200') {
          let userInfo = res.data
          let userName = `${scanValue}（${userInfo.employeeName}）`
          this.workStationInfo = Object.assign(this.workStationInfo, { userName, employeeCardId })
          this.scanType = userInfo.nextStep
        } else {
          this.$message.error(res.msg)
        }
      } else {
        let { processId } = this.workStationInfo
        let data = Object.assign({ scanValue }, { processId })
        let res = await this.$api.ssnScanCommon(data)
        if (res.code === '200') {
          // SN验证成功，保存sn信息
          this.sn = scanValue
          let resultData = res.data
          this.workStationInfo = Object.assign(this.workStationInfo, resultData, { productSn: scanValue })
          if (resultData.result === 'PASS') {
            let confirm = await this.$myPrompt.confirm('当前SN没有不良记录，是否还要继续维修？')
            if (confirm) {
              this.addRepairMasterRecord()
            }
          } else {
            this.addRepairMasterRecord()
          }
        } else {
          let msg = res.data.logMsg
          this.$message.error(msg)
        }
      }
      this.scanValue = ''
    },
    // 获取维修详情及维修记录
    async getRepairInfo () {
      let { productId } = this.workStationInfo
      let res = await this.$api.getRepairInfoAndRecord(productId)
      if (res.code === '200') {
        let resultData = res.data
        let { repairItemList } = resultData
        this.workStationInfo = Object.assign(this.workStationInfo, resultData)
        this.repairRecordList = repairItemList
        // 获取数据成功，保存id
        this.repairForm.tQomRepairMainId = resultData.tQomRepairMainId
      } else {
        this.result = res
      }
    },
    // 添加维修主记录
    async addRepairMasterRecord () {
      let { workStationInfo } = this
      let data = {
        tPomJobResponseId: workStationInfo.tPomJobResponseId,
        tPomJobActProductId: workStationInfo.productId,
        mPomLineId: workStationInfo.lineId,
        mPomShiftId: workStationInfo.shiftId,
        mWorkflowSpecLastNodeId: workStationInfo.mWorkflowSpecLastNodeId,
        productSn: workStationInfo.productSn,
        employeeCardId: sessionStorage.userName
      }
      let res = await this.$api.addRepairMasterRecord(data)
      if (res.code === '200') {
        this.getRepairInfo()
      }
    },
    // 添加维修记录
    async addRepairRecord () {
      let { tQomRepairMainId, parsedCsnOld, parsedCsnNew } = this.repairForm
      if (tQomRepairMainId) {
        // 维修动作为更换零件时，新旧零件不能为空
        if (this.componentReplace) {
          if (!parsedCsnOld || !parsedCsnNew) {
            return this.$message.warning('新旧零件不能为空！')
          }
        }
        let { workStationInfo } = this
        let data = {
          tPomJobResponseId: workStationInfo.tPomJobResponseId,
          tPomJobActProductId: workStationInfo.productId,
          lineId: workStationInfo.lineId,
          shiftId: workStationInfo.shiftId,
          mWorkflowSpecLastNodeId: workStationInfo.mWorkflowSpecLastNodeId,
          productSn: workStationInfo.productSn,
          employeeCardId: sessionStorage.userName
        }
        let sendData = Object.assign(data, this.repairForm)
        let res = await this.$api.addRepairRecord(sendData)
        if (res.code === '200') {
          // 添加记录成功，更新维修信息及记录，并重置表单
          this.getRepairInfo()
          this.$refs.repairForm.resetFields()
        }
        this.result = res
      } else {
        this.$message.warning('请先扫描SSN')
      }
    },
    // 验证表单是否填写维修记录
    async validRepairForm () {
      let { mQomDefectId, mQomDefectReasonId, mQomRepairActionId } = this.repairForm
      if (mQomDefectId !== '' || mQomDefectReasonId !== '' || mQomRepairActionId !== '') {
        let res = await this.$myPrompt.confirm('当前有未添加的维修明细，是否保存该明细？', 'warning', '提示', '是', '否')
        if (res) {
          return true
        }
        return false
      } else {
        return false
      }
    },
    // 维修完成
    async repairFinish () {
      let { tQomRepairMainId } = this.repairForm
      if (tQomRepairMainId) {
        let valid = await this.validRepairForm()
        if (valid) {
          await this.addRepairRecord()
        }
        let data = Object.assign(this.sendData, { tQomRepairMainId })
        let res = await this.$api.repairFinish(data)
        this.result = res
        if (res.code === '200') {
          this.repairRecordList = []
          this.$refs.repairForm.resetFields()
          this.repairForm.tQomRepairMainId = ''
          this.workStationInfo.productSn = ''
        }
      } else {
        this.$message.warning('请先扫描SSN')
      }
    },
    // 维修报废
    async repairScrap () {
      let { tQomRepairMainId } = this.repairForm
      if (tQomRepairMainId) {
        let valid = await this.validRepairForm()
        if (valid) {
          await this.addRepairRecord()
        }
        let data = Object.assign(this.sendData, { tQomRepairMainId })
        let res = await this.$api.repairScrap(data)
        this.result = res
        if (res.code === '200') {
          this.repairRecordList = []
          this.$refs.repairForm.resetFields()
          this.workStationInfo.productSn = ''
        }
      } else {
        this.$message.warning('请先扫描SSN')
      }
    },
    // 维修误判
    async misjudge () {
      let { tQomRepairMainId } = this.repairForm
      if (tQomRepairMainId) {
        let valid = await this.validRepairForm()
        if (valid) {
          await this.addRepairRecord()
        }
        let condition = 'MISJUDGE'
        let data = Object.assign(this.sendData, { tQomRepairMainId, condition })
        let res = await this.$api.repariMisjudge(data)
        this.result = res
        if (res.code === '200') {
          this.repairRecordList = []
          this.$refs.repairForm.resetFields()
          this.workStationInfo.productSn = ''
        }
      } else {
        this.$message.warning('请先扫描SSN')
      }
    }
  },
  created () {
    this.lineStationCode = sessionStorage.repairCode || null
    this.getBadCodeList()
    this.getReasonList()
    this.getActionList()
  },
  mounted () {
    this.setWorkStationInfo()
  }
}
</script>
