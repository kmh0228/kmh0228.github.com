<template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule" size="mini">
  <el-form-item label="入库单号" prop="stockInNo" class="el-col el-col-11">
   <!-- <el-select v-model="dialogForm.stockInNo " clearable placeholder="请选择产品系列" style="width:100%" filterable  @blur="sss"  @change="getByStockInNo">
      <el-option v-for="(option,i) in entryList" :key="i" :label="option.mWmsEntrylistNo" :value="option.mWmsEntrylistId"></el-option>
    </el-select> -->
    <el-autocomplete :disabled="editDisabled" v-model="dialogForm.stockInNo" :fetch-suggestions="backSuggestion" value-key="mWmsEntrylistNo"  style="width:100%"  placeholder="请先选择入库单号" @select="handleSelect">  </el-autocomplete>
  </el-form-item>
  <el-form-item label="料号" prop="mComMaterialId"  class="el-col el-col-11 el-col-offset-1">
    <el-select v-if="noEntrylist" v-model="dialogForm.mComMaterialId" style="width:100%" clearable  :disabled="editDisabled">
      <el-option  v-for="(option,i) in materialList" :key="i" :label="option.materialNo" :value="option.mWmsEntrylistDetailMarerialid"></el-option>
    </el-select>
    <dialogTableSelect style="width:100%" :isDisabled="true" v-else ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion"  v-model="dialogForm.mComMaterialId" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @change="getMaterialIdById"></dialogTableSelect>
  </el-form-item>
  <el-form-item label="供应商名称"  class="el-col el-col-11">
      <el-input :disabled="noDisabled"  v-model="dialogForm.vendorName"></el-input>
  </el-form-item>
  <el-form-item label="供应商代码"  class="el-col el-col-11 el-col-offset-1">
    <el-input :disabled="noDisabled" v-model="dialogForm.vendorCode"></el-input>
  </el-form-item>
  <el-form-item label="采购单号"  class="el-col el-col-11">
      <el-input :disabled="noDisabled" v-model="dialogForm.poNo" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="收货日期" prop="incomingDate"  class="el-col el-col-11 el-col-offset-1" >
     <el-date-picker  v-model="dialogForm.incomingDate"  type="date" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
  </el-form-item>
  <el-form-item label="数量"  class="el-col el-col-11">
    <el-input :disabled="numIputDisabled" v-model.number="dialogForm.qty" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="数量单位"   class="el-col el-col-11 el-col-offset-1">
      <el-input :disabled="numIputDisabled" v-model="dialogForm.qtyUom" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="仓码"  class="el-col el-col-11">
      <el-input :disabled="materialDisabled" v-model="dialogForm.warehouseNo" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="品名"   class="el-col el-col-11 el-col-offset-1">
      <el-input :disabled="materialDisabled" v-model="dialogForm.productName" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="物料类别"  class="el-col el-col-11">
      <el-input :disabled="materialDisabled" v-model="dialogForm.mComMaterialtypeCode" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="检规编号"  class="el-col el-col-11 el-col-offset-1">
      <el-input :disabled="materialDisabled" v-model="dialogForm.sipNo" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="检验日期" prop="inspectDate"   class="el-col el-col-11">
     <el-date-picker  v-model="dialogForm.inspectDate"  type="date" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
  </el-form-item>
  <el-form-item label="检规版次" prop="sipVer"   class="el-col el-col-11 el-col-offset-1" >
     <el-input :disabled="materialDisabled" v-model="dialogForm.sipVer" size="mini"></el-input>
  </el-form-item>
  <el-form-item label-width="0"  class="el-col el-col-24 dialog-footer">
      <el-button type="warning" size="mini" @click="saveForm('check')">保存并生成检验单</el-button>
      <el-button type="primary" size="mini" @click="saveForm('')">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      dialogForm: {
        mComMaterialNo: '',
        mComMaterialVersion: '',
        version: '',
        grNo: '',
        stockInNo: '',
        vendorName: '',
        vendorCode: '',
        qty: '',
        qtyUom: '',
        poNo: '',
        incomingDate: '',
        mComMaterialtypeCode: '',
        productName: '',
        warehouseNo: '',
        inspectDate: '',
        sipNo: '',
        sipVer: '',
        mComMaterialId: ''
      },
      engineryList: [],
      auditItemList: [],
      checkFrequencyList: [],
      rulesStatus: true,
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
      },
      noEntrylist: false,
      materialList: [],
      noDisabled: false,
      materialDisabled: false,
      rules: {
        stockInNo: [{ required: true, message: '入库单号不能为空' }],
        mComMaterialId: [{ required: true, message: '料号不能为空' }],
        inspectDate: [{ required: true, message: '检验日期不能为空' }],
        sipVer: [{ required: true, message: '检规版次不能为空' }],
        incomingDate: [{ required: true, message: '收货日期不能为空' }]
      },
      numIputDisabled: false,
      inWms: false

    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.dialogForm.mComMaterialNo ? this.dialogForm.mComMaterialNo + ':' : ''
      const version = this.dialogForm.mComMaterialVersion ? this.dialogForm.mComMaterialVersion : ''
      return `${materialNo}${version}`
    },
    editDisabled () {
      return this.isEdit
    }
  },
  watch: {
    'dialogForm.stockInNo' (val) {
      if (this.noEntrylist) {
        this.getEntrylist()
      }
      if (val) {
        this.getInboundOrder()
        if (this.dialogForm.mComMaterialId) {
          this.getByStockInNo()
        }
      } else {
        this.noDisabled = false
        this.dialogForm.vendorName = ''
        this.dialogForm.vendorCode = ''
      }
    },
    'dialogForm.mComMaterialId' (val) {
      if (val) {
        this.getMaterialIdById()
        this.getSipByMaterialId()
        if (this.dialogForm.stockInNo) {
          this.getByStockInNo()
        }
      } else {
      }
    }
  },
  props: {
    cannel: Function,
    getdata: Function,
    isEdit: Boolean
  },
  methods: {
    setCheckDate () {
      let date = new Date()
      const str = date.toJSON().slice(0, 11) + date.toTimeString().slice(0, 8) + '+08:00'
      this.dialogForm.inspectDate = str
    },
    async  saveForm (saveType) {
      saveType === 'check' ? this.rulesStatus = false : this.rulesStatus = true
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let data = this.dialogForm
          let res
          data.inspectDate = this.$dayjs(data.inspectDate).format('YYYY-MM-DD')
          if (this.isEdit) {
            res = saveType === 'check' ? await this.$api.insetIqcByUpdate(data) : await this.$api.insertIncomingByUpdate(data)
          } else {
            res = saveType === 'check' ? await this.$api.insertBySave(data) : await this.$api.insertIncomingByNew(data)
          }
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getdata')
          })
        }
      })
    },
    // 获取入库单号详情信息
    async  getInboundOrder () {
      let no = this.dialogForm.stockInNo
      let data = {
        startTime: '',
        endTime: '',
        mWmsEntrylistStatus: '',
        mWmsEntrylistNo: no,
        pageSize: 10,
        pageIndex: 1
      }
      let res = await this.$api.getInboundOrder(data)
      if (res.data.list.length > 0) {
        this.noDisabled = true
        this.dialogForm.vendorName = res.data.list[0].mWmsVendorName
        this.dialogForm.vendorCode = res.data.list[0].mWmsVendorCode
      } else {
        this.noDisabled = false
        this.dialogForm.vendorName = this.dialogForm.vendorName || ''
        this.dialogForm.vendorCode = this.dialogForm.vendorName || ''
      }
    },
    handleSelect (item) {
      this.inWms = true
    },
    backSuggestion (queryString, cb) {
      const data = {
        mWmsEntrylistNo: queryString,
        startTime: '',
        endTime: '',
        mWmsEntrylistStatus: '',
        pageSize: 1000,
        pageIndex: 1
      }
      this.inWms = false
      this.$api.getInboundOrder(data).then(res => {
        if (res.code === '200') {
          cb(res.data.list)
          if (res.data.list.length === 0) {
            this.noEntrylist = false
          } else {
            this.noEntrylist = true
            this.dialogForm.mComMaterialId = ''
          }
        } else {
          let arr = []
          this.noEntrylist = false
          cb(arr)
        }
      })
    },
    // 根据入库单号获取料号(入库单存在)
    async getEntrylist () {
      let mWmsEntrylistNo = this.dialogForm.stockInNo
      let res = await this.$api.getEntrylist({ mWmsEntrylistNo })
      this.materialList = res.data
    },
    // 根据料号查询(入库单不存在)
    async getMaterialIdById () {
      let mComMaterialId = this.dialogForm.mComMaterialId
      let res = await this.$api.getMaterialIdById({ mComMaterialId })
      if (res.data) {
        // if (res.data.minQty > 0) {
        //   this.dialogForm.qty = res.data.minQty
        //   this.numDisabled = true
        // } else {
        //   this.dialogForm.qty = ''
        //   this.numDisabled = false
        // }
        this.dialogForm.qtyUom = res.data.mUomPackId
      }
    },
    // 根据料号和入库单号查询数量
    async getByStockInNo () {
      let { stockInNo, mComMaterialId } = this.dialogForm
      let res = await this.$api.getByStockInNo({ stockInNo, mComMaterialId })
      if (res.code === '200') {
        this.dialogForm.qty = res.data.inboundOrderDetailVmList[0].mWmsEntrylistDetailQty
        this.numIputDisabled = true
      } else {
        this.dialogForm.qty = this.dialogForm.qty || ''
        this.numIputDisabled = false
      }
    },
    // 根据料号查询信息
    async getSipByMaterialId () {
      let mComMaterialId = this.dialogForm.mComMaterialId
      let res = await this.$api.getSipByMaterialId({ mComMaterialId })
      if (res.data) {
        this.materialDisabled = true
        this.dialogForm.mComMaterialtypeCode = res.data.mComMaterialtypeCode
        this.dialogForm.productName = res.data.productName
        this.dialogForm.sipNo = res.data.sipNo
        this.dialogForm.sipVer = res.data.sipVer
      } else {
        this.materialDisabled = false
        this.dialogForm.qty = ''
        this.dialogForm.qtyUom = ''
        this.dialogForm.mComMaterialtypeCode = ''
        this.dialogForm.productName = ''
        this.dialogForm.sipNo = ''
        this.dialogForm.sipVer = ''
      }
    }

  },
  created () {
    this.setCheckDate()
  },
  components: {
    dialogTableSelect
  }

}
</script>

// <style lang="scss">
// .flex-container {
//   display: flex;
//   flex-wrap: wrap;
//   width: 100%;
//   padding: 0;
//   .el-form-item {
//     width: 48%;
//     margin-right: 1.2%;
//   }
//   .dialog-footer {
//     justify-content: center;
//     width: 100%;
//   }
// }
//
</style>
