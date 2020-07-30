<template>
<el-form :model="detaliForm" :rules="rules" ref="detaliForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item  :label="$t('WarehouseWarrant_PN')" prop="mWmsEntrylistDetailMarerialid" class="el-col el-col-24">
     <!-- <el-select v-model="detaliForm.mWmsEntrylistDetailMarerialid" size="mini" style="width:100%"  filterable :placeholder="$t('WarehouseWarrant_PleaseSelectMaterialNumber')">
       <el-option v-for="(option,i) in mWmsEntrylistDetailMareralType" :key="i" :label="option.materialNo" :value="option.mComMaterialId"></el-option>
     </el-select> -->
    <dialogTableSelect style="width:100%" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  v-model="detaliForm.mWmsEntrylistDetailMarerialid" selectId="mComMaterialId" search :placeholder="$t('WarehouseWarrant_PleaseSelectMaterialNumber')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
  </el-form-item>
   <el-form-item  :label="$t('WarehouseWarrant_StorageQuantity')" prop="mWmsEntrylistDetailQty" class="el-col el-col-24">
     <el-input v-model="detaliForm.mWmsEntrylistDetailQty" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('WarehouseWarrant_StorageLevel')" prop="mWmsEntrylistDetailBinid" class="el-col el-col-24">
    <el-select v-model="detaliForm.mWmsEntrylistDetailBinid" size="mini" style="width:100%" filterable :placeholder="$t('WarehouseWarrant_PleaseSelectTheReservoir')" >
       <el-option v-for="(option,i) in mWmsEntrylistDetailBinType" :key="i" :label="option.mWmsWarehouseBinCode" :value="option.mWmsMaterialbinBinid"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer" style="width:100%">
      <el-button type="primary" size="mini" @click="saveEntryDetailList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      detaliForm: {
        materialNo: '',
        version: '',
        mWmsEntrylistDetailMarerialid: '',
        mWmsEntrylistDetailQty: '',
        mWmsEntrylistDetailBinid: ''
      },
      mWmsEntrylistDetailBinType: [],
      page: {
        pageSize: 1000,
        pageIndex: 1
      },
      serachData: {
        materialNo: '',
        materialType: ''
      },
      materialSearch: {
        materialNo: '',
        materialType: ''
      }

    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.detaliForm.materialNo ? this.detaliForm.materialNo + ':' : ''
      const version = this.detaliForm.version ? this.detaliForm.version : ''
      return `${materialNo}${version}`
    },
    rules () {
      return {
        mWmsEntrylistDetailMarerialid: [{ required: true, message: this.$t('WarehouseWarrant_PleaseSelectMaterialNumber') }],
        mWmsEntrylistDetailQty: [{ required: true, message: this.$t('WarehouseWarrant_PleaseEnterTheOutgoingQuantity') }],
        mWmsEntrylistDetailBinid: [{ required: true, message: this.$t('WarehouseWarrant_PleaseSelectTheReservoir') }]
      }
    },
    materialColumns () {
      return [{
        key: 'materialNo',
        label: this.$t('WarehouseWarrant_PN')
      }, {
        key: 'materialName',
        label: this.$t('WarehouseWarrant_MaterialName')
      }, {
        key: 'version',
        label: this.$t('common_Edition')
      }, {
        key: 'mComMaterialtypeCode',
        label: this.$t('common_MaterialType')
      }]
    }
  },
  props: {
    isEdit: Boolean,
    getInboundOrderDetail: Function,
    mWmsEntrylistId: String,
    mWmsMaterialbinId: {
      type: String
    }
  },
  methods: {
    saveEntryDetailList () {
      this.$refs.detaliForm.validate(async valid => {
        if (valid) {
          let { isEdit, detaliForm, mWmsEntrylistId } = this
          let inboundOrderDetailVmList = [detaliForm]
          let data = isEdit ? detaliForm : Object.assign({ mWmsEntrylistId }, { inboundOrderDetailVmList })
          let res = isEdit ? await this.$api.editInboundOrderDetail(data) : await this.$api.saveInboundOrderDetail(data)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getInboundOrderDetail', mWmsEntrylistId)
          } else {
            this.$message.error(msg)
          }
          this.$emit('cannel')
        }
      })
    },
    async getBinByMaterialId () {
      let mWmsMaterialbinId = this.mWmsMaterialbinId
      let res = await this.$api.getBinByMaterialId({ mWmsMaterialbinId })
      this.mWmsEntrylistDetailBinType = res.data
    }

  },
  created () {
    this.getBinByMaterialId()
  },
  components: {
    dialogTableSelect
  }

}
</script>
