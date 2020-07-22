<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('scanningRules_MaterScanRule')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('scanningRules_PleasEnteItemNu')" v-model.trim="materialNo" size="mini" style="width:40%" @keydown.enter.native="getMaterialParseRuleInfo">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getMaterialParseRuleInfo">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleScanRules('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="delMaterialRule('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="getMaterialParseRuleInfo">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="parseRuleData" border highlight-current-row size="mini" @selection-change="selectRule">
        <el-table-column type="selection" width="50" align="center"  ></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" width="50" align="center" :index="indexMethod" fixed ></el-table-column>
        <el-table-column :label="$t('common_PorN')" align="center" :formatter="formatMaterial" width="200" sortable ></el-table-column>
        <el-table-column prop="detail.scanType" :label="$t('scanningRules_ScanType')" align="center" sortable min-width="120" ></el-table-column>
        <el-table-column prop="detail.bcCheck" :label="$t('scanningRules_BarcoChecType')" align="center" width="120" sortable ></el-table-column>
        <el-table-column prop="detail.pbcLength" :label="$t('scanningRules_BarCodeLeng')" align="center" sortable  min-width="120"></el-table-column>
        <el-table-column prop="detail.bcValue" :label="$t('scanningRules_BarCodeValu')" align="center" sortable  min-width="100"></el-table-column>
        <el-table-column prop="detail.pbcStart" :label="$t('scanningRules_AnalyBarCodeSta')" align="center" width="150" sortable ></el-table-column>
        <el-table-column prop="detail.pbcEnd" :label="$t('scanningRules_AnalyBarCodeEnd')" align="center"  width="150" sortable ></el-table-column>
        <el-table-column prop="detail.bcStart" :label="$t('scanningRules_BarcoStar')" align="center" sortable  min-width="120"></el-table-column>
        <el-table-column prop="detail.bcEnd" :label="$t('scanningRules_EndBarCode')" align="center" sortable  min-width="120"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handleScanRules(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="delMaterialRule(scope.row.mComMaterialParseRuleId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="900px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible=false" @getMaterialParseRuleInfo="getMaterialParseRuleInfo" :isEdit="isEdit"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      materialNo: '',
      queryLevel: 1,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      parseRuleData: [],
      selectedList: [],
      isEdit: false,
      dialogVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('scanningRules_EditMateScanRul') : this.$t('scanningRules_NewMateScanRule')
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getMaterialParseRuleInfo()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getMaterialParseRuleInfo()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatterDate (row, column, ceellValue) {
      return this.$dayjs(ceellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    formatMaterial (row) {
      const { materialNo, version } = row
      const material = materialNo ? materialNo + ':' : ''
      const versions = version || ''
      return material + versions
    },
    selectRule (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mComMaterialParseRuleId)
      })
    },
    handleScanRules (row) {
      if (row) {
        this.dialogVisible = true
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row.detail, keys)
          this.$refs.dialog.dialogForm.mComMaterialId = row.mComMaterialId
          this.$refs.dialog.dialogForm.materialNo = row.materialNo
          this.$refs.dialog.dialogForm.version = row.version
          this.$refs.dialog.dialogForm.parseRuleDesc = row.parseRuleDesc
          this.$refs.dialog.dialogForm.mComMaterialParseRuleId = row.mComMaterialParseRuleId
        })
      } else {
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    async getMaterialParseRuleInfo () {
      const { materialNo, page, queryLevel } = this
      const params = Object.assign({ materialNo, mComMaterialClassId: '', queryLevel }, page)
      let res = await this.$api.getMaterialParseRuleInfo(params)
      const { code, data } = res
      if (code === '200') {
        this.total = data.total_num
        this.parseRuleData = data.list
      } else {
        this.total = 0
        this.parseRuleData = []
      }
    },
    async delMaterialRule (id) {
      let ids = id ? [id] : this.selectedList
      let len = ids.length
      if (ids.length > 0) {
        let text = id ? this.$t('scanningRules_AreYouSureDeleC') : this.$t('scanningRules_AreYouSureDeleS')
        let confirmRes = await this.$myPrompt.confirm(text)
        if (confirmRes) {
          await this.$api.delMaterialParseRule(ids)
          if ((this.total - len) % this.page.pageSize === 0) {
            this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
          }
          this.getMaterialParseRuleInfo()
          this.$message.success(this.$t('common_DeletionSucceeded'))
        }
      } else {
        this.$message.warning(this.$t('scanningRules_PleasSeleEncoRu'))
      }
    }
  },
  created () {
    this.getMaterialParseRuleInfo()
  },
  components: {
    dialogForm
  }
}
</script>
