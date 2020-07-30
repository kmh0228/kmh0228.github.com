<template>
  <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="stockFrozenOrThaw(1)">{{$t('MaterialFreezing_frozen')}}</el-button>
        <el-button type="primary" plain size="mini" @click="stockFrozenOrThaw(2)">{{$t('MaterialFreezing_Unfreeze')}}</el-button>
    </div>
    <el-form :model="infoForm" ref="infoForm" label-position="top" style="padding-bottom:0;" class="el-row mes-form-rule">
      <el-form-item class="el-row el-col el-col-11">
        <div slot="label">
          <el-radio v-model="type" :label="1">{{$t('MaterialFreezing_FreezeByPN')}}</el-radio>
        </div>
        <el-row>
          <el-col :span="3">{{$t('MaterialFreezing_PN')}}</el-col>
          <el-col :span="21">
            <el-input v-model="infoForm.materialNo" :placeholder="$t('MaterialFreezing_PleaseEnterThePN')" :disabled="type!==1"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="el-row el-col el-col-11 el-col-offset-1">
        <div slot="label">
          <el-radio v-model="type" :label="2">{{$t('MaterialFreezing_FreezeByStorage')}}</el-radio>
        </div>
        <el-row :gutter="10">
          <el-col :span="3">{{$t('MaterialFreezing_Warehouse')}}</el-col>
          <el-col :span="9">
            <mes-select v-model="infoForm.mWmsWarehouseWarehouseid" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" :placeholder="$t('MaterialFreezing_PleaseSelectWarehouse')" @change="warehouseChange" :disabled="type!==2"></mes-select>
          </el-col>
          <el-col :span="3">{{$t('MaterialFreezing_StorageLocation')}}</el-col>
          <el-col :span="9">
            <mes-select v-model="infoForm.mWmsWarehouseBinId" ref="binSelect" isLinkage :params="warehouseBinParams" method="getBin" labelKey="mWmsWarehouseBinCode" valueKey="mWmsWarehouseBinId" :placeholder="$t('MaterialFreezing_PleaseSelectStorage')" :disabled="type!==2"></mes-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="el-row el-col el-col-11">
        <div slot="label">
          <el-radio v-model="type" :label="3">{{$t('MaterialFreezing_FreezeByBatchNo')}}</el-radio>
        </div>
        <el-row>
          <el-col :span="3">{{$t('MaterialFreezing_BatchNumber')}}</el-col>
          <el-col :span="21">
            <el-input v-model="infoForm.mWmsPkgIdLot" :placeholder="$t('MaterialFreezing_PleaseEnterBatchNumber')" :disabled="type!==3"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-tabs style="padding:0 15px;">
      <el-tab-pane :label="$t('MaterialFreezing_InquiryRecord')">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button con="el-icon-search" icon="el-icon-search" @click="getStockRecord">{{$t('common_Inquire')}}</el-button>
          </el-col>
          <el-col :span="12">
             <mes-page ref="mesPage" :initData="getStockRecord" :total="total" />
          </el-col>
        </el-row>
        <div class="mes-table">
          <el-table :data="tableData" border @selection-change="tableSelectChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
            <el-table-column prop="pkgId" sortable :label="$t('MaterialFreezing_BatchNumber')" align="center"></el-table-column>
            <el-table-column prop="materialNo" sortable :label="$t('MaterialFreezing_PN')" align="center"></el-table-column>
            <el-table-column prop="qty" sortable :label="$t('MaterialFreezing_Num')" align="center"></el-table-column>
            <el-table-column prop="warehouseName" sortable :label="$t('MaterialFreezing_Warehouse')" align="center"></el-table-column>
            <el-table-column prop="warehouseBinCode" sortable :label="$t('MaterialFreezing_StorageLocation')" align="center"></el-table-column>
            <el-table-column prop="status" sortable :label="$t('common_Status')" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status==='0'?'':'danger'">{{ scope.row.status==='0'? $t('MaterialFreezing_Unfrozen') : $t('MaterialFreezing_frozen') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creator" sortable :label="$t('MaterialFreezing_operator')" align="center"></el-table-column>
            <el-table-column prop="createDt" sortable :label="$t('MaterialFreezing_OperationTime')" align="center"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 1,
      infoForm: {
        materialNo: '',
        mWmsWarehouseWarehouseid: '',
        mWmsWarehouseBinId: '',
        mWmsPkgIdLot: ''
      },
      warehouseBinParams: {
        mWmsWarehouseBinWarehouseid: ''
      },
      total: 0,
      tableData: [],
      selectList: []
    }
  },
  watch: {
    type (val) {
      switch (val) {
        case 1:
          this.infoForm.mWmsWarehouseWarehouseid = ''
          this.infoForm.mWmsWarehouseBinId = ''
          this.infoForm.mWmsPkgIdLot = ''
          break
        case 2:
          this.infoForm.materialNo = ''
          this.infoForm.mWmsPkgIdLot = ''
          break

        case 3:
          this.infoForm.materialNo = ''
          this.infoForm.mWmsWarehouseWarehouseid = ''
          this.infoForm.mWmsWarehouseBinId = ''
          break

        default:
          this.infoForm.materialNo = ''
          this.infoForm.mWmsWarehouseWarehouseid = ''
          this.infoForm.mWmsWarehouseBinId = ''
          this.infoForm.mWmsPkgIdLot = ''
          break
      }
    }
  },
  methods: {
    warehouseChange (val) {
      this.infoForm.mWmsWarehouseBinId = ''
      this.warehouseBinParams.mWmsWarehouseBinWarehouseid = val
      this.$refs.binSelect.getOptions()
    },
    tableSelectChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        const { id, warehouseId } = item
        this.selectList.push({
          id, warehouseId
        })
      })
    },
    async getStockRecord () {
      const { type } = this
      const { page } = this.$refs.mesPage
      let param = ''
      switch (type) {
        case 1:
          param = this.infoForm.materialNo
          break
        case 2:
          param = this.infoForm.mWmsWarehouseBinId
          break

        case 3:
          param = this.infoForm.mWmsPkgIdLot
          break

        default:
          param = ''
          break
      }
      const params = Object.assign({ type, param }, page)
      const res = await this.$api.getStockRecord(params)
      this.$myPrompt.handleMsg(res, data => {
        this.tableData = data.list
        this.total = data.totalNum
      }, false)
    },
    async stockFrozenOrThaw (type) {
      const { selectList } = this
      if (selectList.length > 0) {
        const confirmRes = await this.$myPrompt.confirm(type === 1 ? this.$t('MaterialFreezing_Tips1') : this.$t('MaterialFreezing_Tips2'))
        if (confirmRes) {
          const params = { type, id: selectList }
          const res = await this.$api.stockFrozenOrThaw(params)
          this.$myPrompt.handleMsg(res, () => {
            this.getStockRecord()
          })
        }
      } else {
        this.$message.warning(type === 1 ? this.$t('MaterialFreezing_Tips3') : this.$t('MaterialFreezing_Tips4'))
      }
    }
  }
}
</script>
