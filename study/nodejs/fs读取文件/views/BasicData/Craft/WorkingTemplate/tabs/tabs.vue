<template>
  <el-tabs v-model="tabAciveName">
    <el-tab-pane :label="$t('common_essenInfo')" name="info">
      <basic-info :useType="useType" :basicInfo="basicInfo" :mPomWorkMasterId="wrokMasterId" @set-work-masterId="setWorkMasterId" ref="info"></basic-info>
    </el-tab-pane>
    <el-tab-pane :label="$t('workingTemp_TemplMate')" name="material">
      <material :useType="useType" :templateMaterials="templateMaterials" ref="material"></material>
      <el-row v-if="useType!==0" style="margin-top:15px;">
        <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="pushMaterials">{{$t('common_add')}}</el-button>
      </el-row>
    </el-tab-pane>
    <el-tab-pane :label="$t('workingTemp_TemplPara')" name="parameter">
      <parameter :useType="useType" :templateParams="templateParams" ref="parameter" :parameterHandle="parameterHandle"></parameter>
      <el-row v-if="useType!==0" style="margin-top:15px;">
        <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="parameterHandle('')">{{$t('common_add')}}</el-button>
        <el-dialog :visible.sync="parameterDialog" :title="parameterTitle" class="handle-dialog">
          <el-form class="el-row mes-form-rule" :model="parameterForm" ref="parameterForm" label-width="30%" label-position="left" :rules="parameterRules">
            <el-form-item :label="$t('workingTemp_ParamName')" prop="paramName" class="el-col el-col-11">
              <el-input v-model="parameterForm.paramName" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('workingTemp_ParamValu')" prop="paramValue" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="parameterForm.paramValue" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('workingTemp_UnitMeas')" prop="mComUomId" class="el-col el-col-11">
              <el-input v-model="parameterForm.mComUomId" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common_Enable')" prop="isInvalid" class="el-col el-col-11 el-col-offset-1">
              <el-checkbox v-model="parameterForm.isInvalid" true-label="0" false-label="1"></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('common_Description')" prop="paramDesc" label-width="14.4%" class="el-col el-col-23">
              <el-input v-model="parameterForm.paramDesc" type="textarea" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <el-row class="dialog-footer">
            <el-button type="primary" size="mini" @click="pushParameters">{{$t('common_ok')}}</el-button>
            <el-button size="mini" @click="parameterDialog = false">{{$t('common_cancel')}}</el-button>
          </el-row>
        </el-dialog>
       </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import basicInfo from './basicInfo'
import material from './material'
import parameter from './parameter'
export default {
  data () {
    return {
      tabAciveName: 'info',
      isChange: false,
      basicInfo: {
        workCode: '',
        workName: '',
        version: '',
        stationType: '',
        inoutFlag: '',
        isInvalid: '0'
      },
      templateMaterials: {
        mPomWorkMasterId: null,
        materialList: []
      },
      templateParams: {
        mPomWorkMasterId: null,
        paramsList: []
      },
      isEditForm: false,
      parameterDialog: false,
      parameterForm: {
        paramName: '',
        paramValue: '',
        mComUomId: '',
        paramDesc: '',
        isInvalid: '0'
      },
      parameterRowIndex: null
    }
  },
  props: {
    useType: {
      type: Number
    },
    wrokMasterId: {
      type: String
    }
  },
  watch: {
    wrokMasterId (val) {
      this.getBasicInfo()
      this.getMaterialList()
      this.getParamList()
    }
  },
  computed: {
    parameterTitle () {
      return this.isEditForm ? this.$t('workingTemp_EditTempPara') : this.$t('workingTemp_NewTempPara')
    },
    parameterRules () {
      return {
        paramName: [{ required: true, message: this.$t('workingTemp_ParamNameCannBe') }],
        paramValue: [{ required: true, message: this.$t('workingTemp_ReferValuCannBe') }]
      }
    }
  },
  methods: {
    // 获取工作模板基本信息
    async getBasicInfo () {
      let { wrokMasterId } = this
      if (wrokMasterId) {
        let res = await this.$api.getWorkTemplateInfo(wrokMasterId)
        let data = res.data
        this.$global.setFormValue(this.basicInfo, data)
      }
    },
    // 获取模板物料
    async getMaterialList () {
      let { wrokMasterId } = this
      if (wrokMasterId) {
        let res = await this.$api.getTemplateMaterails(wrokMasterId)
        this.templateMaterials.materialList = res.data
      }
    },
    // 获取模板参数
    async getParamList () {
      let { wrokMasterId } = this
      if (wrokMasterId) {
        let res = await this.$api.getTemplateParams(wrokMasterId)
        this.templateParams.paramsList = res.data
      }
    },
    // 设置工作模版id
    setWorkMasterId (id) {
      this.templateMaterials.mPomWorkMasterId = id
      this.templateParams.mPomWorkMasterId = id
    },
    // 操作模板物料
    pushMaterials () {
      this.templateMaterials.materialList.push({
        cassemblyStep: '',
        assemblyType: '',
        isInvalid: '0',
        mComMaterialId: '',
        materialName: '',
        materialNo: '',
        materialType: '',
        specDesc: '',
        version: ''
      })
    },
    // 操作模版参数
    parameterHandle (index) {
      if (index !== '') {
        this.isEditForm = true
        this.parameterRowIndex = index
        this.parameterForm = { ...this.templateParams.paramsList[index] }
      } else {
        this.isEditForm = false
        this.parameterForm = {
          paramName: '',
          paramValue: '',
          mComUomId: '',
          paramDesc: '',
          isInvalid: '0'
        }
      }
      this.parameterDialog = true
    },
    pushParameters () {
      this.$refs.parameterForm.validate(valid => {
        if (valid) {
          let { isEditForm } = this
          let data = { ...this.parameterForm }
          if (isEditForm) {
            let { parameterRowIndex } = this
            this.templateParams.paramsList[parameterRowIndex] = Object.assign(this.templateParams.paramsList[parameterRowIndex], data)
            this.parameterDialog = false
          } else {
            this.templateParams.paramsList.push(data)
            this.$refs.parameterForm.resetFields()
          }
        }
      })
    },
    // 保存当前tab标签页
    saveCurrentPage () {
      const tabName = this.tabAciveName
      this.$refs[tabName].saveWorkTemplate()
    }
  },
  components: {
    basicInfo, material, parameter
  },
  async created () {
    let { useType, wrokMasterId } = this
    if (useType !== 1) {
      this.getBasicInfo()
      this.getMaterialList()
      this.getParamList()
      this.setWorkMasterId(wrokMasterId)
    }
  }
}
</script>
