<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('inspection_MaintDeliInspItem')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select style="width:35%;"  v-model="searchForm.itemType" dictType="OQC_TYPE" selectKey="dictCode" clearable @change="initData"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('common_PleasEnte')" v-model.trim="searchForm.keywords" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('common_custo')" class="el-col el-col-11">
            <el-input v-model="searchForm.customerCode" size="mini" :placeholder="$t('common_PleasEnteKeyWor')"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleCheckItem('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteQmsCheckItem('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2 " @click="importDialog = true">{{$t('common_Export')}}</el-button>
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
          <el-table-column type="index" :label="$t('common_Number')" width="50" align="center" :index="indexMethod"></el-table-column>
           <el-table-column prop="inspectItem" :label="$t('common_InspeItem')" align="center" sortable></el-table-column>
          <el-table-column prop="itemTypeDictName" :label="$t('common_type')" align="center" sortable></el-table-column>
          <el-table-column prop="customerCode" :label="$t('common_CustoCode')" align="center" sortable></el-table-column>
          <el-table-column prop="inspectContent" :label="$t('common_InspeCont')" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditor" :label="$t('inspection_LastMain')" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditedDt" :label="$t('inspection_LastMainTime')" align="center" sortable>
            <template slot-scope="scope">
              {{ scope.row.lastEditedDt | formatDateTime }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" >
            <template slot-scope="scope">
              <handle-button @click="handleCheckItem(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteQmsCheckItem(scope.row.mQomOqcCheckitemId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialogForm" @cannel="dialogVisible=false" :isEdit="isEdit" :initData="initData"></dialog-form>
    </el-dialog>
    <!-- 导入文件 -->
    <el-dialog :title="$t('inspection_selecDeliInspBeImpo')" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/checkItem.xlsx" style="color:#3B6F9A;text-decoration:none;" :download="$t('inspection_DelivInspItem') + '.xlsx'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importQmsCheckItem">{{$t('common_ok')}}</el-button>
        <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
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
      return this.isEdit ? this.$t('inspection_EditShipInspItem') : this.$t('inspection_NewDeliInspItem')
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
        let confirmRes = await this.$myPrompt.confirm(this.$t('inspection_AreYouSureInspItem'))
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
        this.$message.warning(this.$t('inspection_selecDeliInspBeDele'))
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
        this.$message.warning(this.$t('inspection_FileTypeMustBeExcel'))
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
        this.$message.warning(this.$t('inspection_uploaDeliInspImpoFirs'))
      }
    }
  },
  created () {
    this.initData()
  },
  components: { dialogForm }
}
</script>
