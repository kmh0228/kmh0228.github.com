<template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"  label-width="140px" label-position="left" class="el-row mes-form-rule">
  <el-form-item :label="$t('common_StockInNo')" prop="stockInNo" class="el-col el-col-24">
    <el-select v-model="dialogForm.stockInNo " clearable :placeholder="$t('IqcRegister_PleaseSelectTheStockInNo')" style="width:100%" filterable>
      <el-option v-for="(option,i) in entryList" :key="i" :label="option.mWmsEntrylistNo" :value="option.mWmsEntrylistNo"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="dispatchData">{{$t('IqcRegister_Create')}}</el-button>
    <el-button size="mini" @click="$emit('cannelEnDialog')">{{$t('common_cancel')}}</el-button>
  </el-form-item>
</el-form>

</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        stockInNo: ''
      },
      entryList: ''
    }
  },
  computed: {
    rules () {
      return {
        stockInNo: [{ required: true, message: this.$t('IqcRegister_StockInNo') }]
      }
    }
  },
  props: {
    getdata: {
      type: Function
    },
    cannelEnDialog: {
      type: Function
    }
  },
  methods: {
    async dispatchData () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let mWmsEntrylistNo = this.dialogForm.stockInNo
          let res = await this.$api.insertByWms({ mWmsEntrylistNo })
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannelEnDialog')
            this.$emit('getdata')
          })
        }
      })
    },
    async  getInboundOrder () {
      let data = {
        mWmsEntrylistNo: '',
        mWmsEntrylistStatus: '',
        startTime: '',
        endTime: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getInboundOrder(data)
      this.entryList = res.data.list
    }
  },
  created () {
    this.getInboundOrder()
  }
}
</script>
