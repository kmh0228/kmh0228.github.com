<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('docType_DocumTypeMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:40%" :placeholder="$t('docType_enterDocuType')" v-model="docType" @keydown.native.enter="getTableData" clearable></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button  size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-plus" @click="handleTable('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-delete-solid" @click="deleteTable('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData"  border size="mini" @selection-change="selectionChange">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" align="center" :label="$t('common_Number')" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="docType" sortable :label="$t('docType_DocumType')" align="center"></el-table-column>
          <el-table-column prop="typeDesc" sortable :label="$t('common_Description')" align="center" ></el-table-column>
          <el-table-column prop="suffix" sortable :label="$t('docType_DocumSuff')" align="center" ></el-table-column>
          <el-table-column prop="mSeqId" sortable :label="$t('docType_DocumNumbRule')" align="center" ></el-table-column>
          <el-table-column prop="browseTool" sortable :label="$t('docType_BrowsTool')" align="center" ></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleTable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteTable(scope.row.mComDoctypeId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px" :close-on-click-modal="false">
      <dialog-from v-if="dialogVisible" @cancel="cancel" ref="dialog" :isEdit="isEdit" @getTableData="getTableData"></dialog-from>
    </el-dialog>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      isEdit: false,
      docType: '',
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('docType_EditDocuType') : this.$t('docType_NewDocuType')
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mComDoctypeId)
      })
    },
    async getTableData () {
      let { docType, page } = this
      let data = Object.assign(page, { docType })
      let res = await this.$api.getEsopDocType(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    handleTable (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mComDoctypeId = row.mComDoctypeId
          this.$refs.dialog.dialogForm.suffix = ''
          let arr = row.suffix.split(';')
          this.$refs.dialog.suffixList = arr
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('docType_AreYouSureSeleInfo') + '?')
        if (confirm) {
          let res = await this.$api.deleteById(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe') + '?')
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.docType = ''
      this.getTableData()
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getTableData()
  },
  components: {
    dialogFrom
  }
}
</script>
