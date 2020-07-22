<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">出货检验项目维护</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select style="width:35%;"  v-model="searchForm.itemType" dictType="OQC_TYPE" selectKey="dictCode" clearable @change="initData"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入" v-model.trim="searchForm.keywords" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="客户" class="el-col el-col-11">
            <el-input v-model="searchForm.customerCode" size="mini" placeholder="请输入关键词"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="initData">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleCheckItem('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteQmsCheckItem('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2 " @click="importDialog = true">导出</el-button>
          </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @selection-change="selectChange">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center" :index="indexMethod"></el-table-column>
           <el-table-column prop="inspectItem" label="检验项目" align="center" sortable></el-table-column>
          <el-table-column prop="itemTypeDictName" label="类型" align="center" sortable></el-table-column>
          <el-table-column prop="customerCode" label="客户代码" align="center" sortable></el-table-column>
          <el-table-column prop="inspectContent" label="检验内容" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditor" label="最后维护人" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditedDt" label="最后维护时间" align="center" sortable>
            <template slot-scope="scope">
              {{ scope.row.lastEditedDt | formatDateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120" >
            <template slot-scope="scope">
              <handle-button @click="handleCheckItem(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="deleteQmsCheckItem(scope.row.mQomOqcCheckitemId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialogForm" @cannel="dialogVisible=false" :isEdit="isEdit" :initData="initData"></dialog-form>
    </el-dialog>
    <!-- 导入文件 -->
    <el-dialog title="请选择需要导入的出货检验项目" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          拖动文件至此处，<em>点击上传</em> 或
          <em><a href="static/download/checkItem.xlsx" style="color:#3B6F9A;text-decoration:none;" download="出货检验项目.xlsx" @click="downloadTemplate">模版下载</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importQmsCheckItem">确 定</el-button>
        <el-button @click="closeUploadDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      searchForm: {
        queryLevel: 1,
        itemType: '',
        keywords: '',
        customerCode: ''
      },
      showMoreConditon: false,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      selectList: [],
      isEdit: false,
      dialogVisible: false,
      importDialog: false,
      fileName: '',
      file: ''
    }
  },
  computed: {
    editBtnDisabled () {
      return this.selectList.length !== 1
    },
    deleteBtnDisabled () {
      return this.selectList.length === 0
    },
    dialogTitle () {
      return this.isEdit ? '编辑出货检验项目' : '新增出货检验项目'
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectChange (selection) {
      this.selectList = []
      selection.forEach(item => this.selectList.push(item.mQomOqcCheckitemId))
    },
    async initData () {
      const { searchForm, page } = this
      const data = Object.assign(searchForm, page)
      const res = await this.$api.getCheckItemList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.initData()
    },
    async deleteQmsCheckItem (id) {
      let ids = id ? [id] : this.selectList
      const len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(`确定删除选择的出货检验项目吗？`)
        if (confirmRes) {
          let res = await this.$api.deleteQmsCheckItem(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.initData()
          })
        }
      } else {
        this.$message.warning('请选择需要删除的出货检验项目！')
      }
    },
    handleCheckItem (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialogForm.form)
          this.$refs.dialogForm.form = this.$global.filterForm(row, keys)
          this.$refs.dialogForm.form.mqomOqcCheckitemId = row.mQomOqcCheckitemId
        })
      } else {
        this.isEdit = false
      }
    },
    closeUploadDialog () {
      this.importDialog = false
      this.fileName = ''
      this.fileContent = ''
    },
    downloadTemplate (event) {
      event.stopPropagation()
    },
    beforeUpload (file) {
      const fileName = file.name
      const fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        this.file = file
      } else {
        this.$message.warning('文件类型必须是excel格式!')
      }
      return false
    },
    async importQmsCheckItem () {
      const { file } = this
      if (file) {
        const data = new FormData()
        data.append('file', file)
        const res = await this.$api.importQmsCheckItem(data)
        this.$myPrompt.handleMsg(res, () => {
          this.initData()
        })
      } else {
        this.$message.warning('请先上传需要导入的出货检验项目！')
      }
    }
  },
  created () {
    this.initData()
  },
  components: { dialogForm }
}
</script>
