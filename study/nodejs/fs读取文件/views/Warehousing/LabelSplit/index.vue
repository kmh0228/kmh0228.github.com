<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('LabelManagement_LabelSplit')}}</div>
    <div class="main-common-head mes-main-filte">
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_cancel')}}</el-button>
      <el-button type="primary" plain size="mini" :loading="saveLoading" @click="labelSplit">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini">{{$t('LabelManagement_Print')}}</el-button>
    </div>
    <div>
      <div class="scan_box el-row">
        <el-col :span="23">
          <el-input size="medium" ref="scanInput" style="font-size: 1vw;" v-model.trim="pkgCode" :placeholder="$t('LabelManagement_ScanLabelBarCode')" clearable @keydown.enter.native="scanFun"></el-input>
        </el-col>
      </div>
      <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="splitForm" label-width="30%" label-position="left">
        <el-form-item :label="$t('LabelManagement_TagNumber')" class="el-col el-col-11 ">
          <el-input v-model="splitForm.pkgCode" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_PorN')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="splitForm.materialCode" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_MaterialName')" class="el-col el-col-11 ">
          <el-input v-model="splitForm.materialName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_BatchNumber')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="splitForm.materialLot" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_Num')" class="el-col el-col-11 ">
          <el-input v-model="splitForm.qty" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_Remaining')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="surplusQty" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelManagement_SplitQuantity')" class="el-col el-col-11 ">
          <el-input v-model.trim="sQty" @change="changeSQty"></el-input>
        </el-form-item>
        <el-form-item label="" class="el-col el-col-11 " label-width="10px">
          <el-button type="primary" @click="splitFun" :loading="splitLoading">{{$t('LabelManagement_split')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mes-main-tabs mes-table" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('LabelManagement_SplitInformation')" name="splitInfo">
            <el-button size="mini" icon="el-icon-delete-solid" @click="deleteData">{{$t('common_Del')}}</el-button>
            <el-table :data="splitData" @selection-change="selectionChange" border size="mini" style="margin-top:10px">
              <el-table-column type="selection" align="center" fixed="left" width="80"></el-table-column>
              <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="pkgCode" sortable :label="$t('LabelManagement_NewBarcodeNumber')" align="center"></el-table-column>
              <el-table-column prop="qty" sortable :label="$t('LabelManagement_Num')" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable :label="$t('LabelManagement_MaterialCode')" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable :label="$t('common_MaterialName')"  align="center"></el-table-column>
              <el-table-column prop="pPkgCode" sortable :label="$t('LabelManagement_ParentBarcode')"  align="center"></el-table-column>
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
      activeName: 'splitInfo',
      pkgCode: '',
      saveLoading: false,
      splitLoading: false,
      splitForm: {
        pkgId: '',
        pkgCode: '',
        materialId: '',
        materialCode: '',
        materialName: '',
        materialLot: '',
        qty: ''
      },
      surplusQty: '',
      sQty: '',
      splitData: [],
      multipleSelection: [],
      splitFlag: false
    }
  },
  computed: {
  },
  watch: {
    splitData () {
      if (this.splitForm.qty) {
        let num = this.splitData.map(item => item.qty).reduce((prev, cur, index, array) => parseFloat(prev) + parseFloat(cur), 0)
        this.surplusQty = parseInt((parseFloat(this.splitForm.qty) - parseFloat(num)) * 1000) / 1000
      }
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
    changeSQty () {
      let reg = /^\d+(\.\d+)?$/
      if (this.sQty && !reg.test(this.sQty)) {
        this.$message.warning(this.$t('LabelManagement_SplitQuantityRequired'))
        this.sQty = ''
        return false
      }
      if (!this.surplusQty) {
        this.$message.warning(this.$t('LabelManagement_TheRemainingRequired'))
        this.sQty = ''
        return false
      }
      if (parseFloat(this.sQty) > parseFloat(this.surplusQty)) {
        this.$message.warning(this.$t('LabelManagement_splitQuantityRequired1'))
        this.sQty = ''
        return false
      }
    },
    async scanFun () {
      let pkgCode = this.pkgCode
      if (!pkgCode) {
        return false
      }
      let res = await this.$api.sacnSplit({ pkgCode })
      if (res.code === '200') {
        this.splitFlag = false
        this.pkgCode = ''
        this.splitForm = { ...res.data }
        this.surplusQty = res.data && res.data.qty
        this.splitData = []
      } else {
        this.$message.warning(res.msg)
      }
    },
    async splitFun () {
      let { materialId } = this.splitForm
      if (!materialId) {
        this.$message.warning(this.$t('LabelManagement_PleaseScan'))
        return false
      }
      if (!this.sQty) {
        this.$message.warning(this.$t('LabelManagement_SplitQuantityRequired2'))
        return false
      }
      this.splitLoading = true
      let res = await this.$api.getLabelRuleCode({ materialId })
      this.splitLoading = false
      if (res.code === '200') {
        this.splitData.push({
          rowId: new Date().getTime(),
          pkgCode: res.data,
          qty: this.sQty,
          materialCode: this.splitForm.materialCode,
          materialName: this.splitForm.materialName,
          pPkgCode: this.splitForm.pkgCode
        })
        this.sQty = ''
      } else {
        this.$message.warning(res.msg)
      }
    },
    async labelSplit () {
      if (this.splitFlag) {
        this.$message.warning(this.$t('LabelManagement_CannotSplit'))
        return false
      }
      if (!this.splitData.length) {
        this.$message.warning(this.$t('LabelManagement_SplitInformationRequired'))
        return false
      }
      this.saveLoading = true
      let data = {
        detailVmList: this.splitData.map(item => {
          let { pkgCode, qty } = item
          return { pkgCode, qty }
        }),
        pkgId: this.splitForm.pkgId,
        surplusQty: this.surplusQty
      }
      let res = await this.$api.labelSplit(data)
      if (res.code === '200') {
        this.splitFlag = true
        this.saveLoading = false
        this.$message.success(this.$t('LabelManagement_SplitSuccess'))
      }
    },
    async deleteData () {
      let ids = this.multipleSelection.map(item => item.rowId)
      if (!ids.length) {
        this.$message.warning(this.$t('LabelManagement_PleaseSelect1'))
        return false
      }
      const confirm = await this.$myPrompt.confirm(this.$t('LabelManagement_DeleteInfo'))
      if (confirm) {
        this.splitData = this.splitData.filter(item => ids.indexOf(item.rowId) === -1)
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
