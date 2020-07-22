<template>
  <div class="mes-main-tabs">
    <el-tabs >
      <el-tab-pane label="基本信息">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" label-position="left" class="el-row mes-form-rule">
            <el-form-item label="调拨单号" prop="allocatelistNo" class="el-col el-col-12" >
              <el-row>
                <el-col :lg="{span:13}" :xl="{span:13}">
                  <el-input v-model="dialogForm.allocatelistNo" placeholder="请生成调拨单号"></el-input>
                </el-col>
                <el-col :lg="{span:10,offset:1}" :xl="{span:10,offset:1}">
                  <el-button type="primary" plain @click="getJobOrderNo" :disabled="isEdit?true:false" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">按规则生成调拨单号</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="调出仓库" prop="outStock" class="el-col el-col-11 el-col-offset-1">
              <mes-select v-model="dialogForm.outStock" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" placeholder="请选择仓库" @change="outStockChange"></mes-select>
            </el-form-item>
            <el-form-item label="调入仓库" prop="inStock" class="el-col el-col-12">
              <mes-select v-model="dialogForm.inStock" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" placeholder="请选择仓库" @change="inStockChange"></mes-select>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" class="el-col el-col-11 el-col-offset-1">
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
      <el-tab-pane label="调拨单明细">
        <div>
          <el-table :data="isEdit?detailData:addDetailData" border highlight-current-row size="mini">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="mcomMaterialNo" label="料号" align="center" min-width="120">
              <template slot-scope="scope">
                <dialogTableSelect v-model.trim="scope.row.mcomMaterialId" @change="detailCellClick(scope.$index)" :contentValue="getMaterialNoVersion(scope.row.mcomMaterialNo,scope.row.version)" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="mComMaterialId" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @sendMateriaList="sendMateriaList"></dialogTableSelect>
              </template>
            </el-table-column>
            <el-table-column prop="mcomMaterialName" label="料号名称" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input :disabled="true" v-model.trim="scope.row.mcomMaterialName" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="allocateQuantity" label="调拨数量" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.allocateQuantity" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="outQty" label="调出数量" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.outQty" size="mini" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="inQty" label="调入数量" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.inQty" size="mini"  :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" @click="delCurrentRow(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top:15px;">
            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addAllocationList">添加</el-button>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class=" dialog-footer">
      <el-button type="primary" @click="saveAllocationList">保存</el-button>
      <el-button @click="$emit('cannel')">取消</el-button>
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
      addDetailData: [{
        mcomMaterialId: '',
        mcomMaterialName: '',
        allocateQuantity: 0,
        outQty: 0,
        inQty: 0
      }],
      rules: {
        allocatelistNo: [{ required: true, message: '调拨单号不能为空' }],
        outStock: [{ required: true, message: '调出仓库不能为空' }],
        inStock: [{ required: true, message: '调入仓库不能为空' }]
      }
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
      let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的盘点详情信息吗?')
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
