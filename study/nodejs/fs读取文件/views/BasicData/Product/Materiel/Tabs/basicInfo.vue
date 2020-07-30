<template>
  <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="30%" label-position="left" class="el-row work-order-info mes-form-rule">
    <el-form-item :label="$t('material_material')" prop="materialNo" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.materialNo }}</p>
      <el-input v-else size="mini" v-model="infoForm.materialNo" :disabled="useType===2" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_MaterialName')" prop="materialName" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.materialName }}</p>
      <el-input v-else size="mini" v-model="infoForm.materialName" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_MaterialType')" prop="materialType" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.mComMaterialtypeCode }}</p>
      <el-select v-else size="mini" v-model="infoForm.materialType" filterable clearable class="mes-form-item">
        <el-option v-for="(option,i) in materialTypes" :key="i" :label="option.mComMaterialtypeCode" :value="option.mComMaterialtypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_Edition')" prop="version" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.version }}</p>
      <el-input v-else size="mini" v-model="infoForm.version" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('material_productSeri')" prop="model" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.modelName }}</p>
      <el-select size="mini" v-else v-model="infoForm.model" clearable filterable :placeholder="$t('material_pleaseSelect')" class="mes-form-item">
        <el-option v-for="(option,i) in modelList" :key="i" :label="option.mComMaterialfamilyName" :value="option.mComMaterialfamilyId">
          <span style="float: left">{{ option.mComMaterialfamilyName }}</span>
          <span style="float: right; color: #8492a6; font-size: 14px">{{ option.mComMaterialfamilyCode}}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('material_customNo')" prop="custMaterialNo" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.custMaterialNo }}</p>
      <el-input v-else size="mini" v-model="infoForm.custMaterialNo" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('material_basicUnit')" prop="mComUomId" class="el-col el-col-12">
      <p v-if="isRead">{{ findUomCode (infoForm.mComUomId) }}</p>
      <el-select v-else size="mini" v-model="infoForm.mComUomId" class="mes-form-item">
        <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('material_minQuan')" prop="minQty" class="el-col el-col-12">
      <p v-if="isRead">{{ infoForm.minQty }}</p>
      <el-input v-else size="mini" v-model="infoForm.minQty" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('material_quanUnit')" prop="mMinUomId" class="el-col el-col-12">
      <p v-if="isRead">{{ findUomCode (infoForm.mMinUomId) }}</p>
      <el-select v-else size="mini" v-model="infoForm.mMinUomId" class="mes-form-item">
        <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
      </el-select>
    </el-form-item>
     <el-form-item :label="$t('material_materialDesc')" prop="materialDesc" label-width="15%" class="el-col el-col-24">
      <p v-if="isRead">{{ infoForm.materialDesc }}</p>
      <el-input v-else size="mini" type="textarea" v-model="infoForm.materialDesc" style="width:96%"></el-input>
    </el-form-item>
    <div v-show="isShowMore">
      <el-form-item :label="$t('material_Specifications')" prop="specs" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.specs }}</p>
        <el-input v-else size="mini" v-model="infoForm.specs" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_UPCCode')" prop="upc" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.upc }}</p>
        <el-input v-else size="mini" v-model="infoForm.upc" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_volume')" prop="volume" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.volume }}</p>
        <el-input v-else size="mini" v-model="infoForm.volume" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_molumeUnit')" prop="mVolumeUomId" class="el-col el-col-12">
        <p v-if="isRead">{{ findUomCode (infoForm.mVolumeUomId) }}</p>
        <el-select v-else size="mini" v-model="infoForm.mVolumeUomId" class="mes-form-item">
          <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common_long')" prop="volumeLength" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.volumeLength }}</p>
        <el-input v-else size="mini" v-model="infoForm.volumeLength" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_width')" prop="volumeWidth" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.volumeWidth }}</p>
        <el-input v-else size="mini" v-model="infoForm.volumeWidth" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_height')" prop="volumeHeight" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.volumeHeight }}</p>
        <el-input v-else size="mini" v-model="infoForm.volumeHeight" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_volumeUnit')" prop="mVolDimUomId" class="el-col el-col-12">
        <p v-if="isRead">{{ findUomCode (infoForm.mVolDimUomId) }}</p>
        <el-select v-else size="mini" v-model="infoForm.mVolDimUomId" class="mes-form-item">
          <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_minPack')" prop="minPacQty" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.minPacQty }}</p>
        <el-input v-else size="mini" v-model="infoForm.minPacQty" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_packUnit')" prop="mUomPackID" class="el-col el-col-12">
        <p v-if="isRead">{{ findUomCode (infoForm.mUomPackID) }}</p>
        <el-select v-else size="mini" v-model="infoForm.mUomPackID" class="mes-form-item">
          <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_netWeight')" prop="netWeight" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.netWeight }}</p>
        <el-input v-else size="mini" v-model="infoForm.netWeight" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_grossWeight')" prop="crossWeight" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.crossWeight }}</p>
        <el-input v-else size="mini" v-model="infoForm.crossWeight" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_weightUnit')" prop="mWeightUomId" class="el-col el-col-12">
        <p v-if="isRead">{{ findUomCode (infoForm.mWeightUomId) }}</p>
        <el-select v-else size="mini" v-model="infoForm.mWeightUomId" class="mes-form-item">
          <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_texture')" prop="textureMaterial" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.textureMaterial }}</p>
        <el-input v-else size="mini" v-model="infoForm.textureMaterial" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_unitPrice')" prop="untPrice" class="el-col el-col-12">
        <p v-if="isRead">{{ infoForm.untPrice }}</p>
        <el-input v-else size="mini" v-model="infoForm.untPrice" class="mes-form-item"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_priceUnit')" prop="mPriceUomId" class="el-col el-col-12">
        <p v-if="isRead">{{ findUomCode (infoForm.mPriceUomId) }}</p>
        <el-select v-else size="mini" v-model="infoForm.mPriceUomId" class="mes-form-item">
          <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_inUseOrNot')" prop="isUsed" class="el-col el-col-12">
        <el-checkbox v-model="infoForm.isUsed" :true-label="1" :false-label="0" :disabled="isRead"></el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('material_waterLevelCon')" prop="isWaterLevel" class="el-col el-col-12">
        <el-checkbox v-model="infoForm.isWaterLevel" :true-label="1" :false-label="0" :disabled="isRead"></el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('material_minWaterLevel')" prop="lowerQuantity" class="el-col el-col-12" v-if="infoForm.isWaterLevel ===1">
        <p v-if="isRead">{{ infoForm.lowerQuantity }}</p>
        <el-input v-else size="mini" v-model.number="infoForm.lowerQuantity" class="mes-form-item" @blur="minCheckData"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_maxWaterLevel')" prop="upperQuantity" class="el-col el-col-12"  v-if="infoForm.isWaterLevel ===1">
        <p v-if="isRead">{{ infoForm.upperQuantity }}</p>
        <el-input v-else size="mini" v-model.number="infoForm.upperQuantity" class="mes-form-item" @blur="maxCheckData"></el-input>
      </el-form-item>
    </div>
    <el-form-item label-width="0" class="el-col el-col-23 form-show-more">
      <el-button type="text" @click="isShowMore = !isShowMore"><i class="el-icon-d-arrow-right" :class="showMoreClass"></i> {{ showMoreText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      isShowMore: false,
      materialTypes: [],
      uomList: [],
      modelList: []
    }
  },
  props: {
    infoForm: {
      type: Object
    },
    useType: {
      type: Number
    }
  },
  computed: {
    rules () {
      return {
        materialNo: [{ required: true, message: this.$t('material_materialNoRequire') }],
        materialName: [{ required: true, message: this.$t('material_materialNameRequ') }]
      }
    },
    isRead () {
      return this.useType === 0
    },
    showMoreText () {
      return this.isShowMore ? this.$t('material_putItAway') : this.$t('material_showMore')
    },
    showMoreClass () {
      return this.isShowMore ? 'icon-arrow-up' : 'icon-arrow-down'
    }
  },
  methods: {
    findUomCode (id) {
      return this.uomList.find(item => item.M_COM_UOM_ID === id) ? this.uomList.find(item => item.M_COM_UOM_ID === id).UOM_CODE : ''
    },
    // 获取物料类型
    async getMaterialTypes () {
      const data = {
        keywords: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getMaterialType(data)
      this.materialTypes = res.data.list
    },
    // 获取计量单位
    async getUomList () {
      let res = await this.$api.getUom()
      this.uomList = res.data
    },
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.modelList = res.data.list
    },
    // 检验数据
    maxCheckData () {
      let { infoForm } = this
      if (infoForm.lowerQuantity > 0) {
        if (infoForm.upperQuantity > 0 && infoForm.upperQuantity < infoForm.lowerQuantity) {
          this.$message.warning(this.$t('material_maxThanMin'))
        }
      } else {
        this.$message.warning(this.$t('material_minWaterRequire'))
      }
    },
    minCheckData () {
      let { infoForm } = this
      if (infoForm.lowerQuantity > 0 && infoForm.upperQuantity > 0) {
        if (infoForm.upperQuantity < infoForm.lowerQuantity) {
          this.$message.warning(this.$t('material_maxThanMin'))
        }
      }
    },
    saveMaterial () {
      this.$refs.infoForm.validate(async valid => {
        if (valid) {
          let { infoForm, useType } = this
          let res = useType === 1 ? await this.$api.addMaterialBasicInfo(infoForm) : await this.$api.editMaterialBasicInfo(infoForm)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            if (useType === 1) {
              this.$emit('set-material-id', res.data.mComMaterialId)
            }
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getUomList()
    if (this.useType !== 0) {
      this.getMaterialTypes()
      this.getModelList()
    }
  }
}
</script>

<style lang="scss">
.form-show-more {
  text-align: center;
  .el-button {
    font-size: 0.8vw;
    .icon-arrow-up {
      transform: rotate(-90deg);
    }
    .icon-arrow-down {
      transform: rotate(90deg);
    }
  }
}
</style>
