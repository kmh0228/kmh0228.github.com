<template>
  <div class="mes-table">
    <el-table border :data="controlData">
      <el-table-column type="index" :label="$t('common_Number')" width="50" align="center">
        <template slot-scope="prop">
          <p>{{ prop.$index + 1 }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="mWmsWarehouseId" :label="$t('material_wareHouse')" width="150px"   align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.warehouseName}}</div>
            <el-select v-else  v-model="scope.row.mWmsWarehouseId" filterable clearable style="width:100%" @change="warehouseChange(scope.row)">
              <el-option :key="i" :label="item.mWmsWarehouseName" :value="item.mWmsWarehouseId" v-for="(item, i) in warehouseTypeList"></el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="defaultAreaId" :label="$t('material_defaultStor')"  width="150px"  align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.areaCode}}</div>
            <el-select v-else  v-model="scope.row.defaultAreaId" filterable clearable style="width:100%"  @change="areaChange(scope.row)">
              <el-option :key="i" :label="item.mWmsWarehouseAreaName" :value="item.mWmsWarehouseAreaId" v-for="(item, i) in scope.row.areaList"></el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="defaultBinId" :label="默认上架储位"  width="150px" align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.binCode}}</div>
            <el-select v-else  v-model="scope.row.defaultBinId" filterable clearable style="width:100%"  >
              <el-option :key="i" :label="item.mWmsWarehouseBinCode" :value="item.mWmsWarehouseBinId" v-for="(item, i) in scope.row.binList"></el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="assignRuleId" :label="$t('material_distriRule')" width="150px"  align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.assignRuleCode}}</div>
            <el-select v-else  v-model="scope.row.assignRuleId" filterable clearable style="width:100%">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="turnoverRuleId" :label="$t('material_turnoverRule')" width="150px" align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.turnoverRuleCode}}</div>
            <el-select v-else  v-model="scope.row.turnoverRuleId" filterable clearable style="width:100%">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="onShelvesRuleId" :label="$t('material_shelfRule')" width="150px"  align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.onShelvesRuleCode}}</div>
            <el-select v-else  v-model="scope.row.onShelvesRuleId" filterable clearable style="width:100%">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="inUpLimitMultiple" :label="$t('material_upperLimitCol')" width="150px"  align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.inUpLimitMultiple}}</div>
            <el-input v-else size="mini" v-model="scope.row.inUpLimitMultiple"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="outUpLimitMultiple" :label="$t('material_upeerLimitIss')" width="150px" align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.outUpLimitMultiple}}</div>
            <el-input v-else size="mini" v-model="scope.row.outUpLimitMultiple"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="minStockQty" :label="$t('material_minStock')" width="150px"  align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.minStockQty}}</div>
            <el-input v-else size="mini" v-model="scope.row.minStockQty"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="maxStockQty" :label="$t('material_maxStock')" width="150px"  align="center">
        <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.maxStockQty}}</div>
            <el-input v-else size="mini" v-model="scope.row.maxStockQty"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common_Operate')" width="60" fixed="right" align="center" v-if="useType!==0">
        <template slot-scope="scope">
          <el-button type="text" size="mini" style="color:#F56C6C;font-size:0.8vw;" icon="el-icon-delete" @click="deleteRows(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      warehouseTypeList: [],
      areaList: [],
      binList: [],
      flagNum: 0
    }
  },
  props: {
    useType: Number,
    controlData: Array,
    mComMaterialId: String
  },
  watch: {
    controlData (n) {
      this.flagNum++
    },
    flagNum (n) {
      if (n === 3) {
        // 数据都存在设置表格中储位和库区下拉
        this.controlData.forEach(row => {
          row.areaList = this.areaList.filter(item => item.mWmsWarehouseId === row.mWmsWarehouseId)
          row.binList = this.binList.filter(item => row.defaultAreaId === item.mWmsWarehouseBinAreaid)
        })
      }
    }
  },
  computed: {
    isRead () {
      return this.useType === 0
    }
  },
  methods: {
    warehouseChange (row) {
      row.defaultAreaId = ''
      row.defaultBinId = ''
      row.areaList = this.areaList.filter(item => row.mWmsWarehouseId === item.mWmsWarehouseId)
    },
    areaChange (row) {
      row.defaultBinId = ''
      row.binList = this.binList.filter(item => row.defaultAreaId === item.mWmsWarehouseBinAreaid)
    },
    // 获取仓库列表
    async getWarehouses () {
      let res = await this.$api.getWarehouses({ keywords: '', pageSize: 10000, pageIndex: 1 })
      // 过滤掉未启用仓库
      this.warehouseTypeList = res.data.list ? res.data.list.filter(item => item.invalid) : []
    },
    // 获取库区列表
    async getArea () {
      let res = await this.$api.getArea({ pageSize: 10000, pageIndex: 1 })
      this.areaList = res.data.list || []
      this.flagNum++
    },
    // 获取储位列表
    async getBin () {
      const res = await this.$api.getBin({ pageSize: 10000, pageIndex: 1 })
      this.binList = res.data.list || []
      this.flagNum++
    },
    deleteRows (index) {
      this.controlData.splice(index, 1)
    },
    checkData (controlData = []) {
      let flag = true
      let obj = controlData.find(item => !item.mWmsWarehouseId)
      if (obj) {
        this.$message.error(this.$t('material_wareRequire'))
        return false
      }
      if (controlData.length !== new Set(controlData.map(item => item.mWmsWarehouseId)).size) {
        this.$message.error(this.$t('material_wareNotDup'))
        return false
      }
      let reg = /^\d+$/
      controlData.forEach(item => {
        if (!reg.test(item.inUpLimitMultiple || 0) || !reg.test(item.outUpLimitMultiple || 0) || !reg.test(item.minStockQty || 0) || !reg.test(item.maxStockQty || 0)) {
          flag = false
        }
      })
      if (!flag) {
        this.$message.error(this.$t('material_beInt'))
        return false
      }
      return true
    },
    async saveMaterial () {
      if (this.mComMaterialId) {
        if (!this.checkData(this.controlData)) return false
        let res = await this.$api.saveIoControl(this.controlData)
        let { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning(this.$t('material_pleaseSaveInfo'))
      }
    }
  },
  created () {
    if (this.useType !== 0) {
      this.getWarehouses()
      this.getArea()
      this.getBin()
    }
  }
}
</script>
