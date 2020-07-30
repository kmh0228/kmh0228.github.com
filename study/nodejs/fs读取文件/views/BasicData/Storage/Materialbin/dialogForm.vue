<template>
   <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item :label="$t('common_PorN')" prop="mWmsMaterialbinMaterialid" class="el-col el-col-24">
    <!-- <el-select v-model="dialogForm.mWmsMaterialbinMaterialid" filterable clearable style="width:100%"  placeholder="请选择料号">
      <el-option v-for="(option,i) in materalTypeList" :key="i" :label="option.mComMaterialtypeCode" :value="option.mComMaterialId"></el-option>
    </el-select> -->
    <dialogTableSelect ref="dialogTableSelect" style="width:100%" class="mes-form-item" :contentValue="materialNoVersion"  v-model="dialogForm.mWmsMaterialbinMaterialid" selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
  </el-form-item>
  <el-form-item :label="$t('materialbin_StoraRoom')" prop="mWmsMaterialbinWarehouseid" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsMaterialbinWarehouseid" style="width:100%" filterable :placeholder="$t('materialbin_PleasSeleWare')" @change="getBinByMaterialId">
      <el-option v-for="(option,i) in warehouseTypeList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item :label="$t('common_StoraLoca')" prop="mWmsMaterialbinBinid" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsMaterialbinBinid" style="width:100%" filterable :placeholder="$t('materialbin_PleasSeleWareFi')">
      <el-option v-for="(option,i) in binTypeList" :key="i" :label="option.mWmsWarehouseBinCode" :value="option.mWmsMaterialbinBinid"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveMateria">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
  </el-form-item>
 </el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      dialogForm: {
        materialNo: '',
        version: '',
        mWmsMaterialbinMaterialid: '',
        mWmsMaterialbinWarehouseid: '',
        mWmsMaterialbinBinid: ''
      },
      rules: {
        mWmsMaterialbinMaterialid: [{ required: true, message: this.$t('common_ItemNoCannBeEm') }],
        mWmsMaterialbinWarehouseid: [{ required: true, message: this.$t('materialbin_WarehCannBeEmpt') }],
        mWmsMaterialbinBinid: [{ required: true, message: this.$t('materialbin_StoraLocaCannBe') }]

      },
      materalTypeList: [],
      warehouseTypeList: [],
      binTypeList: [],
      // 仓库和储位公用查询条件
      search: {
        pageIndex: 1,
        pageSize: 1000,
        keywords: ''
      },
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
  props: {
    isEdit: Boolean,
    getMaterialBin: Function,
    selectObj: Object
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.dialogForm.materialNo ? this.dialogForm.materialNo + ':' : ''
      const version = this.dialogForm.version ? this.dialogForm.version : ''
      return `${materialNo}${version}`
    }
  },
  methods: {
    saveMateria () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let res = isEdit ? await this.$api.editMaterialBin(dialogForm) : await this.$api.addMaterialBin(dialogForm)
          let { code, msg } = res
          if (code === '200') {
            this.$emit('getMaterialBin')
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
          this.$emit('cannel')
        }
      })
    },
    // // 获取物料类别
    // async getMaterialMasters () {
    //   let { materialSearch } = this
    //   let data = Object.assign(materialSearch)
    //   let res = await this.$api.getMaterialMasters(data)
    //   this.materalTypeList = res.data.list
    // },
    // 根据仓库获取储位列表
    async getBinByMaterialId () {
      let mWmsMaterialbinId = this.dialogForm.mWmsMaterialbinWarehouseid
      let res = await this.$api.getBinByMaterialId({ mWmsMaterialbinId })
      this.binTypeList = res.data
    },
    // 获取仓库
    async getWarehouses () {
      let { search } = this
      let data = Object.assign(search)
      let res = await this.$api.getWarehouses(data)
      this.warehouseTypeList = res.data.list
    },
    // 设置默认数据
    setDefaultData () {
      const { selectObj, dialogForm, isEdit } = this
      let keys = Object.keys(dialogForm)
      if (isEdit) {
        this.dialogForm = this.$global.filterForm(selectObj, keys)
        this.dialogForm.mWmsMaterialbinId = selectObj.mWmsMaterialbinId
        this.getBinByMaterialId()
      }
    }
  },
  created () {
    // this.getMaterialMasters()
    this.getWarehouses()
  },
  mounted () {
    this.setDefaultData()
  },
  components: {
    dialogTableSelect
  }
}
</script>
