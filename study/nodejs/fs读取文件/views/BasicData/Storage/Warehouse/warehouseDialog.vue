<template>
 <el-form :model="wareHouseForm" ref="wareHouseForm" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
   <el-form-item :label="$t('warehouse_WarehCode')" prop="mWmsWarehouseCode" class="el-col el-col-24">
     <el-input v-model.trim="wareHouseForm.mWmsWarehouseCode" size="mini"></el-input>
   </el-form-item>
   <el-form-item :label="$t('warehouse_WarehName')" prop="mWmsWarehouseName" class="el-col el-col-24">
     <el-input v-model.trim="wareHouseForm.mWmsWarehouseName" size="mini"></el-input>
   </el-form-item>
   <el-form-item :label="$t('warehouse_WarehType')" prop="mWmsWarehouseType" class="el-col el-col-24">
     <!-- <el-input v-model.trim="wareHouseForm.mWmsWarehouseType" size="mini"></el-input> -->
      <!-- <el-select v-model="wareHouseForm.mWmsWarehouseType" size="mini" style="width:100%" filterable placeholder="请选择仓库类型">
       <el-option>主要</el-option>
     </el-select> -->
     <dict-select v-model="wareHouseForm.mWmsWarehouseType"  dictType="WAREHOUSE_TYPE" clearable></dict-select>
   </el-form-item>
   <el-form-item :label="$t('warehouse_admin')" prop="mWmsWarehouseAdmin" class="el-col el-col-24">
     <el-input v-model.trim="wareHouseForm.mWmsWarehouseAdmin" size="mini"></el-input>
     <!-- <el-select v-model="wareHouseForm.mWmsWarehouseAdmin" size="mini" style="width:100%" filterable placeholder="请选择管理员">
       <el-option>用户07</el-option>
     </el-select> -->
   </el-form-item>
   <el-form-item :label="$t('warehouse_Usage')" prop="mWmsWarehouseRatio" class="el-col-24">
     <el-input  v-model.trim="wareHouseForm.mWmsWarehouseRatio" size="mini"></el-input>
   </el-form-item>
   <el-form-item :label="$t('warehouse_PickiOrNot')" prop="picking" class="el-col el-col-24">
     <!-- <el-radio-group v-model="wareHouseForm.picking">
      <el-radio :label="0">是</el-radio>
      <el-radio :label="1">否</el-radio>
    </el-radio-group> -->
    <el-checkbox  v-model="wareHouseForm.picking "></el-checkbox>
   </el-form-item>
   <el-form-item :label="$t('warehouse_FreezOrNot')" prop="frozen" class="el-col el-col-24" v-show="isEdit">
     <el-checkbox  v-model="wareHouseForm.frozen"></el-checkbox>
     <!-- <el-radio-group v-model="wareHouseForm.frozen">
      <el-radio :label="0">未冻结</el-radio>
      <el-radio :label="1">冻结</el-radio>
    </el-radio-group> -->
   </el-form-item>
  <el-form-item :label="$t('common_Enable')" prop="invalid" class="el-col-24" v-show="isEdit">
    <el-checkbox  v-model="wareHouseForm.invalid"></el-checkbox>
   </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveWarehouse">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
 </el-form>
</template>

<script>
export default {
  data () {
    return {
      wareHouseForm: {
        mWmsWarehouseCode: '',
        mWmsWarehouseName: '',
        mWmsWarehouseType: '',
        mWmsWarehouseAdmin: '',
        mWmsWarehouseRatio: '',
        invalid: true,
        creator: '',
        picking: true,
        frozen: false
      }
    }
  },
  computed () {
    return {
      mWmsWarehouseCode: [{ required: true, message: this.$t('warehouse_WarehCodeCannBe') }],
      mWmsWarehouseName: [{ required: true, message: this.$t('warehouse_WarehNameCannBe') }]
    }
  },
  props: {
    isEdit: {
      type: Boolean
    },
    getWarehouses: {
      type: Function
    }

  },
  methods: {
    saveWarehouse () {
      this.$refs.wareHouseForm.validate(async valid => {
        if (valid) {
          let data = { ...this.wareHouseForm, picking: this.wareHouseForm.picking ? 0 : 1, frozen: this.wareHouseForm.frozen ? 1 : 0 }
          let res = this.isEdit ? await this.$api.eidtWarehouse(data) : await this.$api.addWareHouse(data)
          let { code, msg } = res
          if (code === '200') {
            this.$emit('getWarehouses')
            this.$emit('cannel')
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  }

}
</script>
