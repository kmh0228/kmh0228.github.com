<template>
  <el-form :model="areaForm" ref="areaForm" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('common_Wareh')" prop="mWmsWarehouseId" class="el-col el-col-24">
      <el-select  v-model="areaForm.mWmsWarehouseId" filterable clearable style="width:100%">
        <el-option :label="item.mWmsWarehouseName" :value="item.mWmsWarehouseId" :key="i" v-for="(item,i) in warehousesList"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_AreaCode')" prop="mWmsWarehouseAreaCode" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('cargoAreaMana_AreaName')" prop="mWmsWarehouseAreaName" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('cargoAreaMana_Funct')" prop="mWmsWarehouseAreaFunction" class="el-col el-col-24">
      <dict-select v-model="areaForm.mWmsWarehouseAreaFunction"  dictType="AREA_FUNCTION" clearable :placeholder="$t('cargoAreaMana_PleasSeleFuncRo')"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('cargoAreaMana_StoraEnvi')" prop="mWmsWarehouseAreaCondition" class="el-col el-col-24">
      <dict-select v-model="areaForm.mWmsWarehouseAreaCondition"  dictType="AREA_STORAGE_ENVIRONMENT" clearable :placeholder="$t('cargoAreaMana_PleasSeleStorEn')"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('cargoAreaMana_StoraValuType')" prop="mWmsWarehouseAreaValue" class="el-col el-col-24">
      <dict-select v-model="areaForm.mWmsWarehouseAreaValue"  dictType="STORAGE_VALUABLE_TYPES" clearable :placeholder="$t('cargoAreaMana_PleasSeleStorEn')"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('common_UsageStorSpac')" prop="mWmsWarehouseAreaUse" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaUse" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveArea">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    rules () {
      return {
        mWmsWarehouseId: [{ required: true, message: this.$t('cargoAreaMana_WarehCannBeEmpt') }],
        mWmsWarehouseAreaCode: [{ required: true, message: this.$t('cargoAreaMana_AreaCodeCannBeE') }],
        mWmsWarehouseAreaName: [{ required: true, message: this.$t('cargoAreaMana_TheAreaNameCann') }]
      }
    }
  },
  props: {
    warehousesList: {
      type: Array
    },
    getArea: {
      type: Function
    },
    mWmsWarehouseAreaId: {
      type: String
    },
    areaForm: {
      type: Object
    }
  },
  methods: {
    resetFields () {
      this.$refs.areaForm.resetFields()
    },
    saveArea () {
      this.$refs.areaForm.validate(async valid => {
        if (valid) {
          let res = this.areaForm.mWmsWarehouseAreaId ? await this.$api.editArea({ ...this.areaForm }) : await this.$api.addArea({ ...this.areaForm })
          let { code, msg } = res
          if (code === '200') {
            this.getArea()
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
          this.$emit('cannel')
        }
      })
    }

  }
}
</script>
