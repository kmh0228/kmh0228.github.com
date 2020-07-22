<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">条码类型设置</h3>
    <el-form label-position="left" class="el-row">
      <el-form-item label="条码名称" label-width="80px" class="el-col el-col-24">
        <el-input v-model="keyWord" size="mini" style="width:12vw;" @keydown.enter="getBarCodeTypeList">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getBarCodeTypeList">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleCurrentRows('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteRows('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="getBarCodeTypeList">刷新</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="barcodeTable" border highlight-current-row size="mini" @selection-change="selectBarcode" @current-change="tableCurrentChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column label="条码名称" align="center" prop="fileName"  sortable></el-table-column>
        <el-table-column label="打印模块路径" align="center" prop="filePath"  sortable></el-table-column>
        <el-table-column label="模版类型" align="center" prop="fileTypeName"  sortable></el-table-column>
        <el-table-column label="默认数量" align="center" prop="printCopies"  sortable></el-table-column>
        <el-table-column label="操作" align="center"  sortable>
          <template slot-scope="scope" width="120">
            <handle-button @click="handleCurrentRows(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button  @click="deleteRows(scope.row.mPomWorkMasPrintTmplId,scope.$index)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs mes-table">
      <el-tabs v-model="activeName">
        <el-tab-pane label="条码详情" name="info">
          <el-table :data="codeInfo" border size="mini">
            <el-table-column label="序号" align="center" width="60">
              <template slot-scope="scope">
                <p>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column label="打印项目" align="center">
              <template slot-scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.paramName" size="mini"></el-input>
                <p v-else>{{ scope.row.paramName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="打印参数" align="center">
              <template slot-scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.paramValue" size="mini"></el-input>
                <p v-else>{{ scope.row.paramValue }}</p>
              </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template slot-scope="scope">
                <el-input v-if="isEdit" v-model="scope.row.paramDesc" size="mini"></el-input>
                <p v-else>{{ scope.row.paramDesc }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120" v-if="isEdit">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="scope.row.isEdit=true" size="mini">编辑</el-button> -->
                <el-button type="text" style="color:#F56C6C" size="mini" @click="deleteInfoRows(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:1.5vh;">
            <el-button type="primary" v-if="!isEdit" plain size="mini" @click="handleInfo">{{ codeInfo.length>0?'修改':'新增' }}</el-button>
            <el-button type="primary" v-if="isEdit" plain size="mini" @click="addInfoRows">添加</el-button>
            <el-button type="success" v-if="isEdit" plain size="mini" :disabled="codeInfo.length===0" @click="addCodeInfo">保存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="handleType+'条码类型'" :visible.sync="dialogVisible" top="20vh" width="600px">
      <dialog-form v-if="dialogVisible" :formData="barCodeForm"  @close-dialog="closeDialog" :handleType="handleType" ref="dialogForm"></dialog-form>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="handleBarCodeType">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
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
        this.handleType = val.mPomWorkMasPrintTmplId ? '编辑' : '新增'
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
        let result = await this.$myPrompt.confirm('确定删除当前选择的条码类型吗？')
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
        this.$message.warning('请选择需要删除的条码类型！')
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
        this.$message.warning('请先选择打印项目名称！')
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
        this.$message.warning('打印项目名称存在未填项或重复项，请核对后保存！')
      }
    }
  },
  created () {
    this.getBarCodeTypeList()
  },
  async beforeRouteLeave (to, from, next) {
    if (this.isEdit) {
      let res = await this.$myPrompt.confirm('当前存在未保存的条码详情，是否确定保存？')
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
