<template>
<div class="mes-main mes-work-order">
  <div class="mes-main-title">{{$t('cargoAreaMana_CargoAreaMana')}}</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-select  v-model="mWmsWarehouseId" filterable clearable style="width:40%">
        <el-option :label="item.mWmsWarehouseName" :value="item.mWmsWarehouseId" :key="i" v-for="(item,i) in warehousesList"></el-option>
      </el-select>
    </el-col>
  </el-row>
  <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getArea" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="addData()">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteArea($refs.tableList.getSelectData().map(item => item.mWmsWarehouseAreaId))">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage(true)">{{$t('common_Refresh')}}</el-button>
        </div>
      </table-list>
    </div>
  <el-dialog
      :title="areaForm.mWmsWarehouseAreaId ? $t('cargoAreaMana_EditAreaInfo') : $t('cargoAreaMana_NewRegiInfo') "
      :visible.sync="dialogVisible"
      width="600px"
      class="handle-dialog" >
    <area-dialog :warehousesList="warehousesList" :getArea="refreshPage"  @cannel="cannel" ref="dialog" :areaForm="areaForm"></area-dialog>
  </el-dialog>
</div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import areaDialog from './areaDialog'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      total: 0,
      tableData: [],
      option: tableOption(this),
      mWmsWarehouseId: '',
      dialogVisible: false,
      areaForm: {
        mWmsWarehouseId: '',
        mWmsWarehouseAreaId: '',
        mWmsWarehouseAreaCode: '',
        mWmsWarehouseAreaName: '',
        mWmsWarehouseAreaFunction: '',
        mWmsWarehouseAreaCondition: '',
        mWmsWarehouseAreaValue: '',
        mWmsWarehouseAreaUse: ''
      },
      warehousesList: []
    }
  },
  computed: {

  },
  watch: {
    mWmsWarehouseId (n) {
      this.$refs.tableList.queryList(true)
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage (flag = true) {
      this.mWmsWarehouseId = flag ? '' : this.mWmsWarehouseId
      this.$refs.tableList.queryList(true)
    },
    addData () {
      this.$global.resetForm(this.areaForm)
      this.$refs.dialog && this.$refs.dialog.resetFields()
      this.dialogVisible = true
    },
    // 获取仓库信息
    async getWarehouses () {
      let res = await this.$api.getWarehouses({ pageSize: 1000, pageIndex: 1 })
      if (res.code === '200') {
        this.warehousesList = res.data.list
      } else {
        this.warehousesList = []
      }
    },
    // 根据仓库获取区域信息
    async getArea (page) {
      let res = await this.$api.getArea({ mWmsWarehouseId: this.mWmsWarehouseId, ...page })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 删除区域信息
    async deleteArea (ids) {
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('cargoAreaMana_AreYouSureDeleC'))
        if (confirmRes) {
          let res = await this.$api.deleteArea(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$refs.tableList.queryList()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('cargoAreaMana_PleasSeleAreaIn'))
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    areaDialog, TableList
  },
  created () {
    this.getWarehouses()
  }
}
</script>
