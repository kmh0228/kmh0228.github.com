<template>
  <div>
    <el-input v-model="productSeries" size="mini" @focus="showDialog"  :placeholder="$t('common_PleasSeleProdSe')">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="showDialog"></i>
    </el-input>
    <el-dialog :title="$t('common_PleasSele')" class="product-list-dialog" width="1000px" :visible.sync="dialogVisible" append-to-body>
      <el-row style="padding-bottom:1vh;">
        <el-col :span="7">
          <el-input v-model="selectForm.mComMaterialfamilyCode" :placeholder="$t('common_ProduSeries')"  size="mini" @keydown.enter.native="initData">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i>
          </el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-input v-model="selectForm.materialNo" :placeholder="$t('common_ProduPartNumb')" size="mini" @keydown.enter.native="initData">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i>
          </el-input>
        </el-col>
      </el-row>
      <div style="padding:1vh 0; overflow: hidden;border-top:1px solid #d4d4d4;">
        <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="initData" :total="total">
          <div slot="buttonBox">
            <div class="mes-btn-group" style="float:left;">
          <el-button size="mini" type="primary" @click="confirm">{{$t('common_ok')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="dialogVisible = false">{{$t('common_cancel')}}</el-button>
        </div>
          </div>
        </table-list>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TableList from '@/components/Module/TableList'
export default {
  components: { TableList },
  data () {
    return {
      dialogVisible: false,
      selectForm: {
        mComMaterialfamilyCode: '',
        materialNo: ''
      },
      productSeries: '',
      total: 0,
      option: {
        style: {
          width: '100%'
        },
        tableTitle: [
          {
            title: this.$t('common_Factory'),
            prop: 'factoryName'
          },
          {
            title: this.$t('common_Department'),
            prop: 'officeName'
          },
          {
            title: this.$t('common_ProduSeries'),
            prop: 'mComMaterialfamilyName'
          },
          {
            title: this.$t('common_ProduPartNumb'),
            prop: 'materialNo'
          }
        ]
      },
      tableData: []

    }
  },
  props: {
    selectLength: {
      type: Number,
      default: 1
    },
    confirmFun: {
      type: Function
    },
    valueKey: {
      type: String,
      default: 'mComMaterialfamilyCode'
    },
    defaultProductSeries: {
      type: String
    },
    defaultValue: {
      type: String
    },
    officeCode: {
      type: String,
      default: ''
    }
  },
  watch: {
    defaultProductSeries (val) {
      this.productSeries = this.defaultProductSeries || ''
    },
    defaultValue (val) {
      this.value = val || ''
    },
    officeCode (val) {
      this.$refs.tableList && this.$refs.tableList.queryList(true)
    },
    productSeries (val) {
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    }
    // value (val) {
    //   if (!val) {
    //     this.productSeries = ''
    //   }
    // }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    async initData (page) {
      let res = await this.$api.getProductSeriesList({ ...page, ...this.selectForm, officeCode: this.officeCode })
      if (res.code === '200') {
        this.tableData = res.data && res.data.list
        this.total = res.data.totalNum
      }
    },
    confirm () {
      let data = this.$refs.tableList.getSelectData()
      if (data.length > this.selectLength) {
        this.$message.warning(this.$t('component_Optio') + this.selectLength + this.component_SelecAs + data.length + this.$t('component_BarExceMaxiSeleLeng'))
        return false
      }
      this.productSeries = data.map(item => item.mComMaterialfamilyName).join(',')
      this.value = data.map(item => item[this.valueKey]).join(',')
      this.confirmFun && this.confirmFun(data)
      // 执行确定方法
      this.dialogVisible = false
    },
    clearSelectData () {
      this.productSeries = ''
      this.value = ''
    }
  },
  created () {
    if (this.defaultProductSeries) {
      this.productSeries = this.defaultProductSeries || ''
    }
    if (this.defaultValue) {
      this.value = this.defaultValue || ''
    }
  }
}
</script>
<style lang="scss">
.product-list-dialog {
  .el-icon-circle-close {
    display: none;
  }
}
</style>
