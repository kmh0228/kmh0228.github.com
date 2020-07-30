<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('LabelManagement_LabelMerging')}}</div>
    <div class="main-common-head mes-main-filte">
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_cancel')}}</el-button>
      <el-button type="primary" plain size="mini" :saveLoading="saveLoading" @click="labelMerge">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini">{{$t('LabelManagement_Print')}}</el-button>
    </div>
    <div>
      <div class="scan_box el-row">
        <el-col :span="23">
          <el-input size="medium" ref="scanInput" style="font-size: 1vw;" v-model.trim="pkgCode" :placeholder="$t('LabelManagement_ScanLabelBarCode')" clearable @keydown.enter.native="scanFun"></el-input>
        </el-col>
      </div>
      <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="mergeForm" label-width="30%" label-position="left">
        <el-form-item :label="$t('LabelManagement_NewTagNumber')" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.newPkgCode" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_PorN')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="mergeForm.materialCode" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_MaterialName')" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.materialName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_BatchNumber')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="mergeForm.materialLot" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_NumberOfNewTags')" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.qty" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_Status')" class="el-col el-col-11 el-col-offset-1">
          <el-select size="mini" :placeholder="$t('LabelManagement_OperationType')"  style="width:100%" v-model="mergeForm.status" disabled>
            <el-option :label="$t('LabelManagement_found')" value="1"></el-option>
            <el-option :label="$t('LabelManagement_takeDelivery')" value="2"></el-option>
            <el-option :label="$t('LabelManagement_OnTheShelf')" value="3"></el-option>
            <el-option :label="$t('LabelManagement_picking')" value="4"></el-option>
            <el-option :label="$t('LabelManagement_WarehouseOut')" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_LocationCode')" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.binCode" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mes-main-tabs mes-table" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane name="mergeInfo">
            <div slot="label" style="position: relative;" ><span >{{$t('LabelManagement_ScanningRecords')}} &nbsp; <span style="position: absolute;right: -150px;color:#333">{{$t('LabelManagement_NumberOfTags')}}：{{mergeData.length}}</span></span></div>
            <el-button size="mini" icon="el-icon-delete-solid" @click="deleteData">{{$t('common_Del')}}</el-button>
            <el-table :data="mergeData" @selection-change="selectionChange" border size="mini" style="margin-top:10px">
              <el-table-column type="selection" align="center" fixed="left" width="80"></el-table-column>
              <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="pkgCode" sortable :label="$t('LabelManagement_SubBarCodeNumber')" align="center"></el-table-column>
              <el-table-column prop="qty" sortable :label="$t('LabelManagement_Num')" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable :label="$t('LabelManagement_MaterialCode')" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable :label="$t('common_MaterialName')"  align="center"></el-table-column>
              <el-table-column prop="newPkgCode" sortable :label="$t('LabelManagement_NewBarcodeNumber')"  align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'mergeInfo',
      mergeFlag: false,
      saveLoading: false,
      mergeForm: {
        newPkgCode: '',
        materialId: '',
        materialCode: '',
        materialName: '',
        binId: '',
        binCode: '',
        binName: '',
        pkgId: '',
        materialLot: '',
        qty: ''
      },
      pkgCode: '',
      mergeData: [],
      multipleSelection: []
    }
  },
  computed: {
  },
  watch: {
    mergeData (n) {
      this.mergeForm.qty = this.mergeData.map(item => item.qty).reduce((prev, cur) => parseInt((parseFloat(prev) + parseFloat(cur)) * 1000) / 1000, 0)
    }
  },
  methods: {
    closeCurrentPage () {
      let title = this.$route.meta.title
      let data = { title, url: '/Warehousing/LabelManagement' }
      this.$store.dispatch('closeCurrentPage', data)
    },
    selectionChange (val) {
      this.multipleSelection = val
    },
    async scanFun () {
      let pkgCode = this.pkgCode
      if (!pkgCode) {
        return false
      }
      if (this.mergeData.length && this.mergeData.map(item => item.pkgCode).indexOf(this.pkgCode) !== -1) {
        return this.$message.warning(this.$t('LabelManagement_DoNotRepeatScanning'))
      }
      let res = await this.$api.sacnMerge({ ...this.mergeForm, pkgCode })
      if (res.code === '200') {
        this.pkgCode = ''
        this.mergeForm = { ...res.data, newPkgCode: res.data.newPkgCode ? res.data.newPkgCode : this.mergeForm.newPkgCode }
        this.mergeData.push({ ...this.mergeForm, rowId: new Date().getTime() })
      } else {
        this.$message.warning(res.msg)
      }
    },
    async deleteData () {
      let ids = this.multipleSelection.map(item => item.rowId)
      if (!ids.length) {
        this.$message.warning(this.$t('LabelManagement_PleaseSelect3'))
        return false
      }
      const confirm = await this.$myPrompt.confirm(this.$t('LabelManagement_DeleteInfo1'))
      if (confirm) {
        this.mergeData = this.mergeData.filter(item => ids.indexOf(item.rowId) === -1)
      }
    },
    async labelMerge () {
      if (!this.mergeForm.newPkgCode) {
        return this.$message.warning(this.$t('LabelManagement_PleaseScan1'))
      }
      let data = {
        pkgCode: this.mergeForm.newPkgCode,
        pkgIds: this.mergeData.map(item => item.pkgId),
        qty: this.mergeForm.qty
      }
      this.saveLoading = true
      let res = await this.$api.labelMerge(data)
      this.saveLoading = false
      if (res.code === '200') {
        this.$message.success(this.$t('LabelManagement_MergeSucceeded'))
        this.mergeData = []
        this.pkgCode = ''
        this.$global.resetForm(this.mergeForm)
      }
    }
  },
  components: {
  },
  mounted () {
    this.$refs.scanInput.focus()
  }
}
</script>
<style lang="scss" scoped>
</style>
