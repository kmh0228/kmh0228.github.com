<template>
    <el-form class="el-row work-order-info" :model="informationForm" ref="informationForm" label-width="170px" label-position="left" :rules="attributeRules">
       <!-- 第一个是下拉 影响下面布局 神坑 -->
      <div class=" el-row">
        <el-form-item :label="$t('material_ABCClass')" prop="aBCCategory" class="el-col el-col-11">
          <p v-if="isRead">{{ informationForm.aBCCategory}} </p>
          <el-select v-else  v-model="informationForm.aBCCategory" filterable clearable style="width:100%">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('material_validityCon')" prop="isExpirationControl" class="el-col el-col-11 el-col-offset-1">
          <p v-if="isRead">{{ informationForm.isExpirationControl === '1' ? $t('common_Yes'):$t('common_No')}} </p>
          <el-radio-group v-else size="mini"  v-model="informationForm.isExpirationControl">
            <el-radio label="1">{{$t('common_Yes')}}</el-radio>
            <el-radio label="0">{{$t('common_No')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item :label="$t('material_shelfLife')" prop="shelfLife" class="el-col el-col-11 ">
        <p v-if="isRead">{{ informationForm.shelfLife }}</p>
        <el-input v-else size="mini" v-model="informationForm.shelfLife" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_leadTime')" prop="earlyWarnPeriodUnit" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ informationForm.earlyWarnPeriodUnit}} </p>
        <el-input v-else size="mini" v-model="informationForm.earlyWarnPeriodUnit" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_maxStorage')" prop="maxStockAge" class="el-col el-col-11  ">
        <p v-if="isRead">{{ informationForm.maxStockAge}} </p>
        <el-input v-else size="mini" v-model="informationForm.maxStockAge"></el-input>
      </el-form-item>
      <el-form-item :label="$t('material_batchScheme')" prop="materialBatchScheme" class="el-col el-col-11 el-col-offset-1">
        <p v-if="isRead">{{ informationForm.batchName}} </p>
        <el-select v-else size="mini" v-model="informationForm.materialBatchScheme" filterable clearable style="width:100%">
          <el-option :label="item.name" :value="item.mwmsMaterialBatchProgramId" :key="i" v-for="(item,i) in batchProgramList"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item :label="$t('material_packUnit')" prop="packUnit" class="el-col el-col-11 ">
        <p v-if="isRead">{{ informationForm.unitName}} </p>
        <el-select v-else size="mini" v-model="informationForm.packUnit" filterable clearable style="width:100%">
          <el-option :label="item.name" :value="item.mComUomPackId" :key="i" v-for="(item,i) in unitList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('material_minPack')" prop="packCapacity" class="el-col  el-col-11 el-col-offset-1 ">
        <p v-if="isRead">{{ informationForm.packCapacity}} </p>
        <el-input v-else size="mini" v-model="informationForm.packCapacity"></el-input>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      unitList: [],
      batchProgramList: []
    }
  },
  props: {
    useType: Number,
    informationForm: Object,
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
        // /^\d+(\.\d+)?$/
        return {
          aBCCategory: [{ required: true, message: this.$t('material_selectABC') }],
          isExpirationControl: [{ required: true, message: this.$t('material_selectValidity') }],
          shelfLife: [{ required: true, pattern: /^\d+$/, message: this.$t('material_pleaseEnInt') }],
          earlyWarnPeriodUnit: [{ required: true, pattern: /^\d+$/, message: this.$t('material_pleaseEnInt') }],
          maxStockAge: [{ required: true, pattern: /^\d+$/, message: this.$t('material_pleaseEnInt') }],
          materialBatchScheme: [{ required: true, message: this.$t('material_selectBathSch') }],
          packUnit: [{ required: true, message: this.$t('material_selectPackUnit') }],
          packCapacity: [{ required: true, pattern: /^\d+$/, message: this.$t('material_pleaseEnInt') }]
        }
      }
    }
  },
  methods: {
    saveMaterial () {
      this.$refs.informationForm.validate(async valid => {
        if (valid) {
          const { informationForm, mComMaterialId } = this
          const data = Object.assign({ mComMaterialId }, informationForm)
          if (mComMaterialId) {
            let res = await this.$api.saveStock(data)
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
    },
    // 查询包装单位
    async getPackagingUnit (page) {
      let res = await this.$api.getPackUomList({ pageIndex: 1, pageSize: 1000 })
      if (res.code === '200') {
        this.unitList = res.data.list
      } else {
        this.unitList = []
      }
    },
    // 查询物料批次方案
    async getBatchProgramList (page) {
      let res = await this.$api.getBatchProgramList({ pageIndex: 1, pageSize: 1000 })
      if (res.code === '200') {
        this.batchProgramList = res.data.list
      } else {
        this.batchProgramList = []
      }
    }
  },
  created () {
    if (this.useType !== 0) {
      this.getPackagingUnit()
      this.getBatchProgramList()
    }
  }
}
</script>
