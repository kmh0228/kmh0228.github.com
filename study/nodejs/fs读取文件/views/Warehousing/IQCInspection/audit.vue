<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('IQCInspection_IQCInspectionAndAudit')}}</div>
    <div class="main-common-head mes-main-filte">
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_cancel')}}</el-button>
      <el-button type="primary" plain size="mini" v-show="formData.checkStatus !== '1'" :saveLoading="saveLoading" @click="saveOrDefine('save')" >{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini" v-show="formData.checkStatus !== '1'" :saveLoading="saveLoading" @click="saveOrDefine('define')">{{$t('common_ok')}}</el-button>
    </div>
    <div>
      <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="formData" label-width="120px" label-position="left">
        <el-form-item :label="$t('IQCInspection_IQCNo')" class="el-col el-col-11 ">
          <el-input v-model="formData.iqcNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IQCInspection_LineNumber')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.entrylistDetailItem" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_StockInNo')" class="el-col el-col-11 ">
          <el-input v-model="formData.entrylistNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_MaterCode')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.materialNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IQCInspection_MaterialDescription')" class="el-col el-col-11 ">
          <el-input v-model="formData.materialdesc" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IQCInspection_InspectionQuantity')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.checkQty" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_suppl')" class="el-col el-col-11 ">
          <el-input v-model="formData.vendorName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IQCInspection_MaterialBatchNo')" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.lotCode" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('IQCInspection_Urgency')" class="el-col el-col-11 ">
          <el-input v-model="formData.urgentLevel" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mes-main-tabs mes-table" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane name="info" :label="$t('IQCInspection_InspectionInformation')">
            <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="formData" label-width="120px" label-position="left">
              <el-form-item :label="$t('common_TestResu')" ref="auditForm" class="el-col el-col-11 ">
                <el-select size="mini" :placeholder="$t('common_TestResu')" :disabled="formData.checkStatus === '1'" clearable v-model="formData.checkResult" style="width:100%">
                  <el-option :label="$t('common_quali')" value="1"></el-option>
                  <el-option :label="$t('IQCInspection_Unqualified')" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('IQCInspection_QualifiedQuantity')" class="el-col el-col-11 el-col-offset-1">
                <el-input v-model="formData.acceptQty" :disabled="formData.checkStatus === '1'"></el-input>
              </el-form-item>
              <el-form-item :label="$t('IQCInspection_UnqualifiedQuantity')" class="el-col el-col-11 ">
                <el-input v-model="formData.rejectQty" :disabled="formData.checkStatus === '1'"></el-input>
              </el-form-item>
              <el-form-item :label="$t('IQCInspection_ProcessingResult')" class="el-col el-col-11 el-col-offset-1">
                <el-select size="mini" :placeholder="$t('common_TestResu')" :disabled="formData.checkStatus === '1'" clearable v-model="formData.handleResult" style="width:100%">
                  <el-option :label="$t('common_SpeciColl')" value="0"></el-option>
                  <el-option :label="$t('common_choos')" value="1"></el-option>
                  <el-option :label="$t('IQCInspection_Scrap')" value="2"></el-option>
                  <el-option :label="$t('IQCInspection_Return')" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="batch" :label="$t('IQCInspection_BatchAttribute')">
            <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="formData" label-width="120px" label-position="left">
              <el-form-item :label="$t('common_dateManu')" class="el-col el-col-11 ">
                <el-input v-model="formData.produceDate" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('common_ProduBatc')" class="el-col el-col-11 el-col-offset-1">
                <el-input v-model="formData.produceLotCode" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('IQCInspection_ReceivingDate')" class="el-col el-col-11 ">
                <el-input v-model="formData.receiveDate" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('IQCInspection_ExpirationDate')" class="el-col el-col-11 el-col-offset-1">
                <el-input v-model="formData.invalidDate" disabled></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'info',
      saveLoading: false,
      formData: {
        iqcNo: '',
        entrylistDetailItem: '',
        entrylistNo: '',
        materialNo: '',
        materialdesc: '',
        checkQty: '',
        vendorName: '',
        lotCode: '',
        urgentLevel: '',
        checkResult: '',
        acceptQty: '',
        rejectQty: '',
        handleResult: '',
        produceDate: '',
        produceLotCode: '',
        receiveDate: '',
        invalidDate: '',
        checkStatus: ''
      }
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    closeCurrentPage () {
      let title = this.$route.meta.title
      let data = { title, url: '/Warehousing/IQCInspection' }
      this.$store.dispatch('closeCurrentPage', data)
    },
    async saveOrDefine (type) {
      if (!this.formData.checkResult) {
        this.$message.warning(this.$t('IQCInspection_InspectionResultCannotBeEmpty'))
        return false
      }
      if (!this.formData.handleResult) {
        this.$message.warning(this.$t('IQCInspection_ProcessingResultCannotBeEmpty'))
        return false
      }
      let reg = /^\d+(\.\d+)?$/
      if (!reg.test(this.formData.acceptQty) || !reg.test(this.formData.rejectQty)) {
        this.$message.warning(this.$t('IQCInspection_Tips'))
        return false
      }
      this.saveLoading = true
      let res = await this.$api.saveOrDefine({ ...this.formData, handleType: type })
      this.saveLoading = false
      if (res.code === '200') {
        this.$message.success(this.$t('common_SavedSuccessfully'))
        this.$router.push('/Warehousing/IQCInspection')
      }
    }
  },
  components: {
  },
  created () {
    this.formData = JSON.parse(sessionStorage.getItem('IQCAuditData')) ? JSON.parse(sessionStorage.getItem('IQCAuditData'))[0] : ''
    if (!this.formData) {
      this.$router.push('/Warehousing/IQCInspection')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
