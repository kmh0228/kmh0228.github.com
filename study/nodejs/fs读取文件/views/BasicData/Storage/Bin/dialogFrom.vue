<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="140px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('bin_WarehCode')" prop="mWmsWarehouseBinWarehouseid" class="el-col el-col-11">
      <el-select v-model="dialogForm.mWmsWarehouseBinWarehouseid" size="mini" style="width:100%" @change="getArea(true)" filterable :placeholder="$t('bin_PleasSeleWareCo')">
        <el-option v-for="(option,i) in warehouseList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_AreaCode')" prop="mWmsWarehouseBinAreaid" class="el-col el-col-11 el-col-offset-1" >
       <el-select v-model="dialogForm.mWmsWarehouseBinAreaid" size="mini" style="width:100%" filterable :placeholder="$t('bin_PleasSeleAreaCo')">
        <el-option v-for="(option,i) in areaList" :key="i" :label="option.mWmsWarehouseAreaCode" :value="option.mWmsWarehouseAreaId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('bin_LocatNumb')" prop="mWmsWarehouseBinCode" class="el-col el-col-11 ">
      <el-input v-model.trim="dialogForm.mWmsWarehouseBinCode" size="mini" :placeholder="$t('bin_PleasEnteStorNu')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('bin_NameStorLoca')" prop="mWmsWarehouseBinName" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsWarehouseBinName" size="mini" :placeholder="$t('bin_PleasEnteNameSt')"></el-input>
    </el-form-item>
     <el-form-item :label="$t('bin_ReserType')" prop="mWmsWarehouseBinType" class="el-col el-col-11 ">
      <el-select v-model="dialogForm.mWmsWarehouseBinType" size="mini" style="width:100%" filterable :placeholder="$t('bin_PleasSeleStorTy')">
        <el-option v-for="(option,i) in typeList" :key="i" :label="$t(option.label)" :value="option.value" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_UsageStorSpac')" prop="mWmsWarehouseBinUse" class="el-col el-col-11 el-col-offset-1">
      <el-select v-model="dialogForm.mWmsWarehouseBinUse" size="mini" style="width:100%" filterable :placeholder="$t('bin_PleasSeleUsagSt')">
        <el-option v-for="(option,i) in useList" :key="i" :label="option.label" :value="option.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('bin_IsMixiAllo')" prop="mWmsWarehouseBinIsmix" class="el-col el-col-11 ">
      <el-checkbox v-model="dialogForm.mWmsWarehouseBinIsmix"></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('bin_WhethReceGoodTe')" prop="receiveTemp" class="el-col el-col-11 el-col-offset-1">
      <el-checkbox v-model="dialogForm.receiveTemp"></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('bin_IsPickTempStor')" prop="pickTemp" class="el-col el-col-11 ">
      <el-checkbox v-model="dialogForm.pickTemp"></el-checkbox>
    </el-form-item>
     <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsWarehouseBinId: '',
        mWmsWarehouseBinWarehouseid: '',
        mWmsWarehouseBinAreaid: '',
        mWmsWarehouseBinCode: '',
        mWmsWarehouseBinName: '',
        mWmsWarehouseBinType: '',
        mWmsWarehouseBinUse: '',
        mWmsWarehouseBinIsmix: false,
        pickTemp: false,
        receiveTemp: false
      },
      warehouseList: [],
      areaList: [],
      shelfList: [],
      typeList: [
        {
          label: 'bin_entit',
          value: '实体'
        },
        {
          label: 'bin_ficti',
          value: '虚拟'
        }
      ],
      useList: [
        {
          label: 'bin_inUse',
          value: '使用中'
        },
        {
          label: 'bin_Aband',
          value: '废弃'
        }
      ],
      page: {
        pageSize: 1000,
        pageIndex: 1
      }
    }
  },
  computed: {
    rules () {
      return {
        mWmsWarehouseBinWarehouseid: [{ required: true, message: this.$t('bin_WarehCodeCannBe') }],
        mWmsWarehouseBinType: [{ required: true, message: this.$t('bin_PleasSeleStorTy') }],
        mWmsWarehouseBinAreaid: [{ required: true, message: this.$t('bin_AreaCodeCannBeE') }],
        mWmsWarehouseBinCode: [{ required: true, message: this.$t('bin_StoraCodeCannBe') }],
        mWmsWarehouseBinName: [{ required: true, message: this.$t('bin_StoreNameCannBe') }]
      }
    }
  },
  props: {
    getBin: {
      type: Function
    }
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let res = this.dialogForm.mWmsWarehouseBinId ? await this.$api.editBin({ ...this.dialogForm }) : await this.$api.addBin({ ...this.dialogForm })
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('getBin')
            this.$emit('cannel')
          }, false)
        }
      })
    },
    async getWarehousr () {
      let keywords = ''
      let data = Object.assign({ keywords }, this.page)
      let res = await this.$api.getWarehouses(data)
      this.warehouseList = res.data.list
      this.getArea()
    },
    async getArea (flag) {
      if (flag) {
        this.mWmsWarehouseBinAreaid = ''
      }
      let { page } = this
      let mWmsWarehouseId = this.dialogForm.mWmsWarehouseBinWarehouseid
      let data = Object.assign({ mWmsWarehouseId }, page)
      let res = await this.$api.getArea(data)
      this.areaList = res.data.list
    }
  },
  created () {
    this.getWarehousr()
  }

}
</script>
