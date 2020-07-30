<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('barcodeType_BarcoTypeSett')}}</h3>
    <el-form label-position="left" class="el-row">
      <el-form-item :label="$t('barcodeType_BarcoName')" label-width="80px" class="el-col el-col-24">
        <el-input v-model="keyWord" size="mini" style="width:12vw;" @keydown.enter="getBarCodeTypeList">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getBarCodeTypeList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleCurrentRows('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteRows('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="getBarCodeTypeList">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="barcodeTable" border highlight-current-row size="mini" @selection-change="selectBarcode" @current-change="tableCurrentChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column :label="$t('barcodeType_BarcoName')" align="center" prop="fileName"  sortable></el-table-column>
        <el-table-column :label="$t('barcodeType_PrintModuPath')" align="center" prop="filePath"  sortable></el-table-column>
        <el-table-column :label="$t('barcodeType_TemplType')" align="center" prop="fileTypeName"  sortable></el-table-column>
        <el-table-column :label="$t('barcodeType_DefauQuan')" align="center" prop="printCopies"  sortable></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center"  sortable>
          <template slot-scope="scope" width="120">
            <handle-button @click="handleCurrentRows(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button  @click="deleteRows(scope.row.mPomWorkMasPrintTmplId,scope.$index)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs mes-table">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('barcodeType_BarCodeDeta')" name="info">
          <el-table :data="codeInfo" border size="mini">
            <el-table-column :label="$t('common_Number')" align="center" width="60">
              <template slot-scope="scope">
                <p>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('barcodeType_PrintProj')" align="center">
              <template slot-scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.paramName" size="mini"></el-input>
                <p v-else>{{ scope.row.paramName }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('barcodeType_PrintPara')" align="center">
              <template slot-scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.paramValue" size="mini"></el-input>
                <p v-else>{{ scope.row.paramValue }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common_Description')" align="center">
              <template slot-scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.paramDesc" size="mini"></el-input>
                <p v-else>{{ scope.row.paramDesc }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common_Operate')" align="center" width="120" v-if="isEdit">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="scope.row.isEdit=true" size="mini">编辑</el-button> -->
                <el-button type="text" style="color:#F56C6C" size="mini" @click="deleteInfoRows(scope.$index)">{{$t('common_Del')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:1.5vh;">
            <el-button type="primary" v-if="!isEdit" plain size="mini" @click="handleInfo">{{ codeInfo.length>0?$t('barcodeType_modif'):$t('common_Add') }}</el-button>
            <el-button type="primary" v-if="isEdit" plain size="mini" @click="addInfoRows">{{$t('common_add')}}</el-button>
            <el-button type="success" v-if="isEdit" plain size="mini" :disabled="codeInfo.length===0" @click="addCodeInfo">{{$t('common_save')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="handleType+$t('barcodeType_BarcoType')" :visible.sync="dialogVisible" top="20vh" width="600px">
      <dialog-form v-if="dialogVisible" :formData="barCodeForm"  @close-dialog="closeDialog" :handleType="handleType" ref="dialogForm"></dialog-form>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="handleBarCodeType">{{$t('common_ok')}}</el-button>
        <el-button @click="dialogVisible = false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialog'
export default {
  data () {
    return {
      keyWord: '',
      queryLevel: 1,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      barcodeTable: [],
      selectedList: [],
      mPomWorkMasPrintTmplId: '',
      dialogVisible: false,
      barCodeForm: {
        mPomWorkMasPrintTmplId: '',
        fileName: '',
        fileType: '',
        fileTypeName: '',
        filePath: '',
        printCopies: ''
      },
      handleType: '',
      activeName: 'info',
      isEdit: false,
      codeInfo: [],
      validInfo: false
    }
  },
  watch: {
    mPomWorkMasPrintTmplId (val) {
      this.getBarCodeInfo(val)
    },
    barCodeForm: {
      handler (val) {
        this.handleType = val.mPomWorkMasPrintTmplId ? this.$t('common_Edit') : this.$t('common_Add')
      },
      deep: true
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    selectBarcode (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mPomWorkMasPrintTmplId)
      })
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取所有条码类型
    async getBarCodeTypeList () {
      let { keyWord, page, queryLevel } = this
      let data = Object.assign({ keyWord, queryLevel }, page)
      let res = await this.$api.getPrintBarCodeType(data)
      if (res.code === '200') {
        this.total = res.data.total_num
        this.barcodeTable = res.data.list
      }
    },
    // 选中当前行显示对应的条码详情
    tableCurrentChange (row) {
      if (row) {
        this.mPomWorkMasPrintTmplId = row.mPomWorkMasPrintTmplId
        this.isEdit = false
      }
    },
    // 获取条码详情
    async getBarCodeInfo (id) {
      let res = await this.$api.getPrintBarCodeInfo(id)
      if (res.code === '200') {
        this.codeInfo = res.data
      }
    },
    // 新增或编辑条码类型
    handleCurrentRows (row) {
      this.dialogVisible = true
      if (row) {
        this.barCodeForm = { ...row }
      } else {
        let keys = Object.keys(this.barCodeForm)
        keys.forEach(key => {
          this.barCodeForm[key] = ''
        })
      }
    },
    // 新增或编辑成功后关闭弹框
    closeDialog () {
      this.dialogVisible = false
      this.getBarCodeTypeList()
    },
    handleBarCodeType () {
      this.$refs.dialogForm.handleBarCodeType()
    },
    // 删除条码类型
    async deleteRows (id) {
      let ids = id ? [id] : this.selectedList
      if (ids.length > 0) {
        let result = await this.$myPrompt.confirm(this.$t('barcodeType_AreYouSureDeleC'))
        if (result) {
          let res = await this.$api.deleteBarCodeType(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getBarCodeTypeList()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('barcodeType_PleasSeleBarcTy'))
      }
    },
    // 条码详情添加行
    addInfoRows () {
      this.codeInfo.push({
        mPomWorkMasPrintTmplId: this.mPomWorkMasPrintTmplId,
        paramName: '',
        paramValue: '',
        paramDesc: ''
      })
    },
    // 验证打印项目是否重名
    validParamName () {
      let arr = []
      let { codeInfo } = this
      for (let i in codeInfo) {
        if (codeInfo[i].paramName === '') {
          arr.push(false)
        }
        for (let j in codeInfo) {
          if (i !== j) {
            if (codeInfo[i].paramName === codeInfo[j].paramName) {
              arr.push(false)
            }
          }
        }
      }
      return arr.length === 0
    },
    // 条码详情删除当前行
    deleteInfoRows (index) {
      this.codeInfo.splice(index, 1)
    },
    handleInfo () {
      let { mPomWorkMasPrintTmplId } = this
      if (mPomWorkMasPrintTmplId) {
        this.isEdit = true
      } else {
        this.$message.warning(this.$t('barcodeType_PleasSelePrinPr'))
      }
    },
    async addCodeInfo () {
      let { mPomWorkMasPrintTmplId } = this
      let validInfo = this.validParamName()
      if (validInfo) {
        let res = await this.$api.createBarCodeInfo(this.codeInfo)
        let { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
          this.getBarCodeInfo(mPomWorkMasPrintTmplId)
          this.isEdit = false
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning(this.$t('barcodeType_ThereAreNoFillI'))
      }
    }
  },
  created () {
    this.getBarCodeTypeList()
  },
  async beforeRouteLeave (to, from, next) {
    if (this.isEdit) {
      let res = await this.$myPrompt.confirm(this.$t('barcodeType_ThereAreCurrUns'))
      if (res) {
        return this.addCodeInfo()
      } else {
        this.isEdit = false
        next(to.fullPath)
      }
    } else {
      next()
    }
  },
  components: {
    dialogForm
  }
}
</script>
