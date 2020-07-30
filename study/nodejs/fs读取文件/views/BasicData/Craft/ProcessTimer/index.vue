<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('processTimer_ProceTimeMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input v-model="keywords" size="mini" style="width:35%;" :placeholder="$t('processTimer_TimerName')">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getProducerTimers">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleTimer('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTimer('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table :data="tabaleData" border size="mini" highlight-current-row @current-change="tableCurrentChange" @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" width="50" align="center" :index="indexMethod"></el-table-column>
        <el-table-column :label="$t('processTimer_TimerCode')" prop="mComTimerCode" align="center" sortable></el-table-column>
        <el-table-column :label="$t('common_type')" prop="mComTimerType" align="center" width="100" sortable></el-table-column>
        <el-table-column :label="$t('common_Description')" prop="mComTimerDesc" align="center" sortable></el-table-column>
        <el-table-column :label="$t('common_Enable')" prop="isInvalid" align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.isInvalid?'danger':''" size="mini">{{ scope.row.isInvalid? $t('common_Disab'):$t('common_Enabl')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handleTimer(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteTimer(scope.row.mComTimerId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-card class="mes-table" shadow="never" style="border:none;">
        <div slot="header">
          <span>{{$t('processTimer_ProceTimeDeta')}}</span>
          <div style="float: right;">
            <el-button v-if="editDetail" type="success" plain size="mini" @click="saveDeailList">{{$t('common_save')}}</el-button>
            <el-button v-if="editDetail" type="warning" plain size="mini" @click="cancelDeailList">{{$t('common_revok')}}</el-button>
            <el-button v-else type="primary" plain size="mini" @click="editDetail = true">{{$t('common_Edit')}}</el-button>
          </div>
        </div>
        <el-table size="mini" :data="detailList">
          <el-table-column type="index" :label="序号" width="50" align="center"></el-table-column>
          <el-table-column :label="$t('processTimer_ContrMeth')" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.mComTimerDetailMethod" size="mini" style="width:100%;" @change="detailMethodChange(scope.row)">
                <el-option :label="$t('processTimer_MinimTime')" :value="$t('processTimer_MinimTime')"></el-option>
                <el-option :label="$t('processTimer_MaximTime')" :value="$t('processTimer_MaximTime')"></el-option>
                <el-option :label="$t('processTimer_MinimAndMaxiTim')" :value="$t('processTimer_MinimAndMaxiTim')"></el-option>
              </el-select>
              <p v-else>{{ scope.row.mComTimerDetailMethod }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common_Process')" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" filterable clearable v-model="scope.row.mComTimerDetailProcessid" size="mini" style="width:100%;">
                <el-option v-for="(options,i) in processList" :key="i" :label="options.segCode" :value="options.mComProcessSegId" :disabled="porcessDisabled(options.mComProcessSegId)"></el-option>
              </el-select>
              <p v-else>{{ scope.row.segCode }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processTimer_MinimProcTime') + '（min）'" align="center">
            <template slot-scope="scope">
              <el-input v-if="editDetail" :disabled="scope.row.minDisabled || scope.row.mComTimerDetailMethod===$t('processTimer_MaximTime')" v-model.trim="scope.row.mComTimerDetailMintime" size="mini"></el-input>
              <p v-else>{{ scope.row.mComTimerDetailMintime }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processTimer_MaximProcTime') + '（min）'" align="center">
            <template slot-scope="scope">
              <el-input v-if="editDetail" :disabled="scope.row.maxDisabled || scope.row.mComTimerDetailMethod===$t('processTimer_MinimTime')" v-model.trim="scope.row.mComTimerDetailMaxtime" size="mini"></el-input>
              <p v-else>{{ scope.row.mComTimerDetailMaxtime }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processTimer_DegreCont')" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.mComTimerDetailLevel" size="mini" style="width:100%;">
                <el-option :label="$t('processTimer_ExecuNotAllo')" :value="$t('processTimer_ExecuNotAllo')"></el-option>
                <el-option :label="$t('processTimer_AllowExecButPro')" :value="$t('processTimer_AllowExecButPro')"></el-option>
              </el-select>
              <p v-else>{{ scope.row.mComTimerDetailLevel }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common_Operate')" width="80" align="center" v-if="editDetail">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delDetailRow(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" plain size="mini" v-if="editDetail"  @click="addDetail" style="margin-top:1vh;">{{$t('common_add')}}</el-button>
      </el-card>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @get-producer-timers="getProducerTimers" :isEdit="isEdit"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      keywords: '',
      queryLevel: 1,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tabaleData: [],
      dialogVisible: false,
      isEdit: false,
      selected: [],
      showTas: false,
      detailList: [],
      processList: [],
      editDetail: false,
      mComTimerId: null,
      minDisabled: false,
      maxDisabled: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('processTimer_EditProcTime') : this.$t('processTimer_NewProcTime')
    },
    editBtnDisabled () {
      return this.selected.length !== 1
    }
  },
  watch: {
    mComTimerId (val) {
      if (val) {
        this.getTimerDetail()
      } else {
        this.showTas = false
      }
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getProducerTimers()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getProducerTimers()
    },
    async getProducerTimers () {
      const { keywords, page, queryLevel } = this
      const data = Object.assign({ keywords, queryLevel }, page)
      const res = await this.$api.getProducerTimers(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tabaleData = res.data.list
      } else {
        this.total = 0
        this.tabaleData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keywords = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getProducerTimers()
    },
    cannel () {
      this.dialogVisible = false
    },
    tableCurrentChange (row) {
      if (row) {
        this.editDetail = false
        this.mComTimerId = row.mComTimerId
      } else {
        this.mComTimerId = ''
      }
    },
    tableSelectionChange (selection) {
      this.selected = []
      selection.map(item => {
        this.selected.push(item.mComTimerId)
      })
    },
    handleTimer (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          const keys = Object.keys(this.$refs.dialog.form)
          this.$refs.dialog.form = this.$global.filterForm(row, keys)
          this.$refs.dialog.form.mComTimerId = row.mComTimerId
          this.$refs.dialog.isInvalid = !row.isInvalid
        })
      } else {
        this.isEdit = false
      }
    },
    async deleteTimer (id) {
      let ids = id ? [id] : this.selected
      const len = ids.length
      if (len > 0) {
        let confrim = await this.$myPrompt.confirm(this.$t('processTimer_AreYouSureDeleC'))
        if (confrim) {
          const res = await this.$api.deleteProducerTimers(ids)
          this.$myPrompt.handleMsg(res, this.getProducerTimers)
        }
      } else {
        this.$message.warning(this.$t('processTimer_PleasSeleProcTi'))
      }
    },
    // 获取制程列表
    async getProcessList () {
      const data = {
        segCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAllProcessList(data)
      if (res.code === '200') {
        this.processList = res.data.list
      } else {
        this.processList = []
      }
    },
    detailMethodChange (row) {
      const value = row.mComTimerDetailMethod
      switch (value) {
        case this.$t('processTimer_MinimTime'):
          row.minDisabled = false
          row.maxDisabled = true
          break
        case this.$t('processTimer_MaximTime'):
          row.minDisabled = true
          row.maxDisabled = false
          break
        case this.$t('processTimer_MinimAndMaxiTim'):
          row.minDisabled = false
          row.maxDisabled = false
          break
        default:
          row.minDisabled = false
          row.maxDisabled = false
          break
      }
      row.mComTimerDetailMintime = ''
      row.mComTimerDetailMaxtime = ''
    },
    delDetailRow (index) {
      this.detailList.splice(index, 1)
    },
    addDetail () {
      this.detailList.push({
        mComTimerDetailMethod: '',
        mComTimerDetailProcessid: '',
        mComTimerDetailMintime: '',
        mComTimerDetailMaxtime: '',
        mComTimerDetailLevel: ''
      })
    },
    async getTimerDetail () {
      const { mComTimerId } = this
      const res = await this.$api.getProducerTimerDetail({ mComTimerDetailTimerid: mComTimerId })
      if (res.code === '200') {
        this.showTas = true
        this.detailList = res.data
      } else {
        this.showTas = false
        this.detailList = []
      }
    },
    porcessDisabled (processId) {
      const { detailList } = this
      const porcessList = []
      detailList.forEach(item => {
        if (item.mComTimerDetailProcessid) {
          porcessList.push(item.mComTimerDetailProcessid)
        }
      })
      return porcessList.indexOf(processId) !== -1
    },
    // 保存详情
    async saveDeailList () {
      const { detailList, mComTimerId } = this
      const len = detailList.length
      let valid = true
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          if (!detailList[i].mComTimerDetailMethod) {
            valid = false
            this.$message.warning(this.$t('processTimer_TheFirs') + (i + 1) + this.$t('processTimer_RowContMethNotS'))
            break
          }
          if (!detailList[i].mComTimerDetailProcessid) {
            valid = false
            this.$message.warning(this.$t('processTimer_TheFirs') + (i + 1) + this.$t('processTimer_LineProcNotSele'))
            break
          }
          if (!detailList[i].mComTimerDetailMintime) {
            if (detailList[i].mComTimerDetailMethod !== this.$t('processTimer_MaximTime')) {
              valid = false
              this.$message.warning(this.$t('processTimer_TheFirs') + (i + 1) + this.$t('processTimer_LineMiniTimeNot'))
              break
            }
          }
          if (!detailList[i].mComTimerDetailMaxtime) {
            if (detailList[i].mComTimerDetailMethod !== '最小时间') {
              valid = false
              this.$message.warning(this.$t('processTimer_TheFirs') + (i + 1) + this.$t('processTimer_LineMaxiTimeNot'))
              break
            }
          }
          if (!detailList[i].mComTimerDetailLevel) {
            valid = false
            this.$message.warning(this.$t('processTimer_TheFirs') + (i + 1) + this.$t('processTimer_RowContLeveNotS'))
            break
          }
        }
        if (valid) {
          const list = []
          const keys = ['mComTimerDetailMethod', 'mComTimerDetailProcessid', 'mComTimerDetailMintime', 'mComTimerDetailMaxtime', 'mComTimerDetailLevel']
          detailList.map(item => {
            let obj = {}
            keys.forEach(key => {
              obj[key] = item[key]
            })
            list.push(obj)
          })
          const data = {
            mComTimerId, detailList: list
          }
          const res = await this.$api.saveProducerTimerDetail(data)
          this.$myPrompt.handleMsg(res, this.getTimerDetail)
          if (res.code === '200') {
            this.editDetail = false
          }
        }
      } else {
        this.$message.warning(this.$t('processTimer_PleasAddProcTim'))
      }
    },
    // 撤销
    cancelDeailList () {
      this.editDetail = false
      this.getTimerDetail()
    }
  },
  created () {
    this.getProducerTimers()
    this.getProcessList()
  },
  components: {
    dialogForm
  }
}
</script>

<style lang="scss">
.mes-main-tabs {
  .el-card {
    .el-card__body {
      padding: 0;
    }
  }
}
</style>
