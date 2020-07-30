<template>
  <div>
    <el-input v-model="deviceName" size="mini" @focus="showDialog"  :placeholder="placeholder">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="showDialog"></i>
    </el-input>
    <el-dialog :title="$t('common_PleasSele')" class="product-list-dialog" width="1000px" :visible.sync="dialogVisible" append-to-body>
      <el-row style="padding-bottom:1vh;">
        <!-- <el-col :span="7">
          <el-input v-model="searchForm.officeCode" :placeholder="$t('common_Department')"  size="mini" @keydown.enter.native="$refs.tableList.queryList(true)">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
          </el-input>
        </el-col> -->
        <el-col :span="7">
          <el-input  v-model="searchForm.resourceCode"  :placeholder="$t('common_EquipCode')" size="mini" @keydown.enter.native="$refs.tableList.queryList(true)">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
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
      searchForm: {
        officeCode: '',
        resourceCode: ''
      },
      deviceName: '',
      value: '',
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
            title: this.$t('common_EquipCode'),
            prop: 'resourceCode'
          },
          {
            title: this.$t('common_EquipName'),
            prop: 'resourceName'
          },
          {
            title: this.$t('component_LineCode'),
            prop: 'lineCode'
          },
          {
            title: this.$t('common_LineName'),
            prop: 'lineCode'
          }
        ]
      },
      tableData: []
    }
  },
  props: {
    placeholder: {
      type: String,
      default: this.$t('component_selecDevi')
    },
    selectLength: {
      type: Number,
      default: 1
    },
    confirmFun: {
      type: Function
    },
    valueKey: {
      type: String,
      default: this.$t('component_selecDevi')
    },
    labelKey: {
      type: String,
      default: 'resourceName'
    },
    defaultDeviceName: {
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
    defaultDeviceName (val) {
      this.deviceName = this.defaultDeviceName || ''
    },
    defaultValue (val) {
      this.value = val || ''
    },
    officeCode (val) {
      this.$refs.tableList && this.$refs.tableList.queryList(true)
    },
    deviceName (val) {
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    }
    // value (val) {
    //   if (!val) {
    //     this.deviceName = ''
    //   }
    // }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    async initData (page) {
      let { searchForm } = this
      // let data = Object.assign(searchForm, page)
      let res = await this.$api.findResourceList({ ...searchForm, ...page, officeCode: this.officeCode })
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    confirm () {
      let data = this.$refs.tableList.getSelectData()
      if (data.length > this.selectLength) {
        this.$message.warning(`可选${this.selectLength}条，选择为${data.length}条，超过最大选择长度`)
        return false
      }
      this.deviceName = data.map(item => item[this.labelKey]).join(',')
      this.value = data.map(item => item[this.valueKey]).join(',')
      this.confirmFun && this.confirmFun(data)
      // 执行确定方法
      this.dialogVisible = false
    },
    clearSelectData () {
      this.deviceName = ''
      this.value = ''
    }
  },
  created () {
    if (this.defaultDeviceName) {
      this.deviceName = this.defaultDeviceName || ''
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
