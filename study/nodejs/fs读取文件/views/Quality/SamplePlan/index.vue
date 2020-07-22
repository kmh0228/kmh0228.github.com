<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">抽样计划管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="抽样计划" v-model.trim="planName" size="mini" style="width:35%;" @keydown.enter.native="getPlanList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getPlanList"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="mes-table">
          <div slot="header">
            <span>抽样计划</span>
            <div style="float: right;">
              <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" @click="handlePlan('mainDialog','main',false)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="mainEditBtn" @click="handlePlan('mainDialog','main',true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="deletePlans"></el-button>
              </el-tooltip>
            </div>
          </div>
          <el-table :data="planData" border highlight-current-row @current-change="tableCurrentChange" @selection-change="mainSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="抽样计划" prop="planName" align="center"></el-table-column>
            <el-table-column label="描述" prop="planDesc" align="center"></el-table-column>
            <el-table-column label="是否启用" align="center" width="80">
              <template slot-scope="prop">
                <el-tag :type="prop.row.isActive === 'true'?'':'danger'">{{ prop.row.isActive === 'true'?'是':'否' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="14">
         <el-card class="mes-table">
          <div slot="header">
            <span>抽样计划详情</span>
            <div style="float: right;">
              <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" :disabled="!isSelect" @click="handlePlan('infoDialog','info',false)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" :disabled="infoEditBtn" icon="el-icon-edit" @click="handlePlan('infoDialog','info',true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete"  @click="deletePlanInfo('infoDialog','info',true)"></el-button>
              </el-tooltip>
            </div>
          </div>
          <div v-if="!isSelect">
            <p style="padding:10px; border-left:3px solid #ddd;">点击抽样计划列表查看详情</p>
          </div>
          <el-table :data="planInfo" border v-else @selection-change="infoSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="工站" prop="segName" align="center"></el-table-column>
            <el-table-column label="检查水平" prop="levelCode" align="center"></el-table-column>
            <el-table-column label="合格质量水平" prop="aqlLevelCode" align="center"></el-table-column>
            <el-table-column label="首件抽样" prop="isFai" align="center">
              <template slot-scope="prop">
                <el-tag :type="prop.row.isFai === 'true'?'':'danger'">{{ prop.row.isFai === 'true'?'是':'否' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="每个抽样" prop="isFullInspection" align="center">
              <template slot-scope="prop">
                <el-tag :type="prop.row.isFullInspection === 'true'?'':'danger'">{{ prop.row.isFullInspection === 'true'?'是':'否' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="随机抽样" prop="isRandomSampling" align="center">
              <template slot-scope="prop">
                <el-tag :type="prop.row.isRandomSampling === 'true'?'':'danger'">{{ prop.row.isRandomSampling === 'true'?'是':'否' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="等距抽样" prop="isEquidistanceSampling" align="center">
              <template slot-scope="prop">
                <el-tag :type="prop.row.isEquidistanceSampling === 'true'?'':'danger'">{{ prop.row.isEquidistanceSampling === 'true'?'是':'否' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="抽样间隔" prop="samplingInterval" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" class="handle-dialog">
      <component v-if="dialogVisible" :is="dialogComponent" :isEdit="isEdit" :processList="processList" :inspectionLevelList="inspectionLevelList" :aqlList="aqlList" :planList="planData" @cannel="cannel" :tQomInspectionPlanMainId="tQomInspectionPlanMainId" @getPlanList="getPlanList" @getAqlPlanInfo="getAqlPlanInfo" ref="dialog"></component>
    </el-dialog>
  </div>
</template>

<script>
import mainDialog from './mainDialog'
import infoDialog from './infoDialog'
export default {
  data () {
    return {
      queryLevel: 1,
      processList: [],
      inspectionLevelList: [],
      aqlList: [],
      planName: '',
      planData: [],
      planSelects: [],
      planInfo: [],
      infoSelects: [],
      page: {
        pageIndex: 1,
        pageSize: 1000
      },
      isEdit: false,
      isSelect: false,
      dialogVisible: false,
      dialogComponent: '',
      tQomInspectionPlanMainId: null
    }
  },
  computed: {
    dialogTitle () {
      let handleName = this.isEdit ? '编辑' : '新增'
      let typeName = this.dialogType === 'main' ? '抽样计划' : '抽样计划详情'
      return `${handleName}${typeName}`
    },
    mainEditBtn () {
      let { planSelects } = this
      return planSelects.length !== 1
    },
    infoEditBtn () {
      let { infoSelects } = this
      return infoSelects.length !== 1
    }
  },
  watch: {
    tQomInspectionPlanMainId (val) {
      this.getAqlPlanInfo(val)
    }
  },
  methods: {
    // 获取制程下拉列表
    async getProcessList () {
      const { segCode } = this
      const data = {
        segCode,
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAllProcessList(data)
      if (res.code === '200') {
        this.processList = res.data.list
      } else {
        this.processList = []
      }
    },
    // 获取检查水平下拉列表
    async getInspectLevelList () {
      const params = {
        levelCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getInspectLevels(params)
      if (res.code === '200') {
        this.inspectionLevelList = res.data.list
      } else {
        this.inspectionLevelList = []
      }
    },
    // 获取合格质量水平下拉列表
    async getAqlLevels () {
      const params = {
        aqlLevelCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAqlLevels(params)
      if (res.code === '200') {
        this.aqlList = res.data.list
      } else {
        this.aqlList = []
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    handlePlan (dialogName, type, isEdit) {
      this.dialogComponent = dialogName
      this.dialogType = type
      this.isEdit = isEdit
      this.dialogVisible = true
      let selectObj = {}
      if (isEdit) {
        if (type === 'main') {
          const { planSelects, planData } = this
          const tQomInspectionPlanMainId = planSelects[0]
          selectObj = planData.filter(item => {
            return item.tQomInspectionPlanMainId === tQomInspectionPlanMainId
          })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.mainForm)
            this.$refs.dialog.mainForm = this.$global.filterForm(selectObj, keys)
            this.$refs.dialog.mainForm.tQomInspectionPlanMainId = tQomInspectionPlanMainId
          })
        } else {
          const { infoSelects, planInfo } = this
          const tQomInspectionPlanDetailId = infoSelects[0]
          selectObj = planInfo.filter(item => {
            return item.tQomInspectionPlanDetailId === tQomInspectionPlanDetailId
          })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.infoForm)
            this.$refs.dialog.infoForm = this.$global.filterForm(selectObj, keys)
            this.$refs.dialog.infoForm.tQomInspectionPlanDetailId = tQomInspectionPlanDetailId
          })
        }
      }
    },
    tableCurrentChange (row) {
      if (row) {
        this.tQomInspectionPlanMainId = row.tQomInspectionPlanMainId
        this.isSelect = true
      } else {
        this.tQomInspectionPlanMainId = null
        this.isSelect = false
      }
    },
    mainSelectionChange (selection) {
      this.planSelects = []
      selection.forEach(item => {
        this.planSelects.push(item.tQomInspectionPlanMainId)
      })
    },
    infoSelectionChange (selection) {
      this.infoSelects = []
      selection.forEach(item => {
        this.infoSelects.push(item.tQomInspectionPlanDetailId)
      })
    },
    async getPlanList () {
      const { planName, page, queryLevel } = this
      const params = Object.assign({ planName, queryLevel }, page)
      const res = await this.$api.getAqlPlans(params)
      if (res.code === '200') {
        this.planData = res.data.list
      } else {
        this.planData = []
      }
    },
    async deletePlans () {
      const { planSelects } = this
      if (planSelects.length > 0) {
        const isConfirm = await this.$myPrompt.confirm('确定删除当前选中的抽样计划吗？')
        if (isConfirm) {
          const res = await this.$api.deleteAqlplans(planSelects)
          this.$myPrompt.handleMsg(res, this.getPlanList)
        }
      } else {
        this.$message.warning('请选择需要删除的抽样计划！')
      }
    },
    async getAqlPlanInfo (tQomInspectionPlanMainId) {
      const params = Object.assign({ tQomInspectionPlanMainId }, this.page)
      const res = await this.$api.getAqlPlanInfo(params)
      if (res.code === '200') {
        this.planInfo = res.data.list
      } else {
        this.planInfo = []
      }
    },
    async deletePlanInfo () {
      const { infoSelects, tQomInspectionPlanMainId } = this
      if (infoSelects.length > 0) {
        const isConfirm = await this.$myPrompt.confirm('确定删除当前选中的抽样计划详情吗？')
        if (isConfirm) {
          const res = await this.$api.deleteAqlplanInfo(infoSelects)
          this.$myPrompt.handleMsg(res, () => {
            this.getAqlPlanInfo(tQomInspectionPlanMainId)
          })
        }
      } else {
        this.$message.warning('请选择需要删除的抽样计划详情！')
      }
    }
  },
  created () {
    this.getProcessList()
    this.getInspectLevelList()
    this.getAqlLevels()
    this.getPlanList()
  },
  components: {
    mainDialog, infoDialog
  }
}
</script>
