<template>
  <div class="mes-main mes-main-common mes-workstation">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="pkgidScan">{{$t('PKGIDScan_mWmsPkgidPkgid')}}</el-button>
    </div>
    <el-form :model="formData" ref="formData" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item :label="$t('PKGIDScan_materialNo')" class="el-col el-col-11" prop="mWmsPkgidMaterialid">
        <!-- <el-select v-model="formData.mWmsPkgidMaterialid" style="width:100%;" size="mini" clearable filterable placeholder="请选择料号" @change="materialChange">
           <el-option v-for="(option,i) in materialList" :key="i" :label="option.MATERIAL_NO" :value="option.M_COM_MATERIAL_ID" @click.native="setMaterialName(option.MATERIAL_NAME)"></el-option>
        </el-select> -->
        <dialogTableSelect ref="dialogTableSelect" style="width:100%" class="mes-form-item" :contentValue="''"  v-model="formData.mWmsPkgidMaterialid" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @select-change="setMaterialName" ></dialogTableSelect>
      </el-form-item>
      <el-form-item :label="$t('PKGIDScan_materialName')" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="materialName" size="mini" readonly=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('PKGIDScan_mWmsPkgidQty')" class="el-col el-col-11" prop="mWmsPkgidQty">
        <el-input v-model.trim="formData.mWmsPkgidQty" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="DateCode" class="el-col el-col-11 el-col-offset-1" prop="mWmsPkgidDatecode">
        <el-input v-model.trim="formData.mWmsPkgidDatecode" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="LOT" class="el-col el-col-11" prop="mWmsPkgidLot">
        <el-input v-model.trim="formData.mWmsPkgidLot" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('PKGIDScan_mWmsPkgidPkgid')" class="el-col el-col-11 el-col-offset-1" prop="mWmsPkgidPkgid">
        <el-input v-model.trim="formData.mWmsPkgidPkgid" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('PKGIDScan_mWmsPkgidIsprint')" class="el-col el-col-11">
        <el-checkbox v-model="formData.mWmsPkgidIsprint"></el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      materialName: '',
      formData: {
        mWmsPkgidMaterialid: '',
        mWmsPkgidQty: '',
        mWmsPkgidDatecode: '',
        mWmsPkgidLot: '',
        mWmsPkgidPkgid: '',
        mWmsPkgidIsprint: true,
        materialNo: '',
        version: ''
      },
      materialList: [],
      materialSearch: {
        materialNo: '',
        materialType: ''
      }
    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.formData.materialNo ? this.formData.materialNo + ':' : ''
      const version = this.formData.version ? this.formData.version : ''
      return `${materialNo}${version}`
    },
    rules () {
      return {
        mWmsPkgidMaterialid: [{ required: true, message: this.$t('PKGIDScan_materialNoRequired') }],
        mWmsPkgidQty: [{ required: true, message: this.$t('PKGIDScan_mWmsPkgidQtyRequired') }],
        mWmsPkgidDatecode: [{ required: true, message: this.$t('PKGIDScan_mWmsPkgidDatecodeRequired') }],
        mWmsPkgidLot: [{ required: true, message: this.$t('PKGIDScan_mWmsPkgidLotRequired') }],
        mWmsPkgidPkgid: [{ required: true, message: this.$t('PKGIDScan_mWmsPkgidPkgidRequired') }]
      }
    },
    materialColumns () {
      return [{
        key: 'materialNo',
        label: this.$t('PKGIDScan_materialNo')
      }, {
        key: 'materialName',
        label: this.$t('PKGIDScan_materialName')
      }, {
        key: 'version',
        label: this.$t('PKGIDScan_version')
      }, {
        key: 'mComMaterialtypeCode',
        label: this.$t('PKGIDScan_mComMaterialtypeCode')
      }]
    }
  },
  methods: {
    // 获取料号列表
    async getMaterials () {
      let res = await this.$api.getMaterials()
      this.materialList = res.data
    },
    setMaterialName (selection) {
      this.materialName = selection.materialName
    },
    pkgidScan () {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          let { formData } = this
          let res = await this.$api.scanPkgid(formData)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getMaterials()
  },
  components: {
    dialogTableSelect
  }
}
</script>
