<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">流程计时器管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input v-model="keywords" size="mini" style="width:35%;" placeholder="计时器名称">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getProducerTimers">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleTimer('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTimer('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
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
        <el-table-column type="index" label="序号" width="50" align="center" :index="indexMethod"></el-table-column>
        <el-table-column label="计时器代码" prop="mComTimerCode" align="center" sortable></el-table-column>
        <el-table-column label="类型" prop="mComTimerType" align="center" width="100" sortable></el-table-column>
        <el-table-column label="描述" prop="mComTimerDesc" align="center" sortable></el-table-column>
        <el-table-column label="是否启用" prop="isInvalid" align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.isInvalid?'danger':''" size="mini">{{ scope.row.isInvalid? '禁用':'启用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handleTimer(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteTimer(scope.row.mComTimerId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs" v-if="showTas">
      <el-card class="mes-table" shadow="never" style="border:none;">
        <div slot="header">
          <span>流程计时器详情</span>
          <div style="float: right;">
            <el-button v-if="editDetail" type="success" plain size="mini" @click="saveDeailList">保存</el-button>
            <el-button v-if="editDetail" type="warning" plain size="mini" @click="cancelDeailList">撤销</el-button>
            <el-button v-else type="primary" plain size="mini" @click="editDetail = true">编辑</el-button>
          </div>
        </div>
        <el-table size="mini" :data="detailList">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column label="控制方法" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.mComTimerDetailMethod" size="mini" style="width:100%;" @change="detailMethodChange(scope.row)">
                <el-option label="最小时间" value="最小时间"></el-option>
                <el-option label="最大时间" value="最大时间"></el-option>
                <el-option label="最小和最大时间" value="最小和最大时间"></el-option>
              </el-select>
              <p v-else>{{ scope.row.mComTimerDetailMethod }}</p>
            </template>
          </el-table-column>
          <el-table-column label="制程" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" filterable clearable v-model="scope.row.mComTimerDetailProcessid" size="mini" style="width:100%;">
                <el-option v-for="(options,i) in processList" :key="i" :label="options.segCode" :value="options.mComProcessSegId" :disabled="porcessDisabled(options.mComProcessSegId)"></el-option>
              </el-select>
              <p v-else>{{ scope.row.segCode }}</p>
            </template>
          </el-table-column>
          <el-table-column label="流程最小时间（min）" align="center">
            <template slot-scope="scope">
              <el-input v-if="editDetail" :disabled="scope.row.minDisabled || scope.row.mComTimerDetailMethod==='最大时间'" v-model.trim="scope.row.mComTimerDetailMintime" size="mini"></el-input>
              <p v-else>{{ scope.row.mComTimerDetailMintime }}</p>
            </template>
          </el-table-column>
          <el-table-column label="流程最大时间（min）" align="center">
            <template slot-scope="scope">
              <el-input v-if="editDetail" :disabled="scope.row.maxDisabled || scope.row.mComTimerDetailMethod==='最小时间'" v-model.trim="scope.row.mComTimerDetailMaxtime" size="mini"></el-input>
              <p v-else>{{ scope.row.mComTimerDetailMaxtime }}</p>
            </template>
          </el-table-column>
          <el-table-column label="控制程度" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.mComTimerDetailLevel" size="mini" style="width:100%;">
                <el-option label="不允许执行" value="不允许执行"></el-option>
                <el-option label="允许执行但进行提示" value="允许执行但进行提示"></el-option>
              </el-select>
              <p v-else>{{ scope.row.mComTimerDetailLevel }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" v-if="editDetail">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delDetailRow(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" plain size="mini" v-if="editDetail"  @click="addDetail" style="margin-top:1vh;">添加</el-button>
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
      return this.isEdit ? '编辑流程计时器' : '新增流程计时器'
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
        let confrim = await this.$myPrompt.confirm('确定删除当前选中的流程计时器吗？')
        if (confrim) {
          const res = await this.$api.deleteProducerTimers(ids)
          this.$myPrompt.handleMsg(res, this.getProducerTimers)
        }
      } else {
        this.$message.warning('请先选择需要删除的流程计时器！')
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
        case '最小时间':
          row.minDisabled = false
          row.maxDisabled = true
          break
        case '最大时间':
          row.minDisabled = true
          row.maxDisabled = false
          break
        case '最小和最大时间':
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
            this.$message.warning(`第${i + 1}行控制方法未选择！`)
            break
          }
          if (!detailList[i].mComTimerDetailProcessid) {
            valid = false
            this.$message.warning(`第${i + 1}行制程未选择！`)
            break
          }
          if (!detailList[i].mComTimerDetailMintime) {
            if (detailList[i].mComTimerDetailMethod !== '最大时间') {
              valid = false
              this.$message.warning(`第${i + 1}行最小时间未填写！`)
              break
            }
          }
          if (!detailList[i].mComTimerDetailMaxtime) {
            if (detailList[i].mComTimerDetailMethod !== '最小时间') {
              valid = false
              this.$message.warning(`第${i + 1}行最大时间未填写！`)
              break
            }
          }
          if (!detailList[i].mComTimerDetailLevel) {
            valid = false
            this.$message.warning(`第${i + 1}行控制程度未选择！`)
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
        this.$message.warning('请先添加流程计时器详情！')
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
