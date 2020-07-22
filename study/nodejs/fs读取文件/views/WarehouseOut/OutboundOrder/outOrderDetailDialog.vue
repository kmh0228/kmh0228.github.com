<template>
<el-form :model="detailForm" ref="detailForm" :rules="rules" label-position="left" label-width="120px" class="el-row mes-form-rule">
  <el-form-item  label="料号" prop="mWmsDeliveryDetailMarerialid" class="el-col el-col-24">
    <!-- <el-select v-model="detailForm.mWmsDeliveryDetailMarerialid" style="width:100%" filterable placeholder="请选择料号">
      <el-option v-for="(option,i) in MarerialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId"></el-option>
    </el-select> -->
    <dialogTableSelect style="width:100%" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  v-model="detailForm.mWmsDeliveryDetailMarerialid" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
  </el-form-item>
  <el-form-item label="出库数量" prop="mWmsDeliveryDetailQty" class="el-col el-col-24">
    <el-input v-model="detailForm.mWmsDeliveryDetailQty"  style="width:100%"></el-input>
  </el-form-item>
  <el-form-item  label="储位" prop="mWmsDeliveryDetailBinid" class="el-col el-col-24">
    <el-select  v-model="detailForm.mWmsDeliveryDetailBinid"  style="width:100%" filterable placeholder="请选择储位">
      <el-option v-for="(option,i) in mWmsDeliveryDetailBinidList" :key="i" :label="option.mWmsWarehouseBinCode" :value="option.mWmsMaterialbinBinid"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDetail">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
      rules: {
        mWmsDeliveryDetailMarerialid: [{ required: true, message: '请选择料号' }]
      },
      materialColumns: [{
        key: 'materialNo',
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      }
    }
  },
  computed: {
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
