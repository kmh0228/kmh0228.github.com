<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('controltermM_ContrItemMana')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select style="width:35%;" v-model="searchForm.itemStatus" :placeholder="$t('controltermM_ContrStatItem')" selectKey="dictCode" dictType="ControlItem_Status" clearable @change="selectChange"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button style="float:right;margin-left:10px;" @click="showMore = !showMore"><i class="fa fa-filter"></i></el-button>
        <el-input :placeholder="$t('common_PleasEnteQuerCo')" v-model.trim="searchForm.keyWord" style="width:40%;float:right;" @keydown.enter.native="getSpcControlItem">
          <i slot="suffix" class="el-input__icon" @click="getSpcControlItem"></i>
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;" v-show="showMore">
        <el-form class="el-row mes-search-form" :model="searchForm" ref="searchForm" label-width="30%" label-position="left">
          <el-form-item :label="$t('common_ProduSeries')" class="el-col el-col-12">
            <el-select v-model="searchForm.MComMaterialfamilyId" clearable filterable style="width:100%;" @change="selectChange">
              <el-option v-for="option in productList" :key="option.mComMaterialfamilyId" :label="option.mComMaterialfamilyName" :value="option.mComMaterialfamilyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_ContrName')" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="searchForm.itemCode" :placeholder="$t('controltermM_enterAContName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_Line')" class="el-col el-col-12">
            <el-select v-model="searchForm.MPomLineId" clearable filterable style="width:100%"  @change="selectChange">
              <el-option v-for="option in lineList" :key="option.mPomLineId" :value="option.mPomLineId" :label="option.lineName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_PorN')" class="el-col el-col-11 el-col-offset-1">
            <material-select v-model="searchForm.MComMaterialId" style="width:100%"  @change="selectChange"></material-select>
          </el-form-item>
          <el-form-item :label="$t('common_ContrChar')" class="el-col el-col-12">
            <dict-select style="width:100%;" v-model="searchForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode" @change="selectChange"  clearable></dict-select>
          </el-form-item>
          <el-form-item :label="$t('common_MouldHoleNumb')" class="el-col el-col-11 el-col-offset-1">
            <el-select v-model="searchForm.moldCavityNo" clearable filterable style="width:100%"  @change="selectChange">
              <el-option v-for="(item,i) in moldList" :key="i" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="16">
          <el-button size="mini" icon="el-icon-search" @click="getSpcControlItem">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handletable('',false)">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid"  @click="deleteSpcControlItem('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getSpcControlItem">{{$t('common_Refresh')}}</el-button>
          <span class="split-line">|</span>
          <el-dropdown>
            <el-button size="mini">{{$t('common_Operate')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="exportSpcControlItem">{{$t('controltermM_ExporAll')}}</el-dropdown-item>
              <el-dropdown-item @click.native="importDialog=true">{{$t('controltermM_BatchImpo')}}</el-dropdown-item>
              <el-dropdown-item @click.native="stopSpcControlItem">{{$t('controltermM_EnterPhasDeac')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border @selection-change="tableSelectionChange">
          <el-table-column type="selection" fixed="left" width="50"></el-table-column>
          <el-table-column type="index" fixed="left" width="50" :label="$t('common_Number')" align="center"></el-table-column>
          <el-table-column prop="officeName" sortable :label="$t('common_Department')" width="100" align="center"></el-table-column>
          <el-table-column prop="itemCode" sortable :label="$t('common_ContrName')" width="150" align="center"></el-table-column>
          <el-table-column prop="itemDesc" sortable :label="$t('common_ContrDesc')" width="150" align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" width="150" align="center"></el-table-column>
          <el-table-column prop="materialRev" sortable :label="$t('common_ItemNoRev')" width="100" align="center"></el-table-column>、
          <el-table-column prop="materialfamilyCode" sortable :label="$t('common_ProduSeries')" width="180" align="center"></el-table-column>
          <el-table-column prop="moldCavityNo" sortable :label="$t('common_MouldHoleNumb')" align="center" width="150"></el-table-column>
          <el-table-column prop="lineName" sortable :label="$t('common_Line')" align="center" width="120"></el-table-column>
          <el-table-column prop="stationCode" sortable label="测量站/实验室" align="center" width="150"></el-table-column>
          <el-table-column prop="instrumentName" sortable :label="$t('common_MeasuInst')" align="center" width="120"></el-table-column>
          <el-table-column prop="controlChartTypeName" sortable :label="$t('common_ContrChar')" align="center" width="100"></el-table-column>
          <el-table-column prop="itemStatusName" sortable :label="$t('controltermM_ContrStat')" align="center" width="100">
            <template slot-scope="scope">
              <el-tag :type="setTagColor(scope.row.itemStatus)" size="mini">{{scope.row.itemStatusName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common_Operate')" fixed="right" align="center" width="160">
            <template slot-scope="scope">
              <handle-button @click="handletable(scope.row,false)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
              <handle-button @click="handletable(scope.row,true)" iconClass=' el-icon-document-copy' :placeholder="$t('controltermM_copy')"></handle-button>
              <handle-button @click="deleteSpcControlItem(scope.row.tSpcControlItemId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="1000px" class="handle-dialog" top="7vh">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" :isCopy="isCopy" :productList="productList" :lineList="lineList" @getSpcControlItem="getSpcControlItem"></dialog-form>
    </el-dialog>
    <!-- 批量导入 -->
    <el-dialog :title="$t('controltermM_selecContFileWantImpo')" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/ControlItem.xlsx" style="color:#3B6F9A;text-decoration:none;" download="$t('controltermM_ContrTemp')+'.xlsx'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importSpcControlItem">{{$t('common_ok')}}</el-button>
        <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      productList: [],
      lineList: [],
      moldList: [],
      searchForm: {
        queryLevel: 1,
        itemStatus: '',
        itemCode: '',
        MPomLineId: '',
        MComMaterialId: '',
        MComMaterialfamilyId: '',
        controlChartType: '',
        keyWord: '',
        moldCavityNo: ''
      },
      showMore: false,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      selectList: [],
      total: 0,
      isEdit: false,
      isCopy: false,
      tableData: [],
      dialogVisible: false,
      importDialog: false,
      fileName: '',
      fileContent: ''
    }
  },
  computed: {
    deleteBtnDisabled () {
      return this.selectList.length === 0
    },
    dialogTitle () {
      const { isEdit, isCopy } = this
      return isCopy ? this.$t('controltermM_CopyCont') : isEdit ? this.$t('controltermM_EditCont') : this.$t('controltermM_NewCont')
    }
  },
  methods: {
    setTagColor (itemStatus) {
      let type = ''
      switch (itemStatus) {
        case 'analysis':
          type = ''
          break
        case 'control':
          type = 'warning'
          break
        case 'stop':
          type = 'danger'
          break
        default:
          type = ''
          break
      }
      return type
    },
    selectChange () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getSpcControlItem()
    },
    // 获取所有产品系列
    async getProductList () {
      const params = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getMachine(params)
      const { code, data } = res
      if (code === '200') {
        this.productList = data.list
      } else {
        this.productList = []
      }
    },
    // 获取所有线别
    async getAllLine () {
      const params = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getLineList(params)
      const { code, data } = res
      if (code === '200') {
        this.lineList = data.list
      } else {
        this.lineList = []
      }
    },
    // 获取模穴号/零件位置
    async getSpcMoldCavityNo () {
      const res = await this.$api.getSpcMoldCavityNo()
      const { code, data } = res
      if (code === '200') {
        this.moldList = data
      } else {
        this.moldList = []
      }
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getSpcControlItem()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getSpcControlItem()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async getSpcControlItem () {
      const { searchForm, page } = this
      const params = Object.assign(searchForm, page)
      const res = await this.$api.getSpcControlItem(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.tSpcControlItemId)
      })
    },
    handletable (row, isCopy) {
      this.isCopy = isCopy
      if (row) {
        if (isCopy) {
          this.isEdit = false
        } else {
          this.isEdit = true
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          if (this.isEdit) {
            this.$refs.dialog.dialogForm.tSpcControlItemId = row.tSpcControlItemId
          }
          this.$refs.dialog.materialNo = row.materialNo
          this.$refs.dialog.officeName = row.officeName
          this.$refs.dialog.showAbnormalDialog(false)
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteSpcControlItem (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('controltermM_AreYouSureSeleCont'))
        if (confirm) {
          const res = await this.$api.deleteSpcControlItem(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getSpcControlItem()
          })
        }
      } else {
        this.$message.warning(this.$t('controltermM_selecContBeDeleFirs'))
      }
    },
    async stopSpcControlItem () {
      const ids = this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('controltermM_AreYouSureDeacPhas'))
        if (confirm) {
          const res = await this.$api.stopSpcControlItem(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getSpcControlItem()
          })
        }
      } else {
        this.$message.warning(this.$t('controltermM_selecContThatPhasFirs'))
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    // 导入文件
    // 上传文件 (并验证文件类型是否是excel)
    beforeUpload (file) {
      const fileName = file.name
      const fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        this.fileContent = file
      } else {
        this.$message.warning(this.$t('controltermM_fileTypeExcel'))
      }
      return false
    },
    closeUploadDialog () {
      this.importDialog = false
      this.fileName = ''
      this.fileContent = ''
    },
    downloadTemplate (event) {
      event.stopPropagation()
    },
    async importSpcControlItem () {
      const { fileContent } = this
      if (fileContent) {
        const data = new FormData()
        data.append('file', fileContent)
        const res = await this.$api.importSpcControlItem(data)
        this.$myPrompt.handleMsg(res, () => {
          this.closeUploadDialog()
          this.getSpcControlItem()
        })
      } else {
        this.$message.warning(this.$t('controltermM_uploaContFileImpoFirs'))
      }
    },
    async exportSpcControlItem () {
      const res = await this.$api.exportSpcControlItem()
      let blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      let objectUrl = URL.createObjectURL(blob)
      let a = document.createElement('a')
      a.href = objectUrl
      a.download = this.$t('controltermM_ContrItem') + '.xls'
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      window.URL.revokeObjectURL(blob)
    }
  },
  created () {
    this.getProductList()
    this.getAllLine()
    this.getSpcMoldCavityNo()
    this.getSpcControlItem()
  },
  components: { dialogForm, materialSelect }
}
</script>
