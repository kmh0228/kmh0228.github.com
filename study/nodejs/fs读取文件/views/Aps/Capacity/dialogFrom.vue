<template>
  <el-form :model="dialogFrom" ref="dialogFrom" label-position="left"  label-width="130px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item label-width="220px" :label="$t('capacity_One') + ' . ' + $t('common_essenInfo')" class="el-col el-col-24"></el-form-item>
    <el-form-item :label="$t('common_PorN') + ':'" prop="mComMaterialId" class="el-col el-col-11">
      <!-- <material-select v-model="dialogFrom.mComMaterialId"></material-select> -->
      <el-input v-model="materialNoVersion" v-if="isEdit" :disabled="isEdit"></el-input>
      <dialogTableSelect v-else ref="dialogTableSelect" v-model="dialogFrom.mComMaterialId" :contentValue="materialNoVersion" selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>

    </el-form-item>
    <el-form-item label-width="220px" :label="$t('capacity_Two') + ' . ' + $t('capacity_ResouCapa')" class="el-col el-col-24"></el-form-item>
    <el-form-item  prop="mPsmResourceGroupId"   :label="$t('capacity_ResouGrou')" class="el-col el-col-11">
      <el-select :disabled="isEdit" v-model="dialogFrom.mPsmResourceGroupId" style="width:100%"  @change="getResource">
        <el-option v-for="(option,i) in resourceGroupList" :key="i" :label="option.resourceGroupCode" :value="option.mPsmResourceGroupId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('capacity_AllResoHaveSameCapa')"  class="el-col el-col-23">
      <el-checkbox v-model="isIdentical"></el-checkbox>
    </el-form-item>
    <div v-if="isIdentical">
      <el-form-item :label="$t('capacity_capac')" class="el-col el-col-11">
        <el-input v-model="capacity" style="width:50%"></el-input>
        <el-select v-model="capacityType"  style="width:40%;float:right">
          <el-option v-for="(option,i) in capacityTypeList" :key="i" :label="option" :value="option"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('capacity_CapacUnit')" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="capacityUom" style="width:100%">
           <el-option v-for="(option,i) in capacityUnit" :key="i"  :label="option" :value="option"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('capacity_LeadTime')" class="el-col el-col-11">
        <el-input v-model="leadTime"></el-input>
      </el-form-item>
      <el-form-item :label="$t('capacity_LeadTimeUnit')" class="el-col el-col-11 el-col-offset-1">
        <el-select  v-model="leadTimeUom" style="width:100%">
           <el-option v-for="(option,i) in beforeTimeUnit" :key="i" :label="option" :value="option"></el-option>
        </el-select>
      </el-form-item>
      </div>
      <el-table :data="recourceTable"  size="mini" border  class="el-col el-col-23">
        <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
        <el-table-column prop="resourceCode" sortable align="center" :label="$t('capacity_SchedResoCode')"></el-table-column>
        <el-table-column prop="resourcePriority" sortable align="center" :label="$t('capacity_prior')" >
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.resourcePriority" ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="capacityType" sortable align="center" :label="$t('capacity_CapacType')" >
          <template slot-scope="scope">
          <el-select  v-model="scope.row.capacityType" :disabled="isIdentical">
             <el-option v-for="(option,i) in capacityTypeList" :key="i" :label="option" :value="option"></el-option>
          </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="capacity"  align="center" :label="$t('capacity_capac')">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.capacity" :disabled="isIdentical"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="capacityUom"  align="center" :label="$t('capacity_CapacUnit')">
          <template slot-scope="scope">
            <el-select v-model="scope.row.capacityUom" style="width:100%" :disabled="isIdentical">
              <el-option v-for="(option,i) in capacityUnit" :key="i" :label="option" :value="option"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="leadTime"  align="center" :label="$t('capacity_BeforSettTime')">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.leadTime" :disabled="isIdentical"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="leadTimeUom"  align="center" :label="$t('capacity_SetTimeUnitBefo')">
          <template slot-scope="scope">
           <el-select  v-model="scope.row.leadTimeUom" style="width:100%" :disabled="isIdentical">
              <el-option v-for="(option,i) in beforeTimeUnit" :key="i" :label="option" :value="option"></el-option>
           </el-select>
          </template>
        </el-table-column>
      </el-table>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveData">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      dialogFrom: {
        mComMaterialId: '',
        mPsmResourceGroupId: ''
      },
      materialNo: '',
      version: '',
      capacity: '',
      capacityType: '',
      capacityUom: '',
      leadTime: '',
      leadTimeUom: '',
      capacityTypeList: ['M', 'KG', 'PCS'],
      beforeTimeUnit: [this.$t('capacity_hour')],
      recourceTable: [],
      isIdentical: false,
      materialSearch: {
        materialNo: '',
        materialType: ''
      },
      materialColumns: [{
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
      }],
      resourceGroupList: []
    }
  },
  watch: {
    isIdentical (val) {
      this.capacity = ''
      this.capacityType = ''
      this.capacityUom = ''
      this.leadTime = ''
      this.leadTimeUom = ''
      this.changeAll()
    },
    capacity (val) {
      if (val) {
        this.changeAll()
      }
    },
    capacityType (val) {
      if (val) {
        this.changeAll()
      }
    },
    capacityUom (val) {
      if (val) {
        this.changeAll()
      }
    },
    leadTime (val) {
      if (val) {
        this.changeAll()
      }
    },
    leadTimeUom (val) {
      if (val) {
        this.changeAll()
      }
    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.materialNo ? this.materialNo + ':' : ''
      const version = this.version ? this.version : ''
      return `${materialNo}${version}`
    },
    rules () {
      return {
        mComMaterialId: [{ required: true, message: this.$t('common_PleaseSelectPN') }]
        // mPsmResourceGroupId: [{ required: true, message: '请选择资源组' }]
      }
    },
    capacityUnit () { return [this.$t('capacity_piece') + '/' + this.$t('capacity_hour'), this.$t('capacity_hour') + '/' + this.$t('capacity_piece')] }

  },
  props: {
    isEdit: Boolean,
    cancel: Function,
    getResourceCapacityMainList: Function,
    cannelDetail: Function
  },
  methods: {
    changeAll () {
      this.recourceTable.forEach(item => {
        this.$set(item, 'capacity', this.capacity)
        this.$set(item, 'capacityType', this.capacityType)
        this.$set(item, 'capacityUom', this.capacityUom)
        this.$set(item, 'leadTime', this.leadTime)
        this.$set(item, 'leadTimeUom', this.leadTimeUom)
      })
    },
    saveData () {
      this.$refs.dialogFrom.validate(async valid => {
        if (valid) {
          let { recourceTable, dialogFrom } = this
          let items = recourceTable
          let data = Object.assign({ items }, dialogFrom)
          console.log(data)
          let res = this.isEdit ? await this.$api.modifyResourceCapacity(data) : await this.$api.saveResourceCapacityBatch(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getResourceCapacityMainList')
            this.$emit('cannelDetail')
          })
        }
      })
    },
    // 获取所有资源组
    async getResourceGroupList () {
      let data = {
        keyWord: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getResourceGroupList(data)
      this.resourceGroupList = res.data.list
    },
    // 根据资源组id获取它下面的资源
    async getResource () {
      let mPsmResourceGroupId = this.dialogFrom.mPsmResourceGroupId
      let res = await this.$api.getResourceGroupById({ mPsmResourceGroupId })
      this.recourceTable = res.data.list
    },
    // 编辑时获取数据
    async editDataList () {
      if (this.isEdit) {
        let { dialogFrom } = this
        let res = await this.$api.getResourceCapacityList(dialogFrom)
        if (res.code === '200') {
          this.recourceTable = res.data.list
        } else {
          this.recourceTable = []
        }
      }
    }
  },
  components: {
    dialogTableSelect
  },
  created () {
    this.getResourceGroupList()
    this.editDataList()
  }
}
</script>
