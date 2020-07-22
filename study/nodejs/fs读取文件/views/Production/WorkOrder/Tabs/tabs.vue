<template>
  <el-tabs v-model="tabAciveName" :before-leave="tabsBeforeleave">
    <el-tab-pane label="基本信息" name="info">
      <info :useType="useType" ref="info" :info="basicInfo" :materialNoVersion="materialNoVersion" @setWorkFlowId="setWorkFlowId" @set-workorder-id="setWorkOrderId"></info>
    </el-tab-pane>
    <el-tab-pane label="物料清单" name="materials">
      <materials :useType="useType" ref="materials" :materialsObj="materialsObj"></materials>
      <el-row v-if="useType!==0" style="margin-top:15px;">
        <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addMaterialsList">添加</el-button>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="上线维护" name="online">
      <online :useType="useType" ref="online" :online="online"></online>
    </el-tab-pane>
    <el-tab-pane label="SN详情" name="snlist" v-if="useType===0">
      <sn-list :useType="useType" ref="snlist" :snList="snList"></sn-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import info from './info'
import materials from './materials'
import online from './online'
import snList from './snList'
export default {
  data () {
    return {
      tabAciveName: 'info',
      isChange: false,
      basicInfo: {
        docNo: '',
        mComMaterialId: '',
        requestQty: null,
        tPomJobOrderSntype: '展开',
        outputQty: 0,
        jobType: '',
        docStatusName: '',
        description: '',
        schStartDt: '',
        schClosedDt: '',
        creator: '',
        createdDt: '',
        lastEditor: '',
        lastEditedDt: '',
        insepctionData: '',
        estDeliveryDt: ''
      },
      materialNoVersion: '',
      materialsObj: {
        jobOrderId: '',
        materials: []
      },
      online: {
        WORKFLOW_SPEC_ID: '',
        LINE_ID: '',
        SHIFT_ID: '',
        JOB_ORDER_ID: ''
      },
      snList: []
    }
  },
  props: {
    /**
     * 根据是使用类型，区分各个组件的使用场景以及在查看、新增、编辑功能中使用
     * 0 => 查看  1 => 新增  2 => 编辑
     */
    useType: {
      type: Number
    },
    workOrderId: {
      type: String
    }
  },
  watch: {
    workOrderId () {
      this.getWorkOrderInfo()
      this.getJobOrdersMaterials()
      this.getSnInfo()
    },
    basicInfo: {
      handler (val, old) {
        let { useType } = this
        if (useType !== 0) {
          this.isChange = true
        }
      },
      deep: true
    },
    materialsObj: {
      handler (val, old) {
        let { useType } = this
        if (useType !== 0) {
          this.isChange = true
        }
      },
      deep: true
    },
    online: {
      handler (val, old) {
        let { useType } = this
        if (useType !== 0) {
          this.isChange = true
        }
      },
      deep: true
    }
  },
  methods: {
    async setWorkOrderId (id) {
      this.basicInfo.tPomJobOrderId = id
      this.materialsObj.jobOrderId = id
      this.online.JOB_ORDER_ID = id
      await this.$nextTick(() => {
        this.isChange = false
      })
    },
    setWorkFlowId (id) {
      this.online.WORKFLOW_SPEC_ID = id
    },
    tabsBeforeleave (active, old) {
      let { isChange } = this
      if (isChange) {
        this.$confirm('当前页面信息发生变更, 是否保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveCurrentPage()
        }).catch(() => {
          this.isChange = false
        })
        return false
      }
    },
    // 获取工单基本信息
    async getWorkOrderInfo () {
      let workOrderId = this.workOrderId
      if (workOrderId) {
        let res = await this.$api.getJobOrderById(workOrderId)
        if (res.code === '200') {
          let info = res.data
          this.$emit('set-workorder-status', info.DOC_STATUS_NAME)
          // 基本信息赋值
          this.basicInfo = {
            docNo: info.DOC_NO,
            docStatusName: info.DOC_STATUS_NAME,
            mComMaterialId: info.M_COM_MATERIAL_ID,
            requestQty: info.REQUEST_QTY,
            outputQty: info.OUTPUT_QTY,
            creator: info.CREATOR_NAME,
            jobType: info.JOB_TYPE,
            tPomJobOrderSntype: info.T_POM_JOB_ORDER_SNTYPE,
            onLineNum: info.onLineNum,
            schStartDt: this.$dayjs(info.SCH_START_DT).format('YYYY-MM-DD HH:mm:ss'),
            schClosedDt: this.$dayjs(info.SCH_CLOSED_DT).format('YYYY-MM-DD HH:mm:ss'),
            createdDt: this.$dayjs(info.CREATED_DT).format('YYYY-MM-DD HH:mm:ss'),
            lastEditor: info.LAST_EDITOR_NAME,
            lastEditedDt: this.$dayjs(info.LAST_EDITED_DT).format('YYYY-MM-DD HH:mm:ss'),
            tPomJobOrderId: workOrderId,
            estDeliveryDt: this.$dayjs(info.EST_DELIVERY_DT).format('YYYY-MM-DD HH:mm:ss')
          }
          // 设置料号版次
          let materialNo = info.MATERIAL_NO ? info.MATERIAL_NO : ''
          let vsersion = info.VERSION ? ':' + info.VERSION : ''
          this.materialNoVersion = `${materialNo}${vsersion}`
          // 上线维护赋值
          this.online = {
            WORKFLOW_SPEC_ID: info.M_WORKFLOW_SPEC_ID,
            WORKFLOW_SPEC_NAME: info.workFlowSpecName,
            LINE_NAME: info.lineName,
            LINE_ID: info.M_POM_LINE_ID,
            SHIFT_NAME: info.shiftName,
            SHIFT_ID: info.M_POM_SHIFT_ID,
            JOB_ORDER_ID: this.workOrderId
          }
          // 编辑数据时获取数据重置当前页面数据是否发生变化
          // await this.$nextTick(() => {
          //   this.isChange = false
          // })
        }
      }
    },
    // 获取物料清单
    async getJobOrdersMaterials () {
      let id = this.workOrderId
      let res = await this.$api.getJobOrdersMaterials(id)
      this.materialsObj.materials = res.data
      this.materialsObj.materials.forEach(val => {
        val.isKeypart = val.isKeypart === 'false' ? 0 : 1
      })
    },
    // 获取SN详情列表
    async getSnInfo () {
      let id = this.workOrderId
      let res = await this.$api.getWorkOrderSnList(id)
      this.snList = res.data
    },
    addMaterialsList () {
      this.materialsObj.materials.push({
        mComMaterialId: '',
        isKeypart: 0,
        requestQty: '',
        usedQty: 0,
        baseQty: 0,
        mComUomId: 'PCS',
        altGroup: '',
        version: '',
        materialNo: ''
      })
    },
    saveCurrentPage () {
      this.isChange = false
      const tabName = this.tabAciveName
      this.$refs[tabName].saveWorkOrder()
    },
    refresCurrentPage () {
      // const tabName = this.tabAciveName
      // this.$refs[tabName].refresWorkOrder()
    }
  },
  components: {
    info, materials, online, snList
  },
  async created () {
    if (this.useType !== 1) {
      this.online.JOB_ORDER_ID = this.workOrderId
      this.materialsObj.jobOrderId = this.workOrderId
      await this.getWorkOrderInfo()
      await this.getJobOrdersMaterials()
      // 编辑数据时获取数据重置当前页面数据是否发生变化
      this.isChange = false
    }
    if (this.useType === 0) {
      this.getSnInfo()
    }
  }
}
</script>
