 <template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule" >
  <el-form-item :label="$t('WarehouseWarrant_StorageOrders')" prop="mWmsEntrylistNo" class="el-col el-col-24">
       <el-input v-model.trim="dialogForm.mWmsEntrylistNo" :placeholder="$t('WarehouseWarrant_PleaseEnterEheEntryNumber')" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('WarehouseWarrant_StorageMode')" prop="mWmsEntrylistTypeId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsEntrylistTypeId" clearable dictType="ENTRY_STROAGE_WAY" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item :label="$t('WarehouseWarrant_StorageWarehouse')" prop="mWmsEntrylistWharehouseid" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsEntrylistWharehouseid" filterable :placeholder="$t('WarehouseWarrant_PleaseSelectTheWarehouse')" style="width:100%">
      <el-option v-for="(option,i) in mWmsEntryWarehouseidList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item :label="$t('WarehouseWarrant_Emergencies')" prop="mWmsEntrylistLevelId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsEntrylistLevelId" dictType="EMERGENCY_TYPE"  :placeholder="$t('WarehouseWarrant_PleaseSelectTheEmergency')" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item :label="$t('WarehouseWarrant_Supplier')" prop="mWmsEntrylistVenderid" class="el-col el-col-24" >
    <el-select v-model="dialogForm.mWmsEntrylistVenderid" filterable :placeholder="$t('WarehouseWarrant_PleaseSelectSupplier')" style="width:100%">
      <el-option v-for="(option,i) in mWmsEntrylistVendList" :key="i" :label="option.mWmsVendorName" :value="option.mWmsVendorId"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveEntrylist">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsEntrylistNo: '',
        mWmsEntrylistTypeId: '',
        mWmsEntrylistWharehouseid: '',
        mWmsEntrylistLevelId: '',
        mWmsEntrylistVenderid: ''
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 1000,
        keywords: ''
      },
      // {{$t('WarehouseWarrant_Supplier')}}查询条件
      searchVendors: {
        pageIndex: 1,
        pageSize: 1000,
        mWmsVendorCode: ''
      },
      rules: {
        mWmsEntrylistNo: [{ required: true, message: this.$t('WarehouseWarrant_StorageNoNoEmpty') }],
        mWmsEntrylistTypeId: [{ required: true, message: this.$t('WarehouseWarrant_PleaseSelectTheStorageMethod') }],
        mWmsEntrylistWharehouseid: [{ required: true, message: this.$t('WarehouseWarrant_PleaseSelectTheWarehouse') }],
        mWmsEntrylistLevelId: [{ required: true, message: this.$t('WarehouseWarrant_PleaseSelectTheEmergency') }],
        mWmsEntrylistVenderid: [{ required: true, message: this.$t('WarehouseWarrant_PleaseSelectSupplier') }]
      },
      mWmsEntryWarehouseidList: [],
      mWmsEntrylistVendList: []
    }
  },
  props: {
    isEdit: Boolean,
    getInboundOrder: Function,
    cannel: Function
  },
  methods: {
    async getWarehouses () {
      let { searchForm } = this
      let data = Object.assign(searchForm)
      let res = await this.$api.getWarehouses(data)
      this.mWmsEntryWarehouseidList = res.data.list
    },
    // 查询{{$t('WarehouseWarrant_Supplier')}}
    async getVendors () {
      let data = Object.assign(this.searchVendors)
      let res = await this.$api.getVendors(data)
      this.mWmsEntrylistVendList = res.data.list
    },
    saveEntrylist () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let data = Object.assign(this.dialogForm)
          let res = this.isEdit ? await this.$api.editInboundOrder(data) : await this.$api.addInboundOrder(data)
          let { code, msg } = res
          if (code === '200') {
            this.$emit('getInboundOrder')
            this.$emit('cannel')
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getWarehouses()
    this.getVendors()
  }
}
</script>
