<template>
  <el-table :data="materialsList" border size="mini">
    <el-table-column type="index" :label="$t('common_Number')"  :index="indexMethod" align="center"></el-table-column>
    <el-table-column :label="$t('common_PorN')">
      <template slot-scope="scope">
        <span v-if="useType===0">{{ scope.row.materialNo }}:{{ scope.row.version }}</span>
        <dialogTableSelect v-else v-model="scope.row.mComMaterialId" :contentValue="getMaterialNoVersion(scope.row.materialNo,scope.row.version)" selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']"  :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="isKeypart" :label="$t('WorkOrder_keyMaterial')" width="150">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.isKeypart" :disabled="useType===0" :true-label="1" :false-label="0"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column prop="requestQty" :label="$t('common_DemanQuan')" width="150">
      <template slot-scope="scope">
        <span v-if="useType===0">{{ scope.row.requestQty }}</span>
        <el-input v-else v-model.trim="scope.row.requestQty" size="mini">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column prop="usedQty" :label="$t('WorkOrder_QuantityUsed')" width="150">
      <template slot-scope="scope">
        <span v-if="useType===0">{{ scope.row.usedQty }}</span>
        <el-input v-else v-model.trim="scope.row.usedQty" disabled size="mini"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="baseQty" :label="$t('WorkOrder_BasicDosage')" width="150">
      <template slot-scope="scope">
        <span v-if="useType===0">{{ scope.row.baseQty }}</span>
        <el-input v-else v-model.trim="scope.row.baseQty" size="mini">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column prop="mComUomId" :label="$t('WorkOrder_UnitCons')">
      <template slot-scope="scope">
        <span v-if="useType===0">{{ scope.row.mComUomId }}</span>
        <el-select v-else v-model="scope.row.mComUomId" style="width:100%;" size="mini">
          <el-option v-for="(option,i) in uomList" :key="i" :label="option.UOM_CODE" :value="option.M_COM_UOM_ID">
            <span style="float: left">{{ option.UOM_CODE }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ option.UOM_NAME}}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="altGroup" :label="$t('WorkOrder_SubstGrou')">
      <template slot-scope="scope">
        <span v-if="useType===0">{{ scope.row.altGroup }}</span>
        <el-input v-else v-model.trim="scope.row.altGroup" size="mini">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column :label="$t('common_Operate')" v-if="useType!==0" width="80" align="center">
      <template slot-scope="scope">
        <el-button type="danger" icon="el-icon-delete" @click="delCurrentRow(scope.$index)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      materialList: [],
      uomList: [],
      materialColumns: [{
        key: 'materialNo',
        label: 'common_PorN'
      }, {
        key: 'materialName',
        label: 'common_MaterialName'
      }, {
        key: 'version',
        label: 'common_Edition'
      }, {
        key: 'mComMaterialtypeCode',
        label: 'common_MaterialType'
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      }
    }
  },
  computed: {
    materialsList () {
      return this.materialsObj.materials
    }
  },
  props: {
    useType: {
      type: Number
    },
    materialsObj: {
      type: Object
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    delCurrentRow (index) {
      this.materialsList.splice(index, 1)
    },
    // 获取计量单位
    async getUom () {
      let res = await this.$api.getUom()
      this.uomList = res.data
    },
    getMaterialNoVersion (num, v) {
      let materialNo = num || ''
      let vsersion = v ? ':' + v : ''
      return `${materialNo}${vsersion}`
    },
    // 保存物料清单
    async saveWorkOrder () {
      let { jobOrderId } = this.materialsObj
      if (!jobOrderId) {
        return this.$message.warning(this.$t('WorkOrder_saveBasiInfoOrdeFirs'))
      }
      let len = this.materialsList.length
      if (len > 0) {
        let res = await this.$api.createJobMaterials(this.materialsObj)
        if (res.code === '200') {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning(this.$t('WorkOrder_addBOMFirs'))
      }
    },
    refresWorkOrder () {
    }
  },
  created () {
    if (this.useType !== 0) {
      this.getUom()
    }
  },
  components: {
    dialogTableSelect
  }
}
</script>
