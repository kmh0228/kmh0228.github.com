<template>
<el-form :model="detailForm" ref="detailForm" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule">

  <el-form-item :label="$t('common_PorN')" prop="mcomMaterialId" class="el-col el-col-24">
    <!-- <el-input size="mini" v-model="detailForm.mcomMaterialId"></el-input> -->
    <!-- <el-select style="width:100%;" size="mini" clearable filterable  :placeholder="$t('delivery_selecItemNumbForMain')" v-model="detailForm.mcomMaterialId" >
      <el-option v-for="(option,i) in materialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId" ></el-option>
    </el-select> -->
    <materialSelect  v-model="detailForm.mcomMaterialId" :contentValue="materialNoVersion" ></materialSelect>
  </el-form-item>
   <el-form-item :label="$t('delivery_TargeQuan')" prop="requestQty" class="el-col el-col-24">
    <el-input size="mini"  v-model="detailForm.requestQty"></el-input>
  </el-form-item>
   <el-form-item :label="$t('common_QuantComp')" prop="shippedQty" class="el-col el-col-24">
    <el-input size="mini" :disabled="true"  v-model="detailForm.shippedQty"></el-input>
  </el-form-item>
   <el-form-item :label="$t('delivery_ComplStat')" prop="isCompleted" class="el-col el-col-24">
    <el-checkbox :disabled="true" v-model="detailForm.isCompleted"></el-checkbox>
  </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDetailForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'

export default {
  data () {
    return {
      detailForm: {
        materialCode: '',
        version: '',
        mcomMaterialId: '',
        requestQty: '',
        shippedQty: '',
        isCompleted: ''
      },
      materialList: []
    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.detailForm.materialCode ? this.detaliForm.materialCode + ':' : ''
      const version = this.detailForm.version ? this.detaliForm.version : ''
      return `${materialNo}${version}`
    },
    rules () {
      return {
        mcomMaterialId: [{ required: true, message: this.$t('common_ItemNoCannBeEm') }]
      }
    }
  },
  props: {
    cannel: {
      type: Function
    },
    isEdit: {
      type: Function
    },
    getShipOrderDetail: {
      type: Function
    },
    onTPomShipOrderId: {
      type: String
    }
  },
  methods: {
    // 获取所有料号列表
    async getMaterialList () {
      let data = {
        materialNo: '',
        materialType: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getMaterialMasters(data)
      this.materialList = res.data.list
    },
    saveDetailForm () {
      this.$refs.detailForm.validate(async valid => {
        if (valid) {
          let { onTPomShipOrderId, detailForm } = this
          let tpomShipOrderId = onTPomShipOrderId
          let data = Object.assign({ tpomShipOrderId }, detailForm)
          let res = this.isEdit ? await this.$api.updateShipOrderDetail(data) : await this.$api.insertShipOrderDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getShipOrderDetail')
          })
        }
      })
    }
  },
  created () {
    this.getMaterialList()
  },
  components: {
    materialSelect
  }

}
</script>
