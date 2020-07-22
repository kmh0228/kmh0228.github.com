<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">标签合并</div>
    <div class="main-common-head mes-main-filte">
      <el-button type="primary" plain size="mini" @click="closeCurrentPage">取消</el-button>
      <el-button type="primary" plain size="mini" :saveLoading="saveLoading" @click="labelMerge">保存</el-button>
      <el-button type="primary" plain size="mini">打印</el-button>
    </div>
    <div>
      <div class="scan_box el-row">
        <el-col :span="23">
          <el-input size="medium" ref="scanInput" style="font-size: 1vw;" v-model.trim="pkgCode" placeholder="扫描标签条码" clearable @keydown.enter.native="scanFun"></el-input>
        </el-col>
      </div>
      <el-form class="el-row mes-search-form" style="margin-top: 20px;" :model="mergeForm" label-width="30%" label-position="left">
        <el-form-item label="新标签号" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.newPkgCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="料号" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="mergeForm.materialCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="物料名称" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.materialName" disabled></el-input>
        </el-form-item>
        <el-form-item label="批次号" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="mergeForm.materialLot" disabled></el-input>
        </el-form-item>
        <el-form-item label="新标签数量" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.qty" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" class="el-col el-col-11 el-col-offset-1">
          <el-select size="mini" placeholder="操作类型"  style="width:100%" v-model="mergeForm.status" disabled>
            <el-option label="创建" value="1"></el-option>
            <el-option label="收货" value="2"></el-option>
            <el-option label="上架" value="3"></el-option>
            <el-option label="拣货" value="4"></el-option>
            <el-option label="出库" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位" class="el-col el-col-11 ">
          <el-input v-model="mergeForm.binCode" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mes-main-tabs mes-table" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane name="mergeInfo">
            <div slot="label" style="position: relative;" ><span >扫描记录 &nbsp; <span style="position: absolute;right: -100px;color:#333">标签数量：{{mergeData.length}}</span></span></div>
            <el-button size="mini" icon="el-icon-delete-solid" @click="deleteData">删除</el-button>
            <el-table :data="mergeData" @selection-change="selectionChange" border size="mini" style="margin-top:10px">
              <el-table-column type="selection" align="center" fixed="left" width="80"></el-table-column>
              <el-table-column type="index" label="序号" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="pkgCode" sortable label="子条码号" align="center"></el-table-column>
              <el-table-column prop="qty" sortable label="数量" align="center"></el-table-column>
              <el-table-column prop="materialCode" sortable label="物料编码" align="center"></el-table-column>
              <el-table-column prop="materialName" sortable label="物料名称"  align="center"></el-table-column>
              <el-table-column prop="newPkgCode" sortable label="新条码"  align="center"></el-table-column>
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
        return this.$message.warning('请勿重复扫描')
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
        this.$message.warning('请选择需要删除的合并数据')
        return false
      }
      const confirm = await this.$myPrompt.confirm('确定删除当前选中的合并数据吗?')
      if (confirm) {
        this.mergeData = this.mergeData.filter(item => ids.indexOf(item.rowId) === -1)
      }
    },
    async labelMerge () {
      if (!this.mergeForm.newPkgCode) {
        return this.$message.warning('请扫描条码需要合并的条码号')
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
        this.$message.success('合并成功')
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
