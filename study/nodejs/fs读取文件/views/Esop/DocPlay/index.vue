<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('docPlay_ESOPPlayMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select v-model="search.mPomLineId" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')" style="width:35%;">
          <el-option v-for="(option,i) in lineList" :key="i" :value="option.mPomLineId" :label="option.lineName"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select v-model="search.mComProcessSegId" size="mini" clearable :placeholder="$t('docPlay_selecProc')" style="width:35%;float:right;">
          <el-option v-for="(option,i) in segList" :key="i" :value="option.mComProcessSegId" :label="option.segCode"> </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button  size="mini" icon="el-icon-search" @click="getEsopDocPlayList">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-video-play" @click="playFile">{{$t('docPlay_StartPlay')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
          layout="total,sizes,prev,pager,next,jumper,->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        </el-col>
      </el-row>
      <el-table :data="tableData" size="mini" border>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column :label="$t('common_DocumNumb')" prop="docNo" align="center"></el-table-column>
        <el-table-column :label="$t('docPlay_DocumName')" prop="docName" align="center"></el-table-column>
        <el-table-column :label="$t('common_editi')" prop="version" align="center"></el-table-column>
        <el-table-column :label="$t('common_Process')" prop="segCode" align="center"></el-table-column>
      </el-table>
    </div>
     <!-- 文件播放 -->
    <el-dialog :visible.sync="showFile" :title="fileName" fullscreen class="mes-dialog-fullscreen">
      <div class="pdf-preview-wrap" ref="pdfPreview">
        <div class="pdf-preview-toolbar el-row">
          <div class="el-col-8">
            <el-tooltip placement="top" :content="$t('docPlay_previPage')">
              <span class="el-icon-back" @click="pdfPageHandle(false,true)"></span>
            </el-tooltip>
            <el-tooltip placement="top" :content="$t('docPlay_nextPage')">
              <span class="el-icon-right" @click="pdfPageHandle(true,true)"></span>
            </el-tooltip>
            <el-tooltip placement="top" :content="$t('docPlay_enlar')">
              <span class="el-icon-zoom-in" @click="zoomIn"></span>
            </el-tooltip>
            <el-tooltip placement="top" :content="$t('docPlay_narro')">
              <span class="el-icon-zoom-out" @click="zoomOut"></span>
            </el-tooltip>
            <el-tooltip placement="top" :content="$t('docPlay_RotatLeft')">
              <span class="el-icon-refresh-left" @click="pdfRotate += 90"></span>
            </el-tooltip>
            <el-tooltip placement="top" :content="$t('docPlay_TurnRigh')">
              <span class="el-icon-refresh-right" @click="pdfRotate -= 90"></span>
            </el-tooltip>
            <el-tooltip placement="top" :content="$t('docPlay_FullScre')">
              <span class="el-icon-full-screen" @click="fullScreenHandle"></span>
            </el-tooltip>
          </div>
          <div class="el-col-8">
            <p>{{$t('docPlay_total')}}{{ pdfPage }}/{{ pdfTotal }}{{$t('docPlay_page')}}</p>
          </div>
        </div>
        <div class="pdf-preview-ceontent" @click="playHandle">
          <div :style="{width:`${pdfWidth}%`}" style="height:89%;margin:0 auto;overflow:hidden;" >
            <vue-pdf v-if="showFile" ref="pdf" :src="fileSrc" style="width:100%;heigth:100%" :page="pdfPage" :rotate="pdfRotate" @num-pages="getPdfPageTotal"></vue-pdf>
          </div>
        </div>
        <div class="pdf-preview-play" v-show="showHandle" @mouseenter="mouseEnterIcon" @mouseleave="mouseLeaveIcon" @click.stop="isPlay=!isPlay">
          <i :class="playIconClass"></i>
        </div>
      </div>
        <!-- <iframe :src="fileSrc" width="100%" height="100%" frameborder="0"></iframe> -->
    </el-dialog>
  </div>
</template>

<script>
import vuePdf from 'vue-pdf'
export default {
  data () {
    return {
      search: {
        mPomLineId: '',
        mComProcessSegId: ''
      },
      lineList: [],
      segList: [],
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      // 文件播放
      pdfWidth: 30,
      playFileList: [],
      isPlay: true,
      showHandle: false,
      iocnTimer: null,
      playTimer: null,
      fileIndex: 0,
      fileName: '',
      fileSrc: '',
      showFile: false,
      pdfRotate: 0,
      pdfTotal: 0,
      pdfPage: 1,
      isFullScreen: false
    }
  },
  computed: {
    playIconClass () {
      return this.isPlay ? 'fa fa-pause' : 'fa fa-play'
    }
  },
  watch: {
    showFile (val) {
      if (!val) {
        this.fileIndex = 0
        this.pdfRotate = 0
        this.pdfTotal = 0
        this.pdfPage = 1
        this.clearPlayTimer()
      }
    },
    isPlay (val) {
      if (!val) {
        this.clearPlayTimer()
      } else {
        this.playTimer = setInterval(() => {
          this.pdfPageHandle()
        }, 2000)
      }
    }
  },
  methods: {
    // 获取所有线别
    async getAllLine () {
      const sendData = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getLineList(sendData)
      const { code, data } = res
      if (code === '200') {
        this.lineList = data.list
      } else {
        this.lineList = []
      }
    },
    // 获取制程信息
    async getProcess () {
      const sendData = {
        segCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAllProcessList(sendData)
      const { code, data } = res
      if (code === '200') {
        this.segList = data.list
      } else {
        this.segList = []
      }
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async getEsopDocPlayList () {
      const { search, page } = this
      const params = Object.assign(search, page)
      const res = await this.$api.getEsopDocPlayList(params)
      const { code, data } = res
      if (code === '200') {
        this.total = data.totalNum
        this.tableData = data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.$global.resetForm(this.search)
      this.getEsopDocPlayList()
    },
    // 播放文件
    async playFile () {
      const { tableData, fileIndex } = this
      if (tableData.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('docPlay_onlyPDFPlay'))
        if (confirm) {
          this.playFileList = []
          tableData.forEach(item => {
            if (item.suffix === 'pdf') {
              this.playFileList.push(item)
            }
          })
          if (this.playFileList.length > 0) {
            this.fileName = this.playFileList[fileIndex].docName
            this.fileSrc = this.playFileList[fileIndex].docAddress
            this.playTimer = setInterval(() => {
              this.pdfPageHandle()
            }, 5000)
            this.showFile = true
          } else {
            this.$message.warning(this.$t('docPlay_CurreTherIsIsCorr'))
          }
        }
      } else {
        this.$message.warning(this.$t('docPlay_ThereIsNoPlayList'))
      }
    },
    pdfPageHandle (isNext = true, isManual = false) {
      if (isManual) {
        this.isPlay = false
      }
      if (isNext) {
        this.pdfPage++
        if (this.pdfPage > this.pdfTotal) {
          this.pdfPage = 1
          const { playFileList } = this
          if (playFileList.length > 1) {
            this.fileIndex++
            if (this.fileIndex >= playFileList.length) {
              this.fileIndex = 0
            }
            this.fileName = this.playFileList[this.fileIndex].docName
            this.fileSrc = this.playFileList[this.fileIndex].docAddress
          }
        }
      } else {
        this.pdfPage--
        if (this.pdfPage < 1) {
          const { playFileList } = this
          if (playFileList.length > 1) {
            this.fileIndex--
            if (this.fileIndex < 0) {
              this.fileIndex = playFileList.length - 1
            }
            this.fileName = this.playFileList[this.fileIndex].docName
            this.fileSrc = this.playFileList[this.fileIndex].docAddress
          }
          setTimeout(() => {
            this.pdfPage = this.pdfTotal
          }, 200)
        }
      }
    },
    getPdfPageTotal (total) {
      if (total) {
        this.pdfTotal = total
      }
    },
    playHandle () {
      this.isPlay = !this.isPlay
      this.showHandle = true
      this.iocnTimer = setTimeout(() => {
        this.showHandle = false
      }, 1500)
    },
    clearPlayTimer () {
      if (this.playTimer) {
        clearInterval(this.playTimer)
      }
    },
    mouseEnterIcon () {
      clearTimeout(this.iocnTimer)
      this.showHandle = true
    },
    mouseLeaveIcon () {
      setTimeout(() => {
        this.showHandle = false
      }, 500)
    },
    zoomIn () {
      if (this.pdfWidth < 100) {
        this.pdfWidth += 10
      } else {
        this.$message.warning(this.$t('docPlay_FileEnlaMaxiWidt'))
      }
    },
    zoomOut () {
      if (this.pdfWidth > 30) {
        this.pdfWidth -= 10
      } else {
        this.$message.warning(this.$t('docPlay_FileReduMiniWidt'))
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
    }
  },
  created () {
    this.getAllLine()
    this.getProcess()
    this.getEsopDocPlayList()
  },
  components: { vuePdf }
}
</script>
