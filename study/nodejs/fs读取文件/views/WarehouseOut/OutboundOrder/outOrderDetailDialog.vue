<template>
<el-form :model="detailForm" ref="detailForm" :rules="rules" label-position="left" label-width="160px" class="el-row mes-form-rule">
  <el-form-item  :label="$t('OutboundOrder_PN')" prop="mWmsDeliveryDetailMarerialid" class="el-col el-col-24">
    <!-- <el-select v-model="detailForm.mWmsDeliveryDetailMarerialid" style="width:100%" filterable :placeholder="$t('OutboundOrder_PleaseSelectItemNo')">
      <el-option v-for="(option,i) in MarerialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId"></el-option>
    </el-select> -->
    <dialogTableSelect style="width:100%" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  v-model="detailForm.mWmsDeliveryDetailMarerialid" selectId="mComMaterialId" search:placeholder="$t('OutboundOrder_PleaseSelectItemNo')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
  </el-form-item>
  <el-form-item :label="$t('OutboundOrder_DeliveryQuantity')" prop="mWmsDeliveryDetailQty" class="el-col el-col-24">
    <el-input v-model="detailForm.mWmsDeliveryDetailQty"  style="width:100%"></el-input>
  </el-form-item>
  <el-form-item  :label="$t('OutboundOrder_StorageLocation')" prop="mWmsDeliveryDetailBinid" class="el-col el-col-24">
    <el-select  v-model="detailForm.mWmsDeliveryDetailBinid"  style="width:100%" filterable :placeholder="$t('OutboundOrder_PleaseSelectStorageLocation')">
      <el-option v-for="(option,i) in mWmsDeliveryDetailBinidList" :key="i" :label="option.mWmsWarehouseBinCode" :value="option.mWmsMaterialbinBinid"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDetail">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      detailForm: {
        materialNo: '',
        version: '',
        mWmsDeliveryDetailMarerialid: '',
        mWmsDeliveryDetailQty: '',
        mWmsDeliveryDetailBinid: ''
      },
      MarerialList: [],
      mWmsDeliveryDetailBinidList: [],
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
    rules () {
      return {
        mWmsDeliveryDetailMarerialid: [{ required: true, message: this.$t('OutboundOrder_PleaseSelectItemNo') }]
      }
    },
    materialColumns () {
      return [{
        key: 'materialNo',
        label: this.$t('OutboundOrder_PN')
      }, {
        key: 'materialName',
        label: this.$t('OutboundOrder_MaterialName')
      }, {
        key: 'version',
        label: this.$t('OutboundOrder_Edition')
      }, {
        key: 'mComMaterialtypeCode',
        label: this.$t('OutboundOrder_MaterialType')
      }]
    },
    materialNoVersion () {
      const materialNo = this.detailForm.materialNo ? this.detailForm.materialNo + ':' : ''
      const version = this.detailForm.version ? this.detailForm.version : ''
      return `${materialNo}${version}`
    }
  },
  props: {
    cannel: Function,
    isEdit: Boolean,
    getOutboundOrderDetail: Function,
    mWmsDeliveryId: String,
    mWmsMaterialbinId: String
  },
  methods: {
    async getBinByMaterialId () {
      let mWmsMaterialbinId = this.mWmsMaterialbinId
      let res = await this.$api.getBinByMaterialId({ mWmsMaterialbinId })
      this.mWmsDeliveryDetailBinidList = res.data
    },
    saveDetail () {
      this.$refs.detailForm.validate(async valid => {
        if (valid) {
          let { isEdit, detailForm, mWmsDeliveryId } = this
          let outOrderDetailList = [detailForm]
          let outOrderId = mWmsDeliveryId
          let data = isEdit ? detailForm : Object.assign({ outOrderId }, { outOrderDetailList })
          let res = isEdit ? await this.$api.updateOutDetail(data) : await this.$api.addOutOrderDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getOutboundOrderDetail')
          })
        }
      })
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
