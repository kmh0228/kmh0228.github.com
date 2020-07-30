<template>
  <div class="mes-main-tabs">
    <el-tabs >
      <el-tab-pane :label="$t('common_BasicInformation')">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" label-position="left" class="el-row mes-form-rule">
            <el-form-item :label="$t('Allocation_allocatelistNo')" prop="allocatelistNo" class="el-col el-col-12" >
              <el-row>
                <el-col :lg="{span:13}" :xl="{span:13}">
                  <el-input v-model="dialogForm.allocatelistNo" :placeholder="$t('Allocation_NoRequired')"></el-input>
                </el-col>
                <el-col :lg="{span:10,offset:1}" :xl="{span:10,offset:1}">
                  <el-button type="primary" plain @click="getJobOrderNo" :disabled="isEdit?true:false" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{$t('Allocation_RuleGeneration')}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="$t('Allocation_outStockName')" prop="outStock" class="el-col el-col-11 el-col-offset-1">
              <mes-select v-model="dialogForm.outStock" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" :placeholder="$t('Allocation_SelectWarehouse')" @change="outStockChange"></mes-select>
            </el-form-item>
            <el-form-item :label="$t('Allocation_inStockName')" prop="inStock" class="el-col el-col-12">
              <mes-select v-model="dialogForm.inStock" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" :placeholder="$t('Allocation_SelectWarehouse')" @change="inStockChange"></mes-select>
            </el-form-item>
            <el-form-item :label="$t('common_remarks')" prop="remarks" class="el-col el-col-11 el-col-offset-1">
              <el-input type="textarea" v-model="dialogForm.remarks"></el-input>
            </el-form-item>
            <!-- <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
              <el-button type="primary" @click="saveAllocationList">保存</el-button>
              <el-button @click="$emit('cannel')">取消</el-button>
            </el-form-item> -->
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs >
      <el-tab-pane :label="$t('Allocation_TransferOrderDetails')">
        <div>
          <el-table :data="isEdit?detailData:addDetailData" border highlight-current-row size="mini">
            <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
            <el-table-column prop="mcomMaterialNo" :label="$t('common_PorN')" align="center" min-width="120">
              <template slot-scope="scope">
                <dialogTableSelect v-model.trim="scope.row.mcomMaterialId" @change="detailCellClick(scope.$index)" :contentValue="getMaterialNoVersion(scope.row.mcomMaterialNo,scope.row.version)" selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="mComMaterialId" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @sendMateriaList="sendMateriaList"></dialogTableSelect>
              </template>
            </el-table-column>
            <el-table-column prop="mcomMaterialName" :label="$t('common_PorN_Name')" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input :disabled="true" v-model.trim="scope.row.mcomMaterialName" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="allocateQuantity" :label="$t('Allocation_quantity')" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.allocateQuantity" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="outQty" :label="$t('Allocation_outQuantity')" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.outQty" size="mini" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="inQty" :label="$t('Allocation_inQuantity')" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.inQty" size="mini"  :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common_Operate')" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" @click="delCurrentRow(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top:15px;">
            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addAllocationList">{{$t('common_Add')}}</el-button>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class=" dialog-footer">
      <el-button type="primary" @click="saveAllocationList">{{$t('common_save')}}</el-button>
      <el-button @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </div>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      materialNo: '',
      dialogForm: {
        allocatelistNo: '',
        outStock: '',
        inStock: '',
        remarks: ''
      },
      MateriaList: [],
      materialSearch: {
        materialNo: '',
        materialType: ''
      },
      addDetailData: [{
        mcomMaterialId: '',
        mcomMaterialName: '',
        allocateQuantity: 0,
        outQty: 0,
        inQty: 0
      }]
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getAllocationList: Function,
    getAllocationDetail: Function,
    detailData: Array,
    checkId: String
  },
  computed: {
    rules () {
      return {
        allocatelistNo: [{ required: true, message: this.$t('Allocation_TransferNoRequired') }],
        outStock: [{ required: true, message: this.$t('Allocation_TransferOutWarehouseRequired') }],
        inStock: [{ required: true, message: this.$t('Allocation_TransferInWarehouseRequired') }]
      }
    },
    materialColumns () {
      return [{
        key: 'materialNo',
        label: this.$t('common_PorN')
      }, {
        key: 'materialName',
        label: this.$t('common_MaterialName')
      }, {
        key: 'version',
        label: this.$t('common_Edition')
      }, {
        key: 'mComMaterialtypeCode',
        label: this.$t('common_MaterialType')
      }]
    }
  },
  methods: {
    outStockChange (val) {
      this.dialogForm.outStock = val
    },
    inStockChange (val) {
      this.dialogForm.inStock = val
    },
    async getJobOrderNo () {
      const res = await this.$api.getJobOrderNo('DBD', 1)
      if (res.code === '200') {
        this.dialogForm.allocatelistNo = res.data
      }
    },
    async saveAllocationList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let data = Object.assign(dialogForm)
          isEdit ? await this.editAllocationDetail(data) : await this.addAllocationAndDetail(data)
        }
      })
    },
    async addAllocationAndDetail (data) {
      let params = await this.$api.addAllocation(data)
      const { addDetailData } = this
      const addDetail = Object.assign(addDetailData)
      const res = await this.$api.saveAllocationDetailList({ mwmsAllocateListDetailList: addDetail, mwmsAllocatelistId: params.data })
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannel')
        this.$emit('getAllocationList')
      })
    },
    async editAllocationDetail (data) {
      await this.$api.editAllocation(data)
      const { detailData } = this
      const params = Object.assign(detailData)
      const res = await this.$api.saveAllocationDetailList({ mwmsAllocateListDetailList: params, mwmsAllocatelistId: this.checkId })
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannel')
        this.$emit('getAllocationList')
        this.$emit('getAllocationDetail', this.checkId)
      })
    },
    setMaterialRev (material) {
      this.dialogForm.mcomMaterialName = material.materialName
    },
    getMaterialNoVersion (num, v) {
      let mcomMaterialNo = num || ''
      let vsersion = v ? ':' + v : ''
      return `${mcomMaterialNo}${vsersion}`
    },
    detailCellClick (index) {
      const { detailData, addDetailData, MateriaList, isEdit } = this
      if (isEdit) {
        MateriaList.forEach(e => {
          if (e.mComMaterialId === detailData[index].mcomMaterialId) {
            detailData[index].mcomMaterialName = e.materialName
          }
        })
      } else {
        MateriaList.forEach(e => {
          if (e.mComMaterialId === addDetailData[index].mcomMaterialId) {
            addDetailData[index].mcomMaterialName = e.materialName
          }
        })
      }
    },
    sendMateriaList (data) {
      this.MateriaList = data
    },
    async delCurrentRow (index) {
      let confirmRes = await this.$myPrompt.confirm(this.$t('Allocation_DeletePrompt'))
      if (confirmRes) {
        this.detailData.splice(index, 1)
      }
    },
    addAllocationList () {
      const { isEdit } = this
      if (isEdit) {
        this.detailData.push({
          mcomMaterialId: '',
          allocateQuantity: 0,
          outQty: 0,
          inQty: 0
        })
      } else {
        this.addDetailData.push({
          mcomMaterialId: '',
          mcomMaterialName: '',
          allocateQuantity: 0,
          outQty: 0,
          inQty: 0
        })
      }
    }
  },
  components: {
    materialSelect,
    dialogTableSelect
  }
}
</script>
