<template>
<el-form :model="detaliForm" :rules="rules" ref="detaliForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item  label="料号" prop="mWmsEntrylistDetailMarerialid" class="el-col el-col-24">
     <!-- <el-select v-model="detaliForm.mWmsEntrylistDetailMarerialid" size="mini" style="width:100%"  filterable placeholder="请选择料号">
       <el-option v-for="(option,i) in mWmsEntrylistDetailMareralType" :key="i" :label="option.materialNo" :value="option.mComMaterialId"></el-option>
     </el-select> -->
    <dialogTableSelect style="width:100%" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  v-model="detaliForm.mWmsEntrylistDetailMarerialid" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
  </el-form-item>
   <el-form-item  label="入库数量" prop="mWmsEntrylistDetailQty" class="el-col el-col-24">
     <el-input v-model="detaliForm.mWmsEntrylistDetailQty" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="储位" prop="mWmsEntrylistDetailBinid" class="el-col el-col-24">
    <el-select v-model="detaliForm.mWmsEntrylistDetailBinid" size="mini" style="width:100%" filterable placeholder="请选择储位" >
       <el-option v-for="(option,i) in mWmsEntrylistDetailBinType" :key="i" :label="option.mWmsWarehouseBinCode" :value="option.mWmsMaterialbinBinid"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer" style="width:100%">
      <el-button type="primary" size="mini" @click="saveEntryDetailList">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
      rules: {
        mWmsEntrylistDetailMarerialid: [{ required: true, message: '请选择料号' }],
        mWmsEntrylistDetailQty: [{ required: true, message: '请输入出库数量' }],
        mWmsEntrylistDetailBinid: [{ required: true, message: '请选择储位' }]
      },
      page: {
        pageSize: 1000,
        pageIndex: 1
      },
      serachData: {
        materialNo: '',
        materialType: ''
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
      const materialNo = this.detaliForm.materialNo ? this.detaliForm.materialNo + ':' : ''
      const version = this.detaliForm.version ? this.detaliForm.version : ''
      return `${materialNo}${version}`
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
