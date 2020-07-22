<template>
  <!-- 缺陷变更前 -->
  <!-- <div class="mes-table"
    <el-table border :data="attributeData.PropVmList">
      <el-table-column type="index" label="序号" width="50" align="center">
        <template slot-scope="prop">
          <p>{{ prop.$index + 1 }}</p>
        </template>
      </el-table-column>
      <el-table-column label="属性代码" prop="propCode" align="center"></el-table-column>
      <el-table-column label="属性名称" prop="propName" align="center"></el-table-column>
      <el-table-column label="属性值" prop="value" align="center"></el-table-column>
      <el-table-column label="属性值类型" prop="valueType" align="center"></el-table-column>
      <el-table-column label="属性描述" prop="propDesc" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center" v-if="useType!==0">
        <template slot-scope="scope">
          <el-button type="text" size="mini" style="font-size:0.8vw;" icon="el-icon-edit" @click="attributeHandle(scope.$index)"></el-button>
          <el-button type="text" size="mini" style="color:#F56C6C;font-size:0.8vw;" icon="el-icon-delete" @click="deleteRows(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div> -->
  <!-- 缺陷变更后 -->
    <el-form class="el-row work-order-info mes-form-rule" :model="attributeForm" ref="attributeForm" label-width="30%" label-position="left" :rules="attributeRules">
      <el-form-item :label="$t('material_codingRule')" prop="mComMaterialPropSnruleid" class="el-col el-col-11">
        <p v-if="isRead">{{ attributeForm.mSeqName }}</p>
        <el-select v-else size="mini" v-model="attributeForm.mComMaterialPropSnruleid" filterable clearable style="width:100%">
          <el-option v-for="(options,i) in codeRuleList" :key="i" :label="options.mSeqName" :value="options.mSeqId">
            <span style="float:left;">{{ options.mSeqName }}</span>
            <span style="float:right;">{{ options.seqNoFormat}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_productRouter')" prop="mComMaterialPropWorkflowid" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ attributeForm.workflowName }}</p>
        <el-select v-else size="mini" v-model="attributeForm.mComMaterialPropWorkflowid" filterable clearable style="width:100%">
          <el-option v-for="(options,i) in workflowList" :key="i" :label="options.workflowName" :value="options.mWorkflowSpecId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_processTimer')" prop="mComMaterialPropTimerid" class="el-col el-col-11">
        <p v-if="isRead">{{ attributeForm.mComTimerCode }}</p>
        <el-select v-else size="mini" v-model="attributeForm.mComMaterialPropTimerid" filterable clearable style="width:100%">
          <el-option v-for="(options,i) in timeList" :key="i" :label="options.mComTimerCode" :value="options.mComTimerId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_workModule')" prop="mComMaterialPropWorkmasterid" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ attributeForm.workCode }}</p>
        <el-select v-else size="mini" v-model="attributeForm.mComMaterialPropWorkmasterid" filterable clearable style="width:100%">
          <el-option v-for="(options,i) in workTemplateList" :key="i" :label="options.workCode" :value="options.mPomWorkMasterId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_packRules')" prop="mPomWorkMasPackRuleId" class="el-col el-col-11">
        <p v-if="isRead">{{ attributeForm.ruleName }}</p>
        <el-select v-else size="mini" v-model="attributeForm.mPomWorkMasPackRuleId" filterable clearable style="width:100%">
          <el-option v-for="(options,i) in packRuleList" :key="i" :label="options.ruleName" :value="options.mPomWorkMasPackRuleId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_checkPlan')" prop="tQomInspectionPlanMainId" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ attributeForm.planName }}</p>
        <el-select v-else size="mini" v-model="attributeForm.tQomInspectionPlanMainId" filterable clearable style="width:100%">
          <el-option v-for="(options,i) in planList" :key="i" :label="options.planName" :value="options.tQomInspectionPlanMainId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_normalHours')" prop="standardTime" class="el-col el-col-11">
        <p v-if="isRead">{{ attributeForm.standardTime }}</p>
        <el-input  v-else  v-model="attributeForm.standardTime" filterable clearable style="width:100%"></el-input>
      </el-form-item>
      <el-form-item :label="工时单位" prop="timeUnitName" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ attributeForm.timeUnitName }}</p>
        <el-input  v-else  v-model="attributeForm.timeUnitName" filterable clearable style="width:100%"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_packRule')" prop="productPackageGauge" class="el-col el-col-11">
        <p v-if="isRead">{{ attributeForm.productPackageGauge }}</p>
        <el-input  v-else  v-model="attributeForm.productPackageGauge" filterable clearable style="width:100%"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_Process')" prop="mComProcessSegId" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ attributeForm.segName }}</p>
        <el-select  v-else  v-model="attributeForm.mComProcessSegId"  filterable clearable style="width:100%">
          <el-option v-for="(option,i) in processModuleList"  :key="i" :label="option.segCode" :value="option.mComProcessSegId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      codeRuleList: [],
      workflowList: [],
      workTemplateList: [],
      timeList: [],
      packRuleList: [],
      planList: [],
      processModuleList: []
    }
  },
  props: {
    useType: Number,
    // attributeData: Object,
    attributeHandle: Function,
    attributeForm: Object,
    mComMaterialId: String
  },
  computed: {
    isRead () {
      return this.useType === 0
    },
    attributeRules () {
      const { useType } = this
      if (useType === 0) {
        return {}
      } else {
        return {
          // mComMaterialPropSnruleid: [{ required: true, message: '请选择编码规则' }],
          // mComMaterialPropWorkflowid: [{ required: true, message: '请选择生产路由' }]
        }
      }
    }
  },
  methods: {
    // 获取编码规则
    async getCodeRules () {
      const data = {
        mSeqName: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getCodingRules(data)
      this.codeRuleList = res.data.list
    },
    // 获取生产路由
    async getWorkflows () {
      const res = await this.$api.getRouters({ workflowName: '' })
      this.workflowList = res.data
    },
    // 获取流程计时器
    async getProducerTimers () {
      const data = {
        keywords: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getProducerTimers(data)
      if (res.code === '200') {
        this.timeList = res.data.list
      } else {
        this.timeList = []
      }
    },
    // 获取工作模板
    async getWorkTemplates () {
      const data = {
        keyWords: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getWorkTemplates(data)
      if (res.code === '200') {
        this.workTemplateList = res.data.list
      } else {
        this.workTemplateList = []
      }
    },
    // 获取包装规则
    async getPackRules () {
      const data = {
        keyWords: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getPackingRules(data)
      if (res.code === '200') {
        this.packRuleList = res.data.list
      } else {
        this.packRuleList = []
      }
    },
    // 获取抽样计划
    async getPlanList () {
      const data = {
        planName: '',
        pageIndex: 1,
        pageSize: 1000

      }
      const params = Object.assign(data)
      const res = await this.$api.getAqlPlans(params)
      if (res.code === '200') {
        this.planList = res.data.list
      } else {
        this.planList = []
      }
    },
    // 获取制程列表
    async getProcessTree () {
      const data = {
        pageIndex: 1,
        pageSize: 1000,
        segCode: ''
      }
      let res = await this.$api.getProcessTree(data)
      if (res.code === '200') {
        this.processModuleList = res.data.processTreeDtos
      } else {
        this.processModuleList = []
      }
    },
    deleteRows (index) {
      this.attributeData.PropVmList.splice(index, 1)
    },
    saveMaterial () {
      this.$refs.attributeForm.validate(async valid => {
        if (valid) {
          const { attributeForm, mComMaterialId } = this
          const data = Object.assign({ mComMaterialId }, attributeForm)
          if (mComMaterialId) {
            let res = await this.$api.saveMaterialAttribute(data)
            let { code, msg } = res
            if (code === '200') {
              this.$message.success(msg)
            } else {
              this.$message.error(msg)
            }
          } else {
            this.$message.warning(this.$t('material_pleaseSaveInfo'))
          }
        }
      })
    }
  },
  created () {
    if (this.useType !== 0) {
      this.getCodeRules()
      this.getWorkflows()
      this.getWorkTemplates()
      this.getProducerTimers()
      this.getPackRules()
      this.getPlanList()
      this.getProcessTree()
    }
  }
}
</script>
