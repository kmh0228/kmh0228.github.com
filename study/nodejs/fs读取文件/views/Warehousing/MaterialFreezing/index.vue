<template>
  <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="stockFrozenOrThaw(1)">冻结</el-button>
        <el-button type="primary" plain size="mini" @click="stockFrozenOrThaw(2)">解除冻结</el-button>
    </div>
    <el-form :model="infoForm" ref="infoForm" label-position="top" style="padding-bottom:0;" class="el-row mes-form-rule">
      <el-form-item class="el-row el-col el-col-11">
        <div slot="label">
          <el-radio v-model="type" :label="1">按料号冻结</el-radio>
        </div>
        <el-row>
          <el-col :span="3">料号</el-col>
          <el-col :span="21">
            <el-input v-model="infoForm.materialNo" placeholder="请输入料号" :disabled="type!==1"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="el-row el-col el-col-11 el-col-offset-1">
        <div slot="label">
          <el-radio v-model="type" :label="2">按储位冻结</el-radio>
        </div>
        <el-row :gutter="10">
          <el-col :span="3">仓库</el-col>
          <el-col :span="9">
            <mes-select v-model="infoForm.mWmsWarehouseWarehouseid" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" placeholder="请选择仓库" @change="warehouseChange" :disabled="type!==2"></mes-select>
          </el-col>
          <el-col :span="3">储位</el-col>
          <el-col :span="9">
            <mes-select v-model="infoForm.mWmsWarehouseBinId" ref="binSelect" isLinkage :params="warehouseBinParams" method="getBin" labelKey="mWmsWarehouseBinCode" valueKey="mWmsWarehouseBinId" placeholder="请选择储位" :disabled="type!==2"></mes-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="el-row el-col el-col-11">
        <div slot="label">
          <el-radio v-model="type" :label="3">按批次号冻结</el-radio>
        </div>
        <el-row>
          <el-col :span="3">批次号</el-col>
          <el-col :span="21">
            <el-input v-model="infoForm.mWmsPkgIdLot" placeholder="请输入批次号" :disabled="type!==3"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-tabs style="padding:0 15px;">
      <el-tab-pane label="查询记录">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button con="el-icon-search" icon="el-icon-search" @click="getStockRecord">查询</el-button>
          </el-col>
          <el-col :span="12">
             <mes-page ref="mesPage" :initData="getStockRecord" :total="total" />
          </el-col>
        </el-row>
        <div class="mes-table">
          <el-table :data="tableData" border @selection-change="tableSelectChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="pkgId" sortable label="批次号" align="center"></el-table-column>
            <el-table-column prop="materialNo" sortable label="料号" align="center"></el-table-column>
            <el-table-column prop="qty" sortable label="数量" align="center"></el-table-column>
            <el-table-column prop="warehouseName" sortable label="仓库" align="center"></el-table-column>
            <el-table-column prop="warehouseBinCode" sortable label="储位" align="center"></el-table-column>
            <el-table-column prop="status" sortable label="状态" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status==='0'?'':'danger'">{{ scope.row.status==='0'?'未冻结':'冻结' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creator" sortable label="作业人" align="center"></el-table-column>
            <el-table-column prop="createDt" sortable label="作业时间" align="center"></el-table-column>
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
      const handleName = type === 1 ? '冻结' : '解除冻结'
      if (selectList.length > 0) {
        const confirmRes = await this.$myPrompt.confirm(`确定将选中的物料${handleName}吗?`)
        if (confirmRes) {
          const params = { type, id: selectList }
          const res = await this.$api.stockFrozenOrThaw(params)
          this.$myPrompt.handleMsg(res, () => {
            this.getStockRecord()
          })
        }
      } else {
        this.$message.warning(`请先选择需要${handleName}的物料！`)
      }
    }
  }
}
</script>
