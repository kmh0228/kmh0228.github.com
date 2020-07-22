<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">IQC检验审核</div>
    <div class="main-common-head mes-main-filte">
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">取消</el-button>
      <el-button type="primary" plain size="mini" v-show="formData.checkStatus !== '1'" :saveLoading="saveLoading" @click="saveOrDefine('save')" >保存</el-button>
      <el-button type="primary" plain size="mini" v-show="formData.checkStatus !== '1'" :saveLoading="saveLoading" @click="saveOrDefine('define')">确定</el-button>
    </div>
    <div>
      <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="formData" label-width="120px" label-position="left">
        <el-form-item label="IQC单号" class="el-col el-col-11 ">
          <el-input v-model="formData.iqcNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="行号" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.entrylistDetailItem" disabled></el-input>
        </el-form-item>
        <el-form-item label="入库单号" class="el-col el-col-11 ">
          <el-input v-model="formData.entrylistNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="物料编码" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.materialNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="物料描述" class="el-col el-col-11 ">
          <el-input v-model="formData.materialdesc" disabled></el-input>
        </el-form-item>
        <el-form-item label="检验数量" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.checkQty" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商" class="el-col el-col-11 ">
          <el-input v-model="formData.vendorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="物料批次号" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="formData.lotCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急程度" class="el-col el-col-11 ">
          <el-input v-model="formData.urgentLevel" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mes-main-tabs mes-table" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane name="info" label="检验信息">
            <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="formData" label-width="120px" label-position="left">
              <el-form-item label="检验结果" ref="auditForm" class="el-col el-col-11 ">
                <el-select size="mini" placeholder="检验结果" :disabled="formData.checkStatus === '1'" clearable v-model="formData.checkResult" style="width:100%">
                  <el-option label="合格" value="1"></el-option>
                  <el-option label="不合格" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合格数量" class="el-col el-col-11 el-col-offset-1">
                <el-input v-model="formData.acceptQty" :disabled="formData.checkStatus === '1'"></el-input>
              </el-form-item>
              <el-form-item label="不合格数量" class="el-col el-col-11 ">
                <el-input v-model="formData.rejectQty" :disabled="formData.checkStatus === '1'"></el-input>
              </el-form-item>
              <el-form-item label="处理结果" class="el-col el-col-11 el-col-offset-1">
                <el-select size="mini" placeholder="检验结果" :disabled="formData.checkStatus === '1'" clearable v-model="formData.handleResult" style="width:100%">
                  <el-option label="特采" value="0"></el-option>
                  <el-option label="挑选" value="1"></el-option>
                  <el-option label="报废" value="2"></el-option>
                  <el-option label="退货" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="batch" label="批次属性">
            <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="formData" label-width="120px" label-position="left">
              <el-form-item label="生产日期" class="el-col el-col-11 ">
                <el-input v-model="formData.produceDate" disabled></el-input>
              </el-form-item>
              <el-form-item label="生产批次" class="el-col el-col-11 el-col-offset-1">
                <el-input v-model="formData.produceLotCode" disabled></el-input>
              </el-form-item>
              <el-form-item label="收货日期" class="el-col el-col-11 ">
                <el-input v-model="formData.receiveDate" disabled></el-input>
              </el-form-item>
              <el-form-item label="失效日期" class="el-col el-col-11 el-col-offset-1">
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
        this.$message.warning('检验结果不能为空！')
        return false
      }
      if (!this.formData.handleResult) {
        this.$message.warning('处理结果不能为空！')
        return false
      }
      let reg = /^\d+(\.\d+)?$/
      if (!reg.test(this.formData.acceptQty) || !reg.test(this.formData.rejectQty)) {
        this.$message.warning('合格数量或不合格数格式不正确')
        return false
      }
      this.saveLoading = true
      let res = await this.$api.saveOrDefine({ ...this.formData, handleType: type })
      this.saveLoading = false
      if (res.code === '200') {
        this.$message.success('保存成功')
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
