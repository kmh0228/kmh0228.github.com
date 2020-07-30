<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('docList_DocumListMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input size="mini" v-model="docName" style="width:35%" :placeholder="$t('docList_DocumName')" clearable @keydown.enter.native="getEsopDocList"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button  size="mini" icon="el-icon-search" @click="getEsopDocList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDialog('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteEsopDocList('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
          layout="total,sizes,prev,pager,next,jumper,->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        </el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableChange" >
        <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column prop="department" :label="$t('docList_Depar')" align="center" sortable></el-table-column>
        <el-table-column prop="docType" :label="$t('docList_DocumType')" align="center" sortable></el-table-column>
        <el-table-column prop="docNo" :label="$t('common_DocumNumb')" align="center" width="140" sortable></el-table-column>
        <el-table-column prop="docName" :label="$t('docList_DocumName')" align="center" sortable></el-table-column>
        <el-table-column prop="version" :label="$t('common_editi')" align="center" sortable></el-table-column>
        <el-table-column prop="docDesc" :label="$t('common_Description')" align="center" sortable></el-table-column>
        <el-table-column prop="size" :label="$t('docList_fileSize')" :formatter="formatFileSize" align="center" sortable></el-table-column>
        <el-table-column prop="creator" :label="$t('docList_UploaBy')" align="center" sortable></el-table-column>
        <el-table-column prop="createdDt" :label="$t('docList_UploaTime')" align="center" width="150" sortable></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" min-width="130px" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handleDialog(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="previewFile(scope.row)" iconClass='el-icon-view' :placeholder="$t('docList_brows')"></handle-button>
            <handle-button @click="downloadFile(scope.row)" iconClass='el-icon-download' :placeholder="$t('common_downLoad')"></handle-button>
            <handle-button @click="deleteEsopDocList(scope.row.mComDocId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建/编辑表单 -->
    <el-dialog :visible.sync="showDialog" :title="dialogTitle"  width="600px" class="handle-dialog">
      <dialog-form ref="dialogForm" v-if="showDialog" :isEdit="isEdit" :deptList="deptList" :docTypeList="docTypeList" @getEsopDocList="getEsopDocList" @cannel="closeDialog"></dialog-form>
    </el-dialog>
    <!-- 文件预览 -->
    <el-dialog :visible.sync="showFile" :title="fileName" fullscreen class="mes-dialog-fullscreen">
      <!-- <el-scrollbar> -->
        <div class="pdf-preview-wrap" ref="pdfPreview">
          <div class="pdf-preview-toolbar el-row">
            <div class="el-col-8">
              <el-tooltip placement="top" :content="$t('docList_previPage')">
                <span class="el-icon-back" @click="pdfPageHandle(false)"></span>
              </el-tooltip>
              <el-tooltip placement="top" :content="$t('docList_nextPage')">
                <span class="el-icon-right" @click="pdfPageHandle"></span>
              </el-tooltip>
              <el-tooltip placement="top" :content="$t('docList_enlar')">
                <span class="el-icon-zoom-in" @click="zoomIn"></span>
              </el-tooltip>
              <el-tooltip placement="top" :content="$t('docList_narro')">
                <span class="el-icon-zoom-out" @click="zoomOut"></span>
              </el-tooltip>
              <el-tooltip placement="top" :content="$t('docList_RotatLeft')">
                <span class="el-icon-refresh-left" @click="pdfRotate += 90"></span>
              </el-tooltip>
              <el-tooltip placement="top" :content="$t('docList_TurnRigh')">
                <span class="el-icon-refresh-right" @click="pdfRotate -= 90"></span>
              </el-tooltip>
              <el-tooltip placement="top" :content="$t('docList_FullScre')">
                <span class="el-icon-full-screen" @click="fullScreenHandle"></span>
              </el-tooltip>
            </div>
            <div class="el-col-8">
              <p>{{$t('docList_total')}}{{ pdfPage }}/{{ pdfTotal }}{{$t('docList_page')}}</p>
            </div>
          </div>
          <div :style="{width:`${pdfWidth}%`}" style="height:89%;margin:3vh auto 0;overflow:hidden;" >
            <vue-pdf v-if="showFile" ref="pdf" :src="fileSrc" style="width:100%;heigth:100%" :page="pdfPage" :rotate="pdfRotate" @num-pages="getPdfPageTotal"></vue-pdf>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import vuePdf from 'vue-pdf'
export default {
  data () {
    return {
      queryLevel: 2,
      docName: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      showDialog: false,
      isEdit: false,
      deptList: [],
      docTypeList: [],
      selectList: [],
      fileName: '',
      fileSrc: '',
      showFile: false,
      // pdfPage: 6,
      pdfWidth: 30,
      pdfRotate: 0,
      pdfTotal: 0,
      pdfPage: 1,
      isFullScreen: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('docList_EditDocu') : this.$t('docList_NewDocu')
    }
  },
  methods: {
    // 获取所有部门
    async getDepts () {
      const res = await this.$api.getDeptList()
      if (res.code === '200') {
        this.deptList = res.data
      } else {
        this.deptList = []
      }
    },
    formatFileSize (row, column, cellValue, index) {
      const size = parseFloat(cellValue / 1024 / 1024).toFixed(2)
      return `${size}MB`
    },
    // 获取文档类型列表
    async getDocTypeList () {
      const params = {
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getEsopDocType(params)
      if (res.code === '200') {
        this.docTypeList = res.data.list
      } else {
        this.docTypeList = []
      }
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getEsopDocList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getEsopDocList()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableChange (selection) {
      this.selectList = []
      selection.forEach(val => {
        this.selectList.push(val.mComDocId)
      })
    },
    async getEsopDocList () {
      const { docName, page, queryLevel } = this
      const params = Object.assign({ docName, queryLevel }, page)
      const res = await this.$api.getEsopDocList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    closeDialog () {
      this.showDialog = false
    },
    handleDialog (row) {
      if (row) {
        this.isEdit = true
        this.showDialog = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialogForm.form)
          this.$refs.dialogForm.form = this.$global.filterForm(row, keys)
          this.$refs.dialogForm.form.mComDocId = row.mComDocId
          this.$refs.dialogForm.fileList = [
            {
              name: row.docName,
              status: 'ready',
              size: 0,
              uid: this.$dayjs().valueOf()
            }
          ]
        })
      } else {
        this.isEdit = false
        this.showDialog = true
      }
    },
    async deleteEsopDocList (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('docList_AreYouSureSeleDocu'))
        if (confirm) {
          const res = await this.$api.deleteEsopDocList(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getEsopDocList()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe') + '?')
      }
    },
    // 预览文件
    async previewFile (row) {
      let { docAddress, isEncrypt } = row
      const res = isEncrypt ? await this.$api.downloadEncFileDfs(docAddress) : await this.$api.downloadFileDfs(docAddress)
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const objectUrl = URL.createObjectURL(blob)
      this.fileName = row.docName
      const { suffix } = row
      if (suffix === 'pdf') {
        this.fileSrc = objectUrl
        this.showFile = true
      } else {
        this.$message.warning(this.$t('docList_OnlySuppForTimeBein'))
        // this.fileSrc = `https://view.officeapps.live.com/op/view.aspx?src=${docAddress}`
      }
    },
    pdfPageHandle (isNext = true) {
      if (isNext) {
        this.pdfPage++
        if (this.pdfPage > this.pdfTotal) {
          this.pdfPage = 1
        }
      } else {
        this.pdfPage--
        if (this.pdfPage < 1) {
          this.pdfPage = this.pdfTotal
        }
      }
    },
    getPdfPageTotal (total) {
      if (total) {
        this.pdfTotal = total
      }
    },
    zoomIn () {
      if (this.pdfWidth < 100) {
        this.pdfWidth += 10
      } else {
        this.$message.warning(this.$t('docList_FileEnlaMaxiWidt'))
      }
    },
    zoomOut () {
      if (this.pdfWidth > 30) {
        this.pdfWidth -= 10
      } else {
        this.$message.warning(this.$t('docList_FileReduMiniWidt'))
      }
    },
    // 开启全屏
    openFullScreen () {
      const ele = this.$refs.pdfPreview
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else {
        if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen()
        } else {
          if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen()
          } else {
            if (ele.webkitRequestFullScreen) {
              ele.webkitRequestFullScreen()
            }
          }
        }
      }
    },
    // 关闭全屏
    closeFullScreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else {
        if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else {
          if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else {
            if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen()
            }
          }
        }
      }
    },
    getFullScreenState () {
      this.isFullScreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    },
    fullScreenHandle () {
      const { isFullScreen } = this
      isFullScreen ? this.closeFullScreen() : this.openFullScreen()
    },
    // 下载文件
    async downloadFile (row) {
      // const params = { mComDocId: row.mComDocId }
      // const res = await this.$api.downloadEsopDoc(params)
      // const blob = new Blob([res], {
      //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      // })
      // const objectUrl = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = objectUrl
      // a.download = row.docName
      // a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      // window.URL.revokeObjectURL(blob)
      let { docAddress, isEncrypt } = row
      const res = isEncrypt ? await this.$api.downloadEncFileDfs(docAddress) : await this.$api.downloadFileDfs(docAddress)
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = row.docName
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      window.URL.revokeObjectURL(blob)
    },
    // 刷新
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.docName = ''
      this.getEsopDocList()
    }
  },
  created () {
    this.getDepts()
    this.getDocTypeList()
    this.getEsopDocList()
  },
  mounted () {
    this.getFullScreenState()
    window.addEventListener('resize', () => {
      this.getFullScreenState()
    })
  },
  components: { dialogForm, vuePdf }
}
</script>
