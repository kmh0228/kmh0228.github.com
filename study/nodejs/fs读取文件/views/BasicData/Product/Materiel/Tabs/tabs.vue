<template>
   <el-tabs v-model="tabAciveName">
    <el-tab-pane :label="$t('material_essInform')" name="info">
      <basic-info :useType="useType" :infoForm="infoForm" ref="info" @set-material-id="setMaterialId"></basic-info>
    </el-tab-pane>
    <el-tab-pane :label="$t('material_materialType')" name="category">
      <category :useType="useType" :categoryData="categoryData" ref="category"></category>
      <el-row v-if="useType!==0" style="margin-top:15px;">
        <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addCategory">{{$t('common_add')}}</el-button>
        <el-dialog :visible.sync="categoryDialog" width="600px" :title="$t('material_pleaseSelect')" class="handle-dialog">
          <el-form label-width="120px" label-position="left">
            <el-form-item :label="$t('material_cateCode')">
              <el-select v-model="classCode" clearable filterable size="mini" style="width:100%">
                <el-option v-for="(option,i) in materialClassList" :key="i" :label="option.Code" :value="option.mComMaterialClassId"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-row class="dialog-footer">
            <el-button type="primary" size="mini" @click="pushMaterialClassList">{{$t('common_ok')}}</el-button>
            <el-button size="mini" @click="categoryDialog = false">{{$t('common_cancel')}}</el-button>
          </el-row>
        </el-dialog>
       </el-row>
    </el-tab-pane>
    <el-tab-pane :label="$t('material_materialPropert')" name="attribute">
      <attribute :useType="useType" :attributeForm="attributeForm" :mComMaterialId="mComMaterialId" ref="attribute"></attribute>
      <!-- <attribute :useType="useType" :attributeData="attributeData" :attributeHandle="attributeHandle" ref="attribute"></attribute> -->
      <!-- <el-row v-if="useType!==0" style="margin-top:15px;">
        <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="attributeHandle('')">添加</el-button>
        <el-dialog :visible.sync="attributeDialog" :title="attributeTitle" class="handle-dialog" @close="attributeDialogCannel">
          <el-form class="el-row mes-form-rule" :model="attributeForm" ref="attributeForm" label-width="30%" label-position="left" :rules="attributeRules">
            <el-form-item label="属性代码" prop="propCode" class="el-col el-col-11">
              <el-input v-model="attributeForm.propCode" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="属性名称" prop="propName" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="attributeForm.propName" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="属性值" prop="value" class="el-col el-col-11">
              <el-input v-model="attributeForm.value" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="属性值类型" prop="valueType" class="el-col el-col-11 el-col-offset-1">
              <el-input v-model="attributeForm.valueType" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="属性值描述" prop="propDesc" label-width="14.4%" class="el-col el-col-23">
              <el-input v-model="attributeForm.propDesc" type="textarea" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <el-row class="dialog-footer">
            <el-button type="primary" size="mini" @click="pushAttributelist">{{ isEditForm? '确定' : '添加' }}</el-button>
            <el-button size="mini" @click="attributeDialogCannel">取消</el-button>
          </el-row>
        </el-dialog>
      </el-row> -->
    </el-tab-pane>
    <el-tab-pane :label="$t('material_invenInform')" name="information">
      <information :useType="useType" :informationForm="informationForm" :mComMaterialId="mComMaterialId" ref="information"></information>
    </el-tab-pane>
    <el-tab-pane :label="$t('material_transControl')" name="control">
      <control :useType="useType" :controlData="controlData" :mComMaterialId="mComMaterialId" ref="control"></control>
      <el-row v-if="useType!==0" style="margin-top:15px;">
        <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addControl">{{$t('common_add')}}</el-button>
        <!-- <el-dialog :visible.sync="categoryDialog" width="600px" title="请选择" class="handle-dialog">
          <el-form label-width="120px" label-position="left">
            <el-form-item label="类别代码">
              <el-select v-model="classCode" clearable filterable size="mini" style="width:100%">
                <el-option v-for="(option,i) in materialClassList" :key="i" :label="option.Code" :value="option.mComMaterialClassId"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-row class="dialog-footer">
            <el-button type="primary" size="mini" @click="pushMaterialClassList">确定</el-button>
            <el-button size="mini" @click="categoryDialog = false">取消</el-button>
          </el-row>
        </el-dialog> -->
       </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import basicInfo from './basicInfo'
import category from './category'
import attribute from './attribute'
import information from './information'
import control from './control'
export default {
  data () {
    return {
      tabAciveName: 'info',
      infoForm: {
        materialNo: '',
        materialName: '',
        mComMaterialtypeCode: '',
        materialType: '',
        version: '',
        custMaterialNo: '',
        model: '',
        modelName: '',
        minQty: null,
        mMinUomId: '',
        specs: '',
        upc: '',
        volume: '',
        mComUomId: '',
        mVolumeUomId: '',
        volumeLength: null,
        volumeWidth: null,
        volumeHeight: null,
        mVolDimUomId: '',
        minPacQty: null,
        mUomPackID: '',
        netWeight: '',
        crossWeight: '',
        mWeightUomId: '',
        textureMaterial: '',
        untPrice: '',
        mPriceUomId: '',
        isUsed: false,
        isWaterLevel: false,
        lowerQuantity: '',
        upperQuantity: ''
      },
      categoryDialog: false,
      classCode: '',
      materialClassList: [],
      categoryData: {
        mComMaterialId: null,
        classVmList: []
      },
      attributeData: {
        mComMaterialId: null,
        PropVmList: []
      },
      attributeDialog: false,
      // attributeForm: {
      //   propCode: '',
      //   propName: '',
      //   value: '',
      //   valueType: '',
      //   propDesc: ''
      // },
      attributeForm: {
        mComMaterialPropSnruleid: '',
        mComMaterialPropWorkflowid: '',
        mComMaterialPropTimerid: '',
        mComMaterialPropWorkmasterid: '',
        mPomWorkMasPackRuleId: '',
        tQomInspectionPlanMainId: ''
      },
      attributeRowIndex: null,
      isEditForm: false,
      // attributeRules: {
      //   propCode: [{ required: true, message: '属性代码不能为空' }],
      //   propName: [{ required: true, message: '属性名称不能为空' }],
      //   value: [{ required: true, message: '属性值不能为空' }]
      // },
      informationForm: {
        aBCCategory: '',
        isExpirationControl: '0',
        shelfLife: '',
        earlyWarnPeriodUnit: '',
        maxStockAge: '',
        materialBatchScheme: '',
        packUnit: '',
        packCapacity: ''
      },
      controlData: []
    }
  },
  props: {
    useType: {
      type: Number
    },
    mComMaterialId: {
      type: String
    }
  },
  computed: {
    attributeTitle () {
      return this.isEditForm ? this.$t('material_editItemPro') : this.$t('material_newItemAttr')
    }
  },
  watch: {
    mComMaterialId (val) {
      this.getMaterialById(val)
      this.getMaterialAttribute(val)
      this.getMaterialClass(val)
      this.getStock(val)
      this.getIoControl(val)
    }
  },
  methods: {
    // 根据id获取物料基本信息
    async getMaterialById (id) {
      let res = await this.$api.getMaterialById(id)
      let resultData = res.data
      let keys = Object.keys(this.infoForm)
      keys.forEach(key => {
        this.infoForm[key] = resultData[key]
      })
    },
    // 根据id获取物料属性
    async getMaterialAttribute (id) {
      let res = await this.$api.getMaterialAttribute(id)
      if (res.code === '200') {
        this.attributeForm = res.data || {}
      }
    },
    // 根据id获取物料类别
    async getMaterialClass (id) {
      let res = await this.$api.getMaterialClassById(id)
      this.categoryData.classVmList = res.data
    },
    // 获取所有物料类别
    async getAllMaterialClass () {
      let res = await this.$api.getAllMaterialClass()
      this.materialClassList = res.data
    },
    // 获取库存资料
    async getStock (mComMaterialId) {
      let res = await this.$api.getStock({ materialId: mComMaterialId })
      this.informationForm = res.data ? { ...res.data } : this.informationForm
    },
    // 获取收发控制列表
    async getIoControl (mComMaterialId) {
      let res = await this.$api.getIoControl({ materialId: mComMaterialId })
      this.controlData = res.data ? res.data : []
    },
    addCategory () {
      this.categoryDialog = true
    },
    pushMaterialClassList () {
      let { classCode, materialClassList } = this
      let { classVmList } = this.categoryData
      let materialClass = materialClassList.filter(item => {
        return item.mComMaterialClassId === classCode
      })[0]
      let { mComMaterialClassId } = materialClass
      let arr = []
      classVmList.forEach(val => {
        if (val.mComMaterialClassId === mComMaterialClassId) {
          arr.push(true)
        } else {
          arr.push(false)
        }
      })
      if (arr.indexOf(true) === -1) {
        this.categoryData.classVmList.push(materialClass)
      } else {
        this.$message.warning(this.$t('material_materialExists'))
      }
    },
    attributeHandle (index) {
      if (index !== '') {
        this.isEditForm = true
        this.attributeRowIndex = index
        this.attributeForm = { ...this.attributeData.PropVmList[index] }
      } else {
        this.isEditForm = false
      }
      this.attributeDialog = true
    },
    attributeDialogCannel () {
      this.attributeDialog = false
      this.$refs.attributeForm.resetFields()
    },
    pushAttributelist () {
      this.$refs.attributeForm.validate(valid => {
        if (valid) {
          let { isEditForm } = this
          let data = { ...this.attributeForm }
          if (isEditForm) {
            let { attributeRowIndex } = this
            this.attributeData.PropVmList[attributeRowIndex] = Object.assign(this.attributeData.PropVmList[attributeRowIndex], data)
            this.attributeDialog = false
          } else {
            this.attributeData.PropVmList.push(data)
            this.$refs.attributeForm.resetFields()
          }
        }
      })
    },
    setMaterialId (id) {
      this.mComMaterialId = id
      this.infoForm.mComMaterialId = id
      this.categoryData.mComMaterialId = id
      this.attributeData.mComMaterialId = id
    },
    saveCurrentPage () {
      const tabName = this.tabAciveName
      this.$refs[tabName].saveMaterial()
    },
    addControl () {
      // 添加收发控制
      this.controlData.push({
        mComMaterialId: this.mComMaterialId,
        mWmsWarehouseId: '',
        defaultAreaId: '',
        defaultBinId: '',
        assignRuleId: '',
        turnoverRuleId: '',
        inUpLimitMultiple: '',
        outUpLimitMultiple: '',
        minStockQty: '',
        maxStockQty: '',
        areaList: [],
        binList: []
      })
    }
  },
  components: {
    basicInfo, category, attribute, information, control
  },
  created () {
    let { useType, mComMaterialId } = this
    if (useType !== 1) {
      this.getMaterialById(mComMaterialId)
      this.getMaterialAttribute(mComMaterialId)
      this.getMaterialClass(mComMaterialId)
      this.setMaterialId(mComMaterialId)
      this.getStock(mComMaterialId)
      this.getIoControl(mComMaterialId)
    }
    if (useType !== 0) {
      this.getAllMaterialClass()
    }
  }
}
</script>
